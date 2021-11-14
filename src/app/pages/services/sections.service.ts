import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class SectionsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  getSections(data) {
    return this.http
      .get(this.url + "/sections", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  createSection(data) {
    return this.http.post(this.url + "/sections", data).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  editSection(id, data) {
    return this.http
      .put(this.url + "/sections/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deleteSection(id) {
    return this.http
      .delete<any>(this.url + "/sections/" + id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  activate(id) {
    return this.http
      .post(this.url + "/sections/" + id + "/activate", id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivate(id, data) {
    return this.http
      .post(this.url + "/sections/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
