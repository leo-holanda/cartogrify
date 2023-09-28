import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { SupabaseService } from "../shared/supabase.service";
import { CountryService } from "../country/country.service";
import { combineLatest, take } from "rxjs";
import { RegionService } from "../region/region.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _user: User | undefined;

  constructor(
    private supabaseService: SupabaseService,
    private countryService: CountryService,
    private regionService: RegionService
  ) {}

  setUser(user: User): void {
    this._user = {
      countryCode: user.countryCode,
      id: user.id,
    };
  }

  getUser(): User | undefined {
    if (this._user?.id) return { ...this._user };
    return undefined;
  }

  saveUserDiversityIndex(): void {
    const user = this.getUser();

    if (user) {
      combineLatest([
        this.regionService.getRegionsDiversity(),
        this.countryService.getCountriesDiversity(),
      ])
        .pipe(take(1))
        .subscribe(([regionsDiversity, countriesDiversity]) => {
          this.supabaseService.saveDiversityIndex(user, regionsDiversity, countriesDiversity);
        });
    }
  }
}
