import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class PromotionsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  getPromotions(data) {
    return this.http
      .get(this.url + "/promotions", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  createPromotion(data) {
    return this.http.post(this.url + "/promotions", data).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  editPromotion(id, data) {
    return this.http
      .put(this.url + "/promotions/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  activate(id) {
    return this.http
      .post(this.url + "/promotions/" + id + "/activate", id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivate(id, data) {
    return this.http
      .post(this.url + "/promotions/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
