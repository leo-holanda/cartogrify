import { Country } from "../countries/country.model";

export interface Artist {
  name: string;
  country: Country | undefined;
}

export interface ScrapedArtist {
  name: string;
  page: string;
}
