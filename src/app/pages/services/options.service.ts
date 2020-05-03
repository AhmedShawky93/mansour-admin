import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class OptionsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin";
  }

  getOptions(data) {
    return this.http
      .get(this.url + "/options", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  createOption(data) {
    return this.http.post(this.url + "/options", data).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }
  editOptions(id, data) {
    return this.http
      .put(this.url + "/options/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  activate(id) {
    return this.http
      .post(this.url + "/options/" + id + "/activate", id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  deactivate(id, data) {
    return this.http
      .post(this.url + "/options/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
