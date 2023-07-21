import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, take } from "rxjs";
import { Artist, ScrapedArtist } from "../artists/artist.model";
import { environment } from "src/environments/environment.development";
import { countries } from "./countries.data";
import { Country } from "./country.model";

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
      countryOfOrigin = countries.find((country) =>
        metadataTags.item(i).innerHTML.includes(country.name)
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
}
