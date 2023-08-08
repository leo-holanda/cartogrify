import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, map, take, tap } from "rxjs";
import { Artist, ScrapedArtist } from "../artists/artist.model";
import { environment } from "src/environments/environment.development";
import {
  Country,
  CountryData,
  IntermediateRegionData,
  RegionData,
  SubRegionData,
  GeoFeature,
  GeoFeatureCollection,
  PossibleCountry,
} from "./country.model";
import countriesJSON from "../../assets/countries-50m.json";
import * as topojson from "topojson-client";
import * as TopoJSON from "topojson-specification";
import { SupabaseService } from "../shared/supabase.service";
import { countryRelatedTerms } from "./country.data";

@Injectable({
  providedIn: "root",
})
export class CountryService {
  geoJSON!: GeoFeatureCollection;

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {
    this.geoJSON = topojson.feature(
      countriesJSON as unknown as TopoJSON.Topology,
      countriesJSON.objects.countries as TopoJSON.GeometryCollection
    );
  }

  getArtistsCountryOfOrigin(artistsNames: string[]): Subject<Artist> {
    const START_INDICATOR_OFFSET = 13;
    const END_INDICATOR_OFFSET = 11;
    const artists$ = new Subject<Artist>();

    fetch(environment.PAGE_FINDER_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + environment.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(artistsNames),
    }).then(async (response) => {
      const textDecoder = new TextDecoder();
      const reader = response.body?.getReader();
      const artists = [];
      let data = "";

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          data += textDecoder.decode(value);
          if (data.includes("START_OF_JSON") && data.includes("END_OF_JSON")) {
            const startIndex = data.indexOf("START_OF_JSON") + START_INDICATOR_OFFSET;
            const endIndex = data.indexOf("END_OF_JSON");
            const artist = JSON.parse(data.slice(startIndex, endIndex));
            artists$.next({
              name: artist.name,
              country: this.determineCountryOfOrigin(artist.page),
            });
            data = data.slice(endIndex + END_INDICATOR_OFFSET);
          }

          if (done) break;
        }
      }
    });

    return artists$;
  }

  findCountryInMetadataTags(document: Document, possibleCountries: Map<string, PossibleCountry>) {
    const metadataTags = document.querySelectorAll("dd.catalogue-metadata-description");
    if (metadataTags.length === 0) return undefined;

    for (let i = 0; i < metadataTags.length; i++) {
      const splittedTag = metadataTags
        .item(i)
        .innerHTML.split(",")
        .map((tagContent) => tagContent.trim().toLowerCase());

      this.geoJSON.features.forEach((currentGeoFeature: GeoFeature) => {
        const geoFeatureName = currentGeoFeature.properties["NAME"].toLowerCase();
        splittedTag.forEach((tagContent) => {
          if (tagContent.includes(geoFeatureName) || geoFeatureName.includes(tagContent)) {
            const currentCountryCount = possibleCountries.get(geoFeatureName)?.count || 0;
            possibleCountries.set(geoFeatureName, {
              count: currentCountryCount + 1,
              geoFeature: currentGeoFeature,
            });
          }
        });
      });
    }
  }

  findCountryInArtistTags(
    document: Document,
    possibleCountries: Map<string, PossibleCountry>
  ): void {
    const artistTags = document.querySelectorAll("ul.tags-list .tag a");

    for (let i = 0; i < artistTags.length; i++) {
      this.geoJSON.features.forEach((currentGeoFeature: GeoFeature) => {
        const geoFeatureName = currentGeoFeature.properties["NAME"].toLowerCase();
        const tagContent = artistTags.item(i).innerHTML.toLowerCase();
        const featureFlag = this.findCountryFlagCode(currentGeoFeature);

        const currentCountryRelatedTerms: string[] = [
          ...countryRelatedTerms[featureFlag].adjectivals,
          ...countryRelatedTerms[featureFlag].demonyms,
          geoFeatureName,
        ];

        currentCountryRelatedTerms.forEach((currentTerm) => {
          if (tagContent.includes(currentTerm) || currentTerm.includes(tagContent)) {
            const currentCountryCount = possibleCountries.get(geoFeatureName)?.count || 0;
            possibleCountries.set(geoFeatureName, {
              count: currentCountryCount + 1,
              geoFeature: currentGeoFeature,
            });
          }
        });
      });
    }
  }

  findCountryInWikiText(document: Document, possibleCountries: Map<string, PossibleCountry>): void {
    const wikiTag = document.querySelector<HTMLDivElement>("div.wiki-block-inner-2");
    if (wikiTag) {
      this.geoJSON.features.find((currentGeoFeature: GeoFeature) => {
        const featureFlag = this.findCountryFlagCode(currentGeoFeature);
        const geoFeatureName = currentGeoFeature.properties["NAME"].toLowerCase();

        const currentCountryRelatedTerms: string[] = [
          ...countryRelatedTerms[featureFlag].adjectivals,
          ...countryRelatedTerms[featureFlag].demonyms,
          geoFeatureName,
        ];

        const wikiText = wikiTag.innerText.toLowerCase();
        currentCountryRelatedTerms.forEach((currentTerm) => {
          if (wikiText.includes(currentTerm)) {
            const currentCountryCount = possibleCountries.get(geoFeatureName)?.count || 0;
            possibleCountries.set(geoFeatureName, {
              count: currentCountryCount + 1,
              geoFeature: currentGeoFeature,
            });
          }
        });
      });
    }
  }

  determineCountryOfOrigin(artistPage: string): Country | undefined {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(artistPage, "text/html");
    const possibleCountries = new Map<string, PossibleCountry>();

    this.findCountryInMetadataTags(htmlDoc, possibleCountries);
    this.findCountryInArtistTags(htmlDoc, possibleCountries);
    this.findCountryInWikiText(htmlDoc, possibleCountries);

    let highestCount = 0;
    let mostLikelyCountry = undefined;
    for (const possibleCountry of possibleCountries.values()) {
      if (possibleCountry.count > highestCount) {
        highestCount = possibleCountry.count;
        mostLikelyCountry = possibleCountry.geoFeature;
      }
    }

    if (!mostLikelyCountry) return undefined;
    return this.createCountryFromFeature(mostLikelyCountry);
  }

  countCountries(artists: Artist[]): CountryData[] {
    const countriesCount = new Map<string, CountryData>();
    const unknownCountry: Country = {
      name: "Unknown",
      flagCode: "xx",
      region: "Unknown",
      subRegion: "Unknown",
      intermediateRegion: "Unknown",
    };

    artists.forEach((artist) => {
      const country = artist.country || unknownCountry;
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

  private createCountryFromFeature(geoFeature: GeoFeature): Country {
    const country: Country = {
      name: geoFeature.properties["NAME"],
      flagCode: this.findCountryFlagCode(geoFeature),
      region: geoFeature.properties["REGION_UN"],
      subRegion: geoFeature.properties["SUBREGION"],
      intermediateRegion: geoFeature.properties["REGION_WB"],
    };

    return country;
  }
}
