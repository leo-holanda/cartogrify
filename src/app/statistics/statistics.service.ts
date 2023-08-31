import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, filter, map, of } from "rxjs";
import { DiversityIndex } from "../shared/supabase.model";
import { ComparedDiversityData, ComparedDiversityInUserCountryData } from "./statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  hasRequested = false;
  private diversityIndexes$ = new BehaviorSubject<DiversityIndex[] | undefined>(undefined);

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
        /*
          Should I include the current user in this calculation?
          I'm comparing the current user against the users from database
          The current user could be and couldn't be in the database
          Is it harming the validity of the rating?
        */

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
        /*
          Should I include the current user in this calculation?
          I'm comparing the current user against the users from database
          The current user could be and couldn't be in the database
          Is it harming the validity of the rating?
        */

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
}
