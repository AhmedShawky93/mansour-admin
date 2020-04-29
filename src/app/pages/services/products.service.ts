import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable, observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin";
  }

  // Create Products

  getProducts(p = 1) {
    const data: any = {
      page: p,
    };
    return this.http.get(this.url + "/products", {
      params: data,
    });
  }

  getStats(id, data) {
    return this.http.post(this.url + "/products/" + id + "/stats", data);
  }

  searchProducts(data, p = 1) {
    data.page = p;
    return this.http.get(this.url + "/products", {
      params: data,
    });
  }

  creatProduct(product) {
    return this.http
      .post(this.url + "/products", product)
      .catch((error: any) => {
        return Observable.throw(error.error || "Product Error");
      });
  }

  updateProduct(id, data) {
    return this.http
      .post(this.url + "/products/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Product Error");
      });
  }

  activateProduct(id) {
    return this.http
      .post(this.url + "/products/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateProduct(id, data) {
    return this.http
      .post(this.url + "/products/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  getBrands() {
    return this.http.get(this.url + "/brands");
  }

  uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);

    return this.http
      .post(this.url + "/products/import", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "file upload error");
      });
  }
  uploadFileStock(file) {
    const fd = new FormData();
    fd.append("file", file);

    return this.http
      .post(this.url + "/products/import_prices", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "file upload error");
      });
  }
}
