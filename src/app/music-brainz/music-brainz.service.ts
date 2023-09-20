import { Injectable } from "@angular/core";
import {
  RawMusicBrainzArtistData,
  MusicBrainzArtist,
  MusicBrainzArtistData,
} from "../artists/artist.model";
import { ArtistLocation } from "../country/country.model";
import { CountryService } from "../country/country.service";

@Injectable({
  providedIn: "root",
})
export class MusicBrainzService {
  constructor(private countryService: CountryService) {}

  getArtistData(rawArtistData: RawMusicBrainzArtistData): MusicBrainzArtist | undefined {
    try {
      const musicBrainzArtistData = JSON.parse(rawArtistData.data);

      if (musicBrainzArtistData.artists && Array.isArray(musicBrainzArtistData.artists)) {
        const matchedArtist = musicBrainzArtistData.artists.find(
          (artist: any) => artist.name.toLowerCase() == rawArtistData.name.toLowerCase()
        );
        if (matchedArtist) return matchedArtist;
        return musicBrainzArtistData.artists[0];
      }

      return undefined;
    } catch (error) {
      return undefined;
    }
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
        const countryCode = this.countryService.getCountryCodeByText(artist.country);
        const country = this.countryService.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist.area && artist.area.type == "Country") {
        const countryCode = this.countryService.getCountryCodeByText(artist.area.name);
        const country = this.countryService.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist["begin-area"] && artist["begin-area"].type == "Country") {
        const countryCode = this.countryService.getCountryCodeByText(artist["begin-area"].name);
        const country = this.countryService.getCountryByCode(countryCode);
        if (country.NE_ID != -1) {
          artistLocation.country = country;
          return artistLocation;
        }
      }

      if (artist["end-area"] && artist["end-area"].type == "Country") {
        const countryCode = this.countryService.getCountryCodeByText(artist["end-area"].name);
        const country = this.countryService.getCountryByCode(countryCode);
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
}
