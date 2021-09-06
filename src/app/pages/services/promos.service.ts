import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class PromosService {
  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  // get Promos
  getPromos() {
    return this.http.get<any>(this.url + "/promos").catch((error: any) => {
      return Observable.throw(error.error || "promos Error");
    });
  }
  // get Promos
  getPromo(id) {
    return this.http
      .get<any>(this.url + "/promos/" + id)
      .catch((error: any) => {
        return Observable.throw(error.error || "promos Error");
      });
  }
  // Create Promos
  createPromos(promo) {
    return this.http
      .post<any>(this.url + "/promos", promo)
      .catch((error: any) => {
        return Observable.throw(error.error || "promos Error");
      });
  }

  getPaymentMethods() {
    return this.http
      .get<any>(this.url + "/payment_methods")
      .catch((error: any) => {
        return Observable.throw(error.error || "payment methods Error");
      });
  }
  // update Promos
  updatePromos(promo) {
    return this.http
      .post<any>(this.url + "/promos/" + promo.id, promo)
      .catch((error: any) => {
        return Observable.throw(error.error || "promos Error");
      });
  }

  activatePromo(id) {
    return this.http
      .post(this.url + "/promos/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivatePromo(id, data) {
    return this.http
      .post(this.url + "/promos/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
