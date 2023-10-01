import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, filter, map } from "rxjs";
import {
  CountryDiversityIndex,
  RegionsDiversityIndex,
  SubRegionsDiversityIndex,
} from "../shared/supabase.model";
import { ComparedDiversityData } from "./statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  hasRequestedCountriesDiversity = false;
  hasRequestedRegionsDiversity = false;
  hasRequestedSubRegionsDiversity = false;

  private countriesDiversityIndexes$ = new BehaviorSubject<CountryDiversityIndex[] | undefined>(
    undefined
  );
  private regionsDiversityIndexes$ = new BehaviorSubject<RegionsDiversityIndex[] | undefined>(
    undefined
  );
  private subRegionsDiversityIndexes$ = new BehaviorSubject<SubRegionsDiversityIndex[] | undefined>(
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
              (diversityIndex) => diversityIndex.regionsCount != null
            );
          })
        )
        .subscribe((regionsDiversityIndex) => {
          this.regionsDiversityIndexes$.next(regionsDiversityIndex);
        });
    }

    return this.regionsDiversityIndexes$.asObservable();
  }

  getRegionsDiversityInUserCountry(userCountryCode: number): Observable<RegionsDiversityIndex[]> {
    return this.getRegionsDiversity().pipe(
      filter(
        (diversityIndexes): diversityIndexes is RegionsDiversityIndex[] =>
          diversityIndexes != undefined
      ),
      map((diversityIndexes) => {
        return diversityIndexes.filter(
          (diversityIndex) => diversityIndex.countryCode == userCountryCode
        );
      })
    );
  }

  getComparedRegionsDiversity(
    currentUserRegionsCount: number,
    userCountryCode: number | undefined = undefined
  ): Observable<ComparedDiversityData> {
    let regionsDiversitySource;
    if (userCountryCode)
      regionsDiversitySource = this.getRegionsDiversityInUserCountry(userCountryCode);
    else regionsDiversitySource = this.getRegionsDiversity();

    return regionsDiversitySource.pipe(
      filter(
        (diversityIndexes): diversityIndexes is RegionsDiversityIndex[] =>
          diversityIndexes != undefined
      ),
      map((diversityIndexes) => {
        const usersRegionDiversity = [];
        usersRegionDiversity.push(currentUserRegionsCount);

        diversityIndexes.forEach((index) => {
          const indexArray = Array(index.occurrenceQuantity).fill(index.regionsCount);
          usersRegionDiversity.push(...indexArray);
        });

        usersRegionDiversity.sort((a, b) => a - b);

        const currentUserIndex = usersRegionDiversity.findIndex(
          (index) => index === currentUserRegionsCount
        );

        usersRegionDiversity.splice(currentUserIndex, 1);

        let comparedDiversity;
        if (currentUserIndex != -1) {
          comparedDiversity =
            ((currentUserIndex / usersRegionDiversity.length) * 100).toFixed(0) + "%";
        } else {
          comparedDiversity = "0%";
        }

        return {
          comparedDiversity,
          totalUsers: usersRegionDiversity.length,
        };
      })
    );
  }

  getSubRegionsDiversity(): Observable<SubRegionsDiversityIndex[] | undefined> {
    if (!this.hasRequestedSubRegionsDiversity) {
      this.hasRequestedSubRegionsDiversity = true;

      this.supabaseService
        .getSubRegionsDiversityIndexes()
        .pipe(
          map((subRegionsDiversityIndexes) => {
            return subRegionsDiversityIndexes.filter(
              (diversityIndex) => diversityIndex.subRegionsCount != null
            );
          })
        )
        .subscribe((subRegionsDiversityIndex) => {
          this.subRegionsDiversityIndexes$.next(subRegionsDiversityIndex);
        });
    }

    return this.subRegionsDiversityIndexes$.asObservable();
  }

  getSubRegionsDiversityInUserCountry(
    userCountryCode: number
  ): Observable<SubRegionsDiversityIndex[]> {
    return this.getSubRegionsDiversity().pipe(
      filter(
        (diversityIndexes): diversityIndexes is SubRegionsDiversityIndex[] =>
          diversityIndexes != undefined
      ),
      map((diversityIndexes) => {
        return diversityIndexes.filter(
          (diversityIndex) => diversityIndex.countryCode == userCountryCode
        );
      })
    );
  }

  getComparedSubRegionsDiversity(
    currentUserSubRegionsCount: number,
    userCountryCode: number | undefined = undefined
  ): Observable<ComparedDiversityData> {
    let regionsDiversitySource;
    if (userCountryCode)
      regionsDiversitySource = this.getSubRegionsDiversityInUserCountry(userCountryCode);
    else regionsDiversitySource = this.getSubRegionsDiversity();

    return regionsDiversitySource.pipe(
      filter(
        (diversityIndexes): diversityIndexes is SubRegionsDiversityIndex[] =>
          diversityIndexes != undefined
      ),
      map((diversityIndexes) => {
        const usersSubRegionDiversity = [];
        usersSubRegionDiversity.push(currentUserSubRegionsCount);

        diversityIndexes.forEach((index) => {
          const indexArray = Array(index.occurrenceQuantity).fill(index.subRegionsCount);
          usersSubRegionDiversity.push(...indexArray);
        });

        usersSubRegionDiversity.sort((a, b) => a - b);

        const currentUserIndex = usersSubRegionDiversity.findIndex(
          (index) => index === currentUserSubRegionsCount
        );

        usersSubRegionDiversity.splice(currentUserIndex, 1);

        let comparedDiversity;
        if (currentUserIndex != -1) {
          comparedDiversity =
            ((currentUserIndex / usersSubRegionDiversity.length) * 100).toFixed(0) + "%";
        } else {
          comparedDiversity = "0%";
        }

        return {
          comparedDiversity,
          totalUsers: usersSubRegionDiversity.length,
        };
      })
    );
  }
}
