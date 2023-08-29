import { Injectable } from "@angular/core";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private _user: User = {
    country: "",
    id: "",
  };

  constructor() {}

  setUser(user: User): void {
    this._user.country = user.country;
    this._user.id = user.id;
  }

  getUser(): User {
    return { ...this._user };
  }
}
