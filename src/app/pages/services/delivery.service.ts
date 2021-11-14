import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable()
export class DeliveryService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  getDeliverers(data) {
    return this.http
      .get(this.url + "/deliverers", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  getAllDeliverers() {
    return this.http.get(this.url + "/deliverers/all").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  getDeliverersId(id) {
    return this.http.get(this.url + "/deliverers/" + id).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  getDelivererOrders(id) {
    return this.http.get(this.url + "/deliverers/" + id + "/orders");
  }

  createDeliverer(data) {
    return this.http.post(this.url + "/deliverers", data);
  }

  updateDeliverer(id, data) {
    return this.http.post(this.url + "/deliverers/" + id, data);
  }

  activateDeliverer(id) {
    return this.http
      .post(this.url + "/deliverers/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateDeliverer(id, data) {
    return this.http
      .post(this.url + "/deliverers/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
