import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StaffService {
  private url: any;

  constructor(private _HttpClient: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  // create Staff
  getStaff() {
    this._HttpClient.get(this.url + "").catch((error: any) => {
      return Observable.throw(error.error || "error Notification");
    });
  }
}
