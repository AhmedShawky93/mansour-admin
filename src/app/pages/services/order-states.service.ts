import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class OrderStatesService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin/order_states";
  }

  getOrderStatus() {
    return this.http.get(this.url).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  getOrderEditableStatus() {
    return this.http.get(this.url + "/editable").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  updateOrderStatus(id, data) {
    return this.http.post<any>(this.url + '/'+ id, data).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  activateOrderStatus(id) {
    return this.http
      .post(this.url + '/'+id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateOrderStatus(id, data) {
    return this.http
      .post(this.url + '/'+ id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }


}
