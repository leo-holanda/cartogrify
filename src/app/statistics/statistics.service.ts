import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, filter, map } from "rxjs";
import { CountryDiversityIndex, RegionsDiversityIndex } from "../shared/supabase.model";
import { ComparedDiversityData } from "./statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  hasRequestedCountriesDiversity = false;
  hasRequestedRegionsDiversity = false;

  private countriesDiversityIndexes$ = new BehaviorSubject<CountryDiversityIndex[] | undefined>(
    undefined
  );
  private regionsDiversityIndexes$ = new BehaviorSubject<RegionsDiversityIndex[] | undefined>(
    undefined
  );

  constructor(private supabaseService: SupabaseService) {}

  getCountriesDiversityIndexes(): Observable<CountryDiversityIndex[] | undefined> {
    if (!this.hasRequestedCountriesDiversity) {
      this.hasRequestedCountriesDiversity = true;
      this.supabaseService.getDiversityIndexes().subscribe((diversityIndexes) => {
        this.countriesDiversityIndexes$.next(diversityIndexes);
      });
    }

    return this.countriesDiversityIndexes$.asObservable();
  }

  getCountriesDiversityIndexesInUserCountry(
    userCountryCode: number
  ): Observable<CountryDiversityIndex[] | undefined> {
    return this.countriesDiversityIndexes$.pipe(
      map((diversityIndexes) => {
        return diversityIndexes?.filter((index) => index.countryCode == userCountryCode);
      })
    );
  }

  getCountriesComparedDiversity(
    currentUserCountriesCount: number
  ): Observable<ComparedDiversityData> {
    return this.getCountriesDiversityIndexes().pipe(
      filter(
        (diversityIndexes): diversityIndexes is CountryDiversityIndex[] =>
          diversityIndexes != undefined
      ),
      map((diversityIndexes) => {
        const allUsersDiversity = [];
        allUsersDiversity.push(currentUserCountriesCount);

        diversityIndexes.forEach((index) => {
          const indexArray = Array(index.occurrenceQuantity).fill(index.countriesCount);
          allUsersDiversity.push(...indexArray);
        });

        allUsersDiversity.sort((a, b) => a - b);

        const currentUserIndex = allUsersDiversity.findIndex(
          (index) => index === currentUserCountriesCount
        );

        allUsersDiversity.splice(currentUserIndex, 1);

        let comparedDiversity;
        if (currentUserIndex != -1) {
          comparedDiversity =
            ((currentUserIndex / allUsersDiversity.length) * 100).toFixed(0) + "%";
        } else {
          comparedDiversity = "0%";
        }

        return {
          comparedDiversity,
          totalUsers: allUsersDiversity.length,
        };
      })
    );
  }

  getCountriesComparedDiversityInUserCountry(
    userCountriesCount: number,
    userCountryCode: number
  ): Observable<ComparedDiversityData> {
    return this.getCountriesDiversityIndexes().pipe(
      filter(
        (diversityIndexes): diversityIndexes is CountryDiversityIndex[] =>
          diversityIndexes != undefined
      ),
      map((diversityIndexes) => {
        const allUsersDiversity = [];
        allUsersDiversity.push(userCountriesCount);

        diversityIndexes.forEach((index) => {
          if (index.countryCode == userCountryCode) {
            const indexArray = Array(index.occurrenceQuantity).fill(index.countriesCount);
            allUsersDiversity.push(...indexArray);
          }
        });

        allUsersDiversity.sort((a, b) => a - b);

        const currentUserIndex = allUsersDiversity.findIndex(
          (index) => index === userCountriesCount
        );

        allUsersDiversity.splice(currentUserIndex, 1);

        let comparedDiversity;
        if (currentUserIndex != -1) {
          comparedDiversity =
            ((currentUserIndex / allUsersDiversity.length) * 100).toFixed(0) + "%";
        } else {
          comparedDiversity = "0%";
        }

        return {
          comparedDiversity,
          totalUsers: allUsersDiversity.length,
        };
      })
    );
  }

  getRegionsDiversity(): Observable<RegionsDiversityIndex[] | undefined> {
    if (!this.hasRequestedRegionsDiversity) {
      this.hasRequestedRegionsDiversity = true;
      this.supabaseService
        .getRegionsDiversityIndexes()
        .pipe(
          map((regionsDiversityIndexes) => {
            return regionsDiversityIndexes.filter(
              (diversityIndex) =>
                diversityIndex.regionsCount != null && diversityIndex.countryCode != null
            );
          })
        )
        .subscribe((regionsDiversityIndex) => {
          this.regionsDiversityIndexes$.next(regionsDiversityIndex);
        });
    }

    return this.regionsDiversityIndexes$.asObservable();
  }
}
