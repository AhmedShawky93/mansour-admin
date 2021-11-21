import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ProfileResolver implements Resolve<any> {
  constructor(private auth: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.auth.getProfile();
  }
}
