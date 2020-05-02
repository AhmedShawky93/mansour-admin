import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin";
  }

  getRoles() {
    return this.http.get<any>(this.url + "/roles").catch((error: any) => {
      return Observable.throw(error.error || "Roles Error");
    });
  }

  getRole(id) {
    return this.http
      .get<any>(this.url + "/roles/" + id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Roles Error");
      });
  }

  createRole(role) {
    return this.http
      .post<any>(this.url + "/roles", role)
      .catch((error: any) => {
        return Observable.throw(error.error || "Roles Error");
      });
  }

  updateRole(id, role) {
    return this.http
      .post<any>(this.url + "/roles/" + id, role)
      .catch((error: any) => {
        return Observable.throw(error.error || "Roles Error");
      });
  }

  activateRole(id) {
    return this.http
      .post(this.url + "/roles/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateRole(id, data) {
    return this.http
      .post(this.url + "/roles/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
