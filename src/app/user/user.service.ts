import { Injectable } from "@angular/core";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _user: User | undefined;

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
}
