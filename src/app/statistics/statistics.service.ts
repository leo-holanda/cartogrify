import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, map, of } from "rxjs";
import { DiversityIndex } from "../shared/supabase.model";
import { ComparedDiversityData } from "./statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  diversityIndexes!: DiversityIndex[];

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
}
