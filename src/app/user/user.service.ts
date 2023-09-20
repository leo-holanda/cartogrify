import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { SupabaseService } from "../shared/supabase.service";
import { CountryService } from "../country/country.service";
import { take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _user: User | undefined;

  constructor(private supabaseService: SupabaseService, private countryService: CountryService) {}

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
      this.countryService
        .getCountriesCount()
        .pipe(take(1))
        .subscribe((countriesCount) => {
          console.log("salvei");
          this.supabaseService.saveDiversityIndex(user, countriesCount.length);
        });
    }
  }
}
