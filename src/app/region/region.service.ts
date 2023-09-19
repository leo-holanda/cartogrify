import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Artist } from "../artists/artist.model";
import {
  RegionCount,
  CountryFromSubRegionCount,
  IntermediateRegionCount,
  SubRegionCount,
  Country,
} from "../country/country.model";
import { CountryService } from "../country/country.service";

@Injectable({
  providedIn: "root",
})
export class RegionService {
  userRegions$ = new BehaviorSubject<RegionCount[]>([]);

  unknownCountry: Country = {
    name: "Unknown",
    flagCode: "xx",
    region: "Unknown",
    subRegion: "Unknown",
    intermediateRegion: "Unknown",
    NE_ID: -1,
  };

  constructor(private countryService: CountryService) {}

  getUserRegions(): Observable<RegionCount[]> {
    return this.userRegions$.asObservable();
  }

  updateRegionsCount(artists: Artist[]): void {
    const regionsMap = new Map<string, RegionCount>();
    const unknownRegion: RegionCount = {
      name: "Unknown",
      intermediateRegions: [],
      count: 0,
    };

    artists.forEach((artist) => {
      if (!artist.country || !artist.country.region) {
        unknownRegion.count += 1;
        regionsMap.set(unknownRegion.name, unknownRegion);
        return;
      }

      const artistRegion = regionsMap.get(artist.country.region);
      if (!artistRegion) {
        const newRegion = this.createRegion(artist);
        regionsMap.set(artist.country.region, newRegion);
        return;
      }

      artistRegion.count += 1;
      const artistIntermediateRegion = artistRegion.intermediateRegions.find(
        (intermediateRegion) =>
          intermediateRegion.name === (artist.country?.intermediateRegion || "Unknown")
      );

      if (artistIntermediateRegion) {
        artistIntermediateRegion.count += 1;

        const artistSubRegion = artistIntermediateRegion.subRegions.find(
          (subRegion) => subRegion.name === (artist.country?.subRegion || "Unknown")
        );

        if (artistSubRegion) {
          artistSubRegion.count += 1;

          const countryFromSubRegion = artistSubRegion.countriesCount.find(
            (countryCount) => countryCount.country.NE_ID === artist.country?.NE_ID
          );

          if (countryFromSubRegion) {
            countryFromSubRegion.count += 1;
          } else {
            const newCountryCount: CountryFromSubRegionCount = {
              country:
                this.countryService.getCountryByCode(artist.country.NE_ID) || this.unknownCountry,
              count: 1,
            };
            artistSubRegion.countriesCount.push(newCountryCount);
          }
        } else {
          artistIntermediateRegion.subRegions.push(...this.createSubRegion(artist));
        }
      } else {
        const newIntermediateRegion = this.createIntermediateRegion(artist);
        artistRegion.intermediateRegions.push(newIntermediateRegion);
      }

      regionsMap.set(artist.country.region, artistRegion);
    });

    const sortedRegionsCount = [...regionsMap]
      .sort((a, b) => b[1].count - a[1].count)
      .map((region) => region[1]);

    this.userRegions$.next(sortedRegionsCount);
  }

  private createRegion(artist: Artist): RegionCount {
    return {
      name: artist.country?.region,
      intermediateRegions: [this.createIntermediateRegion(artist)],
      count: 1,
    } as RegionCount;
  }

  private createIntermediateRegion(artist: Artist): IntermediateRegionCount {
    return {
      name: artist.country!.intermediateRegion!,
      count: 1,
      subRegions: this.createSubRegion(artist),
    };
  }

  private createSubRegion(artist: Artist): SubRegionCount[] {
    const unknownCountry: Country = {
      name: "Unknown",
      flagCode: "xx",
      region: "Unknown",
      subRegion: "Unknown",
      intermediateRegion: "Unknown",
      NE_ID: 0,
    };
    const artistCountryCount: CountryFromSubRegionCount = {
      country: this.countryService.getCountryByCode(artist.country?.NE_ID) || unknownCountry,
      count: 1,
    };

    const artistSubRegion: SubRegionCount = {
      name: artist.country!.subRegion || "Unknown",
      count: 1,
      countriesCount: [artistCountryCount],
    };

    return [artistSubRegion];
  }
}
