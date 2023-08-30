import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, map, of } from "rxjs";
import { DiversityIndex, DiversityIndexPerCountry } from "../shared/supabase.model";
import { ComparedDiversityData, ComparedDiversityInUserCountryData } from "./statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  diversityIndexes!: DiversityIndex[];
  diversityIndexesPerCountry!: DiversityIndexPerCountry[];

  constructor(private supabaseService: SupabaseService) {}

  getDiversityIndexes(): Observable<DiversityIndex[]> {
    if (this.diversityIndexes != undefined) return of(this.diversityIndexes);

    return this.supabaseService.getDiversityIndexes().pipe(
      map((diversityIndexes) => {
        this.diversityIndexes = diversityIndexes;
        return this.diversityIndexes;
      })
    );
  }

  getDiversityIndexesPerCountry(): Observable<DiversityIndexPerCountry[]> {
    if (this.diversityIndexesPerCountry != undefined) return of(this.diversityIndexesPerCountry);

    return this.supabaseService.getDiversityIndexesPerCountry().pipe(
      map((diversityIndexesPerCountry) => {
        this.diversityIndexesPerCountry = diversityIndexesPerCountry;
        return this.diversityIndexesPerCountry;
      })
    );
  }

  getComparedDiversity(currentUserCountriesCount: number): Observable<ComparedDiversityData> {
    return this.getDiversityIndexes().pipe(
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

  getComparedDiversityPerCountry(
    currentUserCountriesCount: number,
    currentUserCountry: string
  ): Observable<ComparedDiversityInUserCountryData> {
    return this.getDiversityIndexesPerCountry().pipe(
      map((diversityIndexesPerCountry) => {
        const userCountryDiversity = [];
        userCountryDiversity.push(currentUserCountriesCount);

        diversityIndexesPerCountry.forEach((index) => {
          if (index.country == currentUserCountry) {
            const indexArray = Array(index.occurrenceQuantity).fill(index.countriesCount);
            userCountryDiversity.push(...indexArray);
          }
        });

        userCountryDiversity.sort((a, b) => a - b);

        const currentUserIndex = userCountryDiversity.findIndex(
          (index) => index === currentUserCountriesCount
        );

        let comparedDiversityInUserCountry;
        if (currentUserIndex != -1) {
          comparedDiversityInUserCountry =
            ((currentUserIndex / userCountryDiversity.length) * 100).toFixed(0) + "%";
        } else {
          comparedDiversityInUserCountry = "0%";
        }

        return {
          comparedDiversityInUserCountry,
          totalUsers: userCountryDiversity.length,
        };
      })
    );
  }
}
