import { Country } from "../country/country.model";

export interface Artist {
  name: string;
  country: Country | undefined;
}

export interface ScrapedArtist {
  name: string;
  page: string;
}
