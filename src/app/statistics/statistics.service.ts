import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, map, of } from "rxjs";
import { DiversityIndex } from "../shared/supabase.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  average!: number;
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

  getComparedDiversity(currentUserCountriesCount: number): Observable<string> {
    return this.getDiversityIndexes().pipe(
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

        if (currentUserIndex != -1)
          return ((currentUserIndex / allUsersDiversity.length) * 100).toFixed(0) + "%";
        return "0%";
      })
    );
  }
}
