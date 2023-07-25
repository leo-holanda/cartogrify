import { Component, OnInit } from "@angular/core";
import { ArtistService } from "./artist.service";
import { CountriesService } from "../countries/countries.service";
import { BehaviorSubject } from "rxjs";
import { SpotifyService } from "../streaming/spotify.service";
import { Artist } from "./artist.model";
import {
  CountryData,
  RegionData,
  Country,
  IntermediateRegionData,
  SubRegionData,
} from "../countries/country.model";

enum DataTypes {
  COUNTRIES = "countries",
  REGIONS = "regions",
  ARTISTS = "artists",
}

@Component({
  selector: "msm-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.scss"],
})
export class ArtistsComponent implements OnInit {
  artists$ = new BehaviorSubject<Artist[]>([]);
  countries: [string, CountryData][] = [];
  regions: [string, RegionData][] = [];
  selectedData = DataTypes.COUNTRIES;

  DataTypes = DataTypes;

  constructor(
    private spotifyService: SpotifyService,
    private artistService: ArtistService,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.spotifyService.getUserTopArtists().subscribe((topArtists) => {
      const topArtistsNames = topArtists.items.map((artist) => artist.name.toLowerCase());
      this.artistService.getArtistsByName(topArtistsNames).subscribe((artistsFromDatabase) => {
        const artistsWithoutCountry = this.findArtistsWithoutCountry(
          topArtistsNames,
          artistsFromDatabase
        );

        if (artistsWithoutCountry.length > 0) {
          this.countriesService
            .getArtistsCountryOfOrigin(artistsWithoutCountry)
            .subscribe((scrapedArtists) => {
              this.artistService.saveArtists(scrapedArtists);
              this.artists$.next([...artistsFromDatabase, ...scrapedArtists]);
            });
        } else {
          this.artists$.next(artistsFromDatabase);
        }
      });
    });

    this.artists$.subscribe((artists) => {
      this.countries = this.countCountries(artists);
      this.regions = this.countRegions(artists);
    });
  }

  findArtistsWithoutCountry(
    topArtistsNames: string[],
    artistsFromDatabase: Artist[] | null
  ): string[] {
    return topArtistsNames.filter(
      (topArtistName) =>
        !artistsFromDatabase?.some(
          (artistsFromDatabase) => topArtistName === artistsFromDatabase.name
        )
    );
  }

  countCountries(artists: Artist[]): [string, CountryData][] {
    const countriesCount = new Map<string, CountryData>();
    const unknownCountry: Country = {
      code: "xx",
      name: "Unknown",
      region: "Unknown",
      subRegion: "Unknown",
      intermediateRegion: "Unknown",
    };

    artists.forEach((artist) => {
      const country = JSON.parse(artist.country as unknown as string) || unknownCountry;
      const count = countriesCount.get(country.name)?.count || 0;
      const countryData = {
        country: country,
        count: count + 1,
      };
      countriesCount.set(country.name, countryData);
    });

    const sortedCountriesCount = [...countriesCount].sort((a, b) => b[1].count - a[1].count);

    return sortedCountriesCount;
  }

  countRegions(artists: Artist[]): [string, RegionData][] {
    const regionsMap = new Map<string, RegionData>();
    const unknownRegion: RegionData = {
      regionName: "Unknown",
      subRegions: [],
      count: 0,
    };

    artists.forEach((artist) => {
      if (!artist.country) {
        unknownRegion.count += 1;
        regionsMap.set(unknownRegion.regionName, unknownRegion);
      } else {
        artist.country = JSON.parse(artist.country as unknown as string) as Country;
        if (!artist.country.region) {
          unknownRegion.count += 1;
          regionsMap.set(unknownRegion.regionName, unknownRegion);
        } else {
          const artistRegion = regionsMap.get(artist.country.region);

          if (!artistRegion) {
            const newRegion = this.createRegion(artist);
            regionsMap.set(artist.country.region, newRegion);
          } else {
            artistRegion.count += 1;
            if (artist.country.subRegion) {
              const artistSubRegion = artistRegion.subRegions.find(
                (subRegion) => subRegion.subRegionName === artist.country?.subRegion
              );

              if (artistSubRegion) {
                artistSubRegion.count += 1;

                if (artist.country.intermediateRegion) {
                  const artistIntermediateRegion = artistSubRegion.intermediateRegions.find(
                    (intermediateRegion) =>
                      intermediateRegion.intermediateRegionName ===
                      artist.country?.intermediateRegion
                  );

                  if (artistIntermediateRegion) artistIntermediateRegion.count += 1;
                  regionsMap.set(artist.country.region, artistRegion);
                }
              } else {
                const newSubRegion = this.createSubRegion(artist);
                artistRegion.subRegions.push(newSubRegion);
                regionsMap.set(artist.country.region, artistRegion);
              }
            }
          }
        }
      }
    });

    const sortedRegionsData = [...regionsMap].sort((a, b) => b[1].count - a[1].count);
    return sortedRegionsData;
  }

  setSelectedData(dataType: DataTypes): void {
    this.selectedData = dataType;
  }

  private createRegion(artist: Artist): RegionData {
    let artistsIntermediateRegion: IntermediateRegionData | undefined = undefined;
    if (artist.country!.intermediateRegion) {
      artistsIntermediateRegion = {
        intermediateRegionName: artist.country!.intermediateRegion,
        count: 1,
      };
    }

    let artistSubRegion: SubRegionData | undefined = undefined;
    if (artist.country!.subRegion) {
      artistSubRegion = {
        subRegionName: artist.country!.subRegion,
        count: 1,
        intermediateRegions: artistsIntermediateRegion ? [artistsIntermediateRegion] : [],
      };
    }

    return {
      regionName: artist.country?.region,
      subRegions: artistSubRegion ? [artistSubRegion] : [],
      count: 1,
    } as RegionData;
  }

  private createSubRegion(artist: Artist): SubRegionData {
    let artistsIntermediateRegion: IntermediateRegionData | undefined = undefined;
    if (artist.country!.intermediateRegion) {
      artistsIntermediateRegion = {
        intermediateRegionName: artist.country!.intermediateRegion,
        count: 1,
      };
    }

    return {
      subRegionName: artist.country!.subRegion!,
      count: 1,
      intermediateRegions: artistsIntermediateRegion ? [artistsIntermediateRegion] : [],
    };
  }
}
