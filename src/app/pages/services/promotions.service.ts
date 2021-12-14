import "rxjs/add/operator/catch";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "environments/environment.prod";
import { Observable } from "rxjs";

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
  getRangePromotions(data) {
    return this.http
      .get(this.url + "/promotions_b2b", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  createPromotion(data) {
    return this.http
      .post(this.url + "/promotions", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  createRangePromotion(data) {
    return this.http
      .post(this.url + "/promotions_b2b", data)
      .catch((error: any) => {
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
  editRangePromotion(id, data) {
    return this.http
      .put(this.url + "/promotions_b2b/" + id, data)
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

  deletePromotion(id) {
    return this.http.delete(`${this.url}/promotions/${id}`);
  }
}
