import { Injectable } from "@angular/core";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _user: User = {
    id: "",
    countryCode: 0,
  };

  constructor() {}

  setUser(user: User): void {
    this._user.countryCode = user.countryCode;
    this._user.id = user.id;
  }

  getUser(): User {
    return { ...this._user };
  }
}
