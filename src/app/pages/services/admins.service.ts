import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class AdminsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin";
  }

  getAdmins() {
    return this.http.get<any>(this.url + "/admins").catch((error: any) => {
      return Observable.throw(error.error || "admins Error");
    });
  }

  getAdmin(id) {
    return this.http
      .get<any>(this.url + "/admins/" + id)
      .catch((error: any) => {
        return Observable.throw(error.error || "admins Error");
      });
  }

  getPermissions() {
    return this.http
      .get<any>(this.url + "/admins/permissions")
      .catch((error: any) => {
        return Observable.throw(error.error || "admins Error");
      });
  }

  createAdmin(admin) {
    return this.http
      .post<any>(this.url + "/admins", admin)
      .catch((error: any) => {
        return Observable.throw(error.error || "admins Error");
      });
  }

  updateAdmin(id, admin) {
    return this.http
      .post<any>(this.url + "/admins/" + id, admin)
      .catch((error: any) => {
        return Observable.throw(error.error || "admins Error");
      });
  }

  activateAdmin(id) {
    return this.http
      .post(this.url + "/admins/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateAdmin(id, data) {
    return this.http
      .post(this.url + "/admins/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
