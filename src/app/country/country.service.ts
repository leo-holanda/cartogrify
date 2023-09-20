import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, of, take } from "rxjs";
import { Artist, MusicBrainzArtistData, ScrapedArtist } from "../artists/artist.model";
import {
  Country,
  CountryCount,
  GeoFeature,
  GeoFeatureCollection,
  ArtistLocation,
} from "./country.model";
import countriesJSON from "../../assets/countries-50m.json";
import * as topojson from "topojson-client";
import * as TopoJSON from "topojson-specification";
import { SupabaseService } from "../shared/supabase.service";
import { HttpClient } from "@angular/common/http";
import { CountryPopularity } from "../shared/supabase.model";

@Injectable({
  providedIn: "root",
})
export class CountryService {
  geoJSON!: GeoFeatureCollection;
  countriesCount$ = new BehaviorSubject<CountryCount[]>([]);

  unknownCountry: Country = {
    name: "Unknown",
    flagCode: "xx",
    region: "Unknown",
    subRegion: "Unknown",
    intermediateRegion: "Unknown",
    NE_ID: -1,
  };

  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
    this.geoJSON = topojson.feature(
      countriesJSON as unknown as TopoJSON.Topology,
      countriesJSON.objects.countries as TopoJSON.GeometryCollection
    );
  }

  getCountriesCount(): Observable<CountryCount[]> {
    return this.countriesCount$.asObservable();
  }

  updateCountriesCount(artists: Artist[]): void {
    const countriesCount = new Map<string, CountryCount>();

    artists.forEach((artist) => {
      const country = artist.country || this.unknownCountry;
      const count = countriesCount.get(country.name)?.count || 0;
      const countryCount = {
        country: country,
        count: count + 1,
      };
      countriesCount.set(country.name, countryCount);
    });

    const sortedCountriesCount = [...countriesCount]
      .sort((a, b) => b[1].count - a[1].count)
      .map((country) => country[1]);

    this.countriesCount$.next(sortedCountriesCount);
  }

  findCountryFlagCode(geoFeature: GeoFeature): string {
    let flagCode = "xx";
    if (!geoFeature.properties) return flagCode;

    const valuesToReject = ["-99", -99, "-099"];
    if (
      geoFeature.properties["ISO_A2"] &&
      !valuesToReject.includes(geoFeature.properties["ISO_A2"])
    )
      flagCode = geoFeature.properties["ISO_A2"];
    else if (
      geoFeature.properties["ISO_A2_EH"] &&
      !valuesToReject.includes(geoFeature.properties["ISO_A2_EH"])
    )
      flagCode = geoFeature.properties["ISO_A2_EH"];
    else if (
      geoFeature.properties["UN_A3"] &&
      !valuesToReject.includes(geoFeature.properties["UN_A3"])
    )
      flagCode = geoFeature.properties["UN_A3"];
    else if (
      geoFeature.properties["POSTAL"] &&
      !valuesToReject.includes(geoFeature.properties["POSTAL"])
    )
      flagCode = geoFeature.properties["POSTAL"];
    else if (
      geoFeature.properties["FIPS_10"] &&
      !valuesToReject.includes(geoFeature.properties["FIPS_10"])
    )
      flagCode = geoFeature.properties["FIPS_10"];

    if (flagCode === "CN-TW") flagCode = "TW";
    return flagCode.toLowerCase();
  }

  createCountryFromFeature(geoFeature: GeoFeature): Country {
    const country: Country = {
      name: geoFeature.properties["NAME"],
      flagCode: this.findCountryFlagCode(geoFeature),
      region: geoFeature.properties["REGION_UN"],
      subRegion: geoFeature.properties["SUBREGION"],
      intermediateRegion: geoFeature.properties["REGION_WB"],
      NE_ID: geoFeature.properties["NE_ID"],
    };

    return country;
  }

  saveSuggestions(suggestionsToSave: ScrapedArtist[]): void {
    if (suggestionsToSave.length > 0) this.supabaseService.saveSuggestions(suggestionsToSave);
  }

  getCountryByCode(countryCode: number | undefined): Country {
    if (!countryCode) return this.unknownCountry;

    const matchedFeature = this.geoJSON.features.find(
      (feature) => feature.properties["NE_ID"] == countryCode
    );
    if (matchedFeature) return this.createCountryFromFeature(matchedFeature);

    return this.unknownCountry;
  }

  getCountryCodeByText(countryNameOrAbbreviation: string): number | undefined {
    const matchedFeature = this.geoJSON.features.find(
      (feature) =>
        feature.properties["NAME"].toLowerCase() == countryNameOrAbbreviation.toLowerCase() ||
        this.findCountryFlagCode(feature) == countryNameOrAbbreviation.toLocaleLowerCase()
    );

    if (matchedFeature) return matchedFeature.properties["NE_ID"];
    return undefined;
  }

  getArtistLocation(artistData: MusicBrainzArtistData): ArtistLocation {
    const artistLocation: ArtistLocation = {
      country: undefined,
      secondaryLocation: undefined,
    };

    const artist = artistData.artistDataFromMusicBrainz;
    if (artist == undefined) return artistLocation;

    try {
      if (artist.country) {
        const countryCode = this.getCountryCodeByText(artist.country);
        const country = this.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist.area && artist.area.type == "Country") {
        const countryCode = this.getCountryCodeByText(artist.area.name);
        const country = this.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist["begin-area"] && artist["begin-area"].type == "Country") {
        const countryCode = this.getCountryCodeByText(artist["begin-area"].name);
        const country = this.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist["end-area"] && artist["end-area"].type == "Country") {
        const countryCode = this.getCountryCodeByText(artist["end-area"].name);
        const country = this.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist.area) {
        artistLocation.secondaryLocation = artist.area.name;
        return artistLocation;
      }

      if (artist["begin-area"]) {
        artistLocation.secondaryLocation = artist["begin-area"].name;
        return artistLocation;
      }

      if (artist["end-area"]) {
        artistLocation.secondaryLocation = artist["end-area"].name;
        return artistLocation;
      }

      return artistLocation;
    } catch (error) {
      return artistLocation;
    }
  }

  getCountriesPopularity(): Observable<CountryPopularity[]> {
    return this.supabaseService.getCountriesPopularity().pipe(
      map((countryPopularity) => {
        return countryPopularity
          .map((country): CountryPopularity => {
            return {
              country: this.getCountryByCode(country.countryCode),
              popularity: country.popularity,
            };
          })
          .sort((a, b) => {
            if (a.popularity > b.popularity) return -1;
            if (a.popularity < b.popularity) return 1;
            if ((a.country?.name || "") > (b.country?.name || "")) return 1;
            if ((a.country?.name || "") < (b.country?.name || "")) return -1;
            return 0;
          });
      })
    );
  }

  findCountryBySecondaryLocation(secondaryLocation: string): Observable<Country> {
    return this.findCompleteLocation(secondaryLocation).pipe(
      take(1),
      map((completeLocation) => {
        if (completeLocation == undefined) return this.unknownCountry;

        const splittedLocation: string[] = completeLocation
          .split(",")
          .map((location: string) => location.toLowerCase().trim());

        const geoFeature = this.geoJSON.features.find((feature) => {
          return splittedLocation.some((location) => {
            return (
              feature.properties["NAME"].toLowerCase().includes(location) ||
              location.includes(feature.properties["NAME"].toLowerCase())
            );
          });
        });

        if (geoFeature) return this.createCountryFromFeature(geoFeature as GeoFeature);
        return this.unknownCountry;
      })
    );
  }

  private findCompleteLocation(secondaryLocation: string): Observable<string | undefined> {
    return this.http.get(`https://geocode.maps.co/search?q={${secondaryLocation}}`).pipe(
      take(1),
      map((response: unknown) => this.getLocationFromResponse(response)),
      catchError(() => {
        return of(undefined);
      })
    );
  }

  private getLocationFromResponse(response: unknown): string | undefined {
    if (Array.isArray(response) && response.length > 0)
      return response[0]["display_name"] || undefined;

    return undefined;
  }
}
