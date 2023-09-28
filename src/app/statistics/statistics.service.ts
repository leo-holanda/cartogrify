import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, filter, map } from "rxjs";
import { DiversityIndex, RegionsDiversityIndex } from "../shared/supabase.model";
import { ComparedDiversityData } from "./statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  hasRequested = false;
  private diversityIndexes$ = new BehaviorSubject<DiversityIndex[] | undefined>(undefined);
  private regionsDiversityIndexes$ = new BehaviorSubject<RegionsDiversityIndex[] | undefined>(
    undefined
  );

  constructor(private supabaseService: SupabaseService) {}

  getDiversityIndexes(): Observable<DiversityIndex[] | undefined> {
    if (!this.hasRequested) {
      this.hasRequested = true;
      this.supabaseService.getDiversityIndexes().subscribe((diversityIndexes) => {
        this.diversityIndexes$.next(diversityIndexes);
      });
    }

    return this.diversityIndexes$.asObservable();
  }

  getDiversityIndexesInUserCountry(
    userCountryCode: number
  ): Observable<DiversityIndex[] | undefined> {
    return this.diversityIndexes$.pipe(
      map((diversityIndexes) => {
        return diversityIndexes?.filter((index) => index.countryCode == userCountryCode);
      })
    );
  }

  getComparedDiversity(currentUserCountriesCount: number): Observable<ComparedDiversityData> {
    return this.getDiversityIndexes().pipe(
      filter(
        (diversityIndexes): diversityIndexes is DiversityIndex[] => diversityIndexes != undefined
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

  getComparedDiversityInUserCountry(
    userCountriesCount: number,
    userCountryCode: number
  ): Observable<ComparedDiversityData> {
    return this.getDiversityIndexes().pipe(
      filter(
        (diversityIndexes): diversityIndexes is DiversityIndex[] => diversityIndexes != undefined
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
    if (!this.hasRequested) {
      this.hasRequested = true;
      this.supabaseService
        .getRegionsDiversityIndexes()
        .pipe(
          map((regionsDiversityIndex) => {
            return regionsDiversityIndex.filter(
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
