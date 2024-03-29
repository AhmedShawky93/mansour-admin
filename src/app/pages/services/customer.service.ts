import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable()
export class CustomerService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  getCustomers(data) {
    return this.http
      .post(this.url + "/customers/search", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  exportCustomers(url) {
    return this.http.get(url).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  getCustomersSimple() {
    return this.http.get(this.url + "/customers_simple").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  getCustomer(id) {
    return this.http
      .get<any>(this.url + "/customers/" + id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  createCustomer(data) {
    return this.http.post(this.url + "/customers", data).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }
  syncProducts() {
    return this.http.get(this.url + "/sync/all").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }
  syncCustomer() {
    return this.http.get(this.url + "/sync/users").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }
  updateCustomer(id, data) {
    return this.http
      .post(this.url + "/customers/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  createAddress(customer_id, data) {
    return this.http
      .post(this.url + "/customers/" + customer_id + "/address", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  updateAddress(customer_id, address_id, data) {
    return this.http
      .post(
        this.url + "/customers/" + customer_id + "/address/" + address_id,
        data
      )
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  searchCustomers(q) {
    return this.http
      .get(this.url + "/customers/search?q=" + q)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  activateCustomer(id) {
    return this.http
      .post(this.url + "/customers/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateCustomer(id, data) {
    return this.http
      .post(this.url + "/customers/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  cancelPoints(id) {
    return this.http.post(this.url + "/points/" + id + "/cancel", {});
  }

  verifyPhone(id) {
    return this.http.post(this.url + "/customers/" + id + "/verify_phone", {});
  }

  getCustomerToken(id) {
    return this.http.get(this.url + "/customers/" + id + "/token");
  }
  getRequests(page) {
    return this.http.get(this.url + `/register/request?page=${page}`);
  }
  softDeleteRequest(id) {
    return this.http.delete(this.url + "/register/request/" + id);
  }
}
