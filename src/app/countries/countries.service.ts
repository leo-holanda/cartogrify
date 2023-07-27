import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, take } from "rxjs";
import { Artist, ScrapedArtist } from "../artists/artist.model";
import { environment } from "src/environments/environment.development";
import { countries } from "./countries.data";
import {
  Country,
  CountryData,
  IntermediateRegionData,
  RegionData,
  SubRegionData,
} from "./country.model";

@Injectable({
  providedIn: "root",
})
export class CountriesService {
  constructor(private http: HttpClient) {}

  getArtistsCountryOfOrigin(artistsNames: string[]): Observable<Artist[]> {
    return this.http
      .post<ScrapedArtist[]>(environment.PAGE_FINDER_URL, artistsNames, {
        headers: {
          Authorization: "Bearer " + environment.SUPABASE_ANON_KEY,
        },
      })
      .pipe(
        take(1),
        map((artistsData: ScrapedArtist[]) =>
          artistsData.map((artist) => {
            return {
              name: artist.name,
              country: this.determineCountryOfOrigin(artist.page),
            } as Artist;
          })
        )
      );
  }

  findCountryInMetadataTags(document: Document): Country | undefined {
    const metadataTags = document.querySelectorAll("dd.catalogue-metadata-description");

    let countryOfOrigin = undefined;
    for (let i = 0; i < metadataTags.length; i++) {
      const splittedTag = metadataTags
        .item(i)
        .innerHTML.split(",")
        .map((content) => content.trim());

      countryOfOrigin = countries.find((country) =>
        splittedTag.some(
          (content) => content.includes(country.name) || country.name.includes(content)
        )
      );

      if (countryOfOrigin !== undefined) break;
    }

    return countryOfOrigin;
  }

  findCountryInWikiText(document: Document): Country | undefined {
    const wikiTag = document.querySelector("div.wiki-block-inner-2");
    if (!wikiTag) return undefined;

    return countries.find((country) => wikiTag.innerHTML.includes(country.name));
  }

  findCountryInArtistTags(document: Document): Country | undefined {
    const artistTags = document.querySelectorAll("ul.tags-list tag");

    let countryOfOrigin = undefined;
    for (let i = 0; i < artistTags.length; i++) {
      countryOfOrigin = countries.find((country) =>
        artistTags.item(i).innerHTML.includes(country.name)
      );
      if (countryOfOrigin !== undefined) break;
    }

    return countryOfOrigin;
  }

  determineCountryOfOrigin(artistPage: string): Country | undefined {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(artistPage, "text/html");

    const countryOfOrigin =
      this.findCountryInMetadataTags(htmlDoc) ||
      this.findCountryInArtistTags(htmlDoc) ||
      this.findCountryInWikiText(htmlDoc);

    return countryOfOrigin;
  }

  countCountries(artists: Artist[]): CountryData[] {
    const countriesCount = new Map<string, CountryData>();
    const unknownCountry: Country = {
      code: "xx",
      code3: "xxx",
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

    const sortedCountriesCount = [...countriesCount]
      .sort((a, b) => b[1].count - a[1].count)
      .map((country) => country[1]);

    return sortedCountriesCount;
  }

  countRegions(artists: Artist[]): RegionData[] {
    const regionsMap = new Map<string, RegionData>();
    const unknownRegion: RegionData = {
      name: "Unknown",
      subRegions: [],
      count: 0,
    };

    artists.forEach((artist) => {
      if (!artist.country) {
        unknownRegion.count += 1;
        regionsMap.set(unknownRegion.name, unknownRegion);
      } else {
        artist.country = JSON.parse(artist.country as unknown as string) as Country;
        if (!artist.country.region) {
          unknownRegion.count += 1;
          regionsMap.set(unknownRegion.name, unknownRegion);
        } else {
          const artistRegion = regionsMap.get(artist.country.region);

          if (!artistRegion) {
            const newRegion = this.createRegion(artist);
            regionsMap.set(artist.country.region, newRegion);
          } else {
            artistRegion.count += 1;
            if (artist.country.subRegion) {
              const artistSubRegion = artistRegion.subRegions.find(
                (subRegion) => subRegion.name === artist.country?.subRegion
              );

              if (artistSubRegion) {
                artistSubRegion.count += 1;

                if (artist.country.intermediateRegion) {
                  const artistIntermediateRegion = artistSubRegion.intermediateRegions.find(
                    (intermediateRegion) =>
                      intermediateRegion.name === artist.country?.intermediateRegion
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

    const sortedRegionsData = [...regionsMap]
      .sort((a, b) => b[1].count - a[1].count)
      .map((region) => region[1]);
    return sortedRegionsData;
  }

  private createRegion(artist: Artist): RegionData {
    let artistsIntermediateRegion: IntermediateRegionData | undefined = undefined;
    if (artist.country!.intermediateRegion) {
      artistsIntermediateRegion = {
        name: artist.country!.intermediateRegion,
        count: 1,
      };
    }

    let artistSubRegion: SubRegionData | undefined = undefined;
    if (artist.country!.subRegion) {
      artistSubRegion = {
        name: artist.country!.subRegion,
        count: 1,
        intermediateRegions: artistsIntermediateRegion ? [artistsIntermediateRegion] : [],
      };
    }

    return {
      name: artist.country?.region,
      subRegions: artistSubRegion ? [artistSubRegion] : [],
      count: 1,
    } as RegionData;
  }

  private createSubRegion(artist: Artist): SubRegionData {
    let artistsIntermediateRegion: IntermediateRegionData | undefined = undefined;
    if (artist.country!.intermediateRegion) {
      artistsIntermediateRegion = {
        name: artist.country!.intermediateRegion,
        count: 1,
      };
    }

    return {
      name: artist.country!.subRegion!,
      count: 1,
      intermediateRegions: artistsIntermediateRegion ? [artistsIntermediateRegion] : [],
    };
  }
}
