import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  // Create Products

  getProducts(data) {
    return this.http.get(this.url + "/products", {
      params: data,
    });
  }

  getProductById(id) {
    return this.http.get(`${this.url}/products/${id}`);
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

  searchProductVariants(data, p = 1) {
    data.page = p;
    return this.http.get(this.url + "/products/searchVariants", {
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

  creatProductVariant(mainProductId, data) {
    return this.http.post(
      this.url + `/products/${mainProductId}/variants`,
      data
    );
  }

  updateProduct(id, data) {
    return this.http
      .post(this.url + "/products/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Product Error");
      });
  }

  updateProductVariant(mainProductId, variantId, data) {
    return this.http.put(
      this.url + `/products/${mainProductId}/variants/${variantId}`,
      data
    );
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
      .post(this.url + "/products/fullImport", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "file upload error");
      });
  }

  import(file, type) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    return this.http
      .post(this.url + "/files/import", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  importList(file, type, id) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    fd.append("list_id", id);
    return this.http
      .post(this.url + "/files/import", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  uploadFileStock(file) {
    const fd = new FormData();
    fd.append("file", file);

    return this.http
      .post(this.url + "/products/importStocks", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "file upload error");
      });
  }

  exportFile(url) {
    return this.http.get(url).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }
  exportFileStocksPost(url) {
    return this.http.post(url, "").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  clone(id) {
    return this.http
      .post(this.url + "/products/" + id + "/clone", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deleteProduct(id) {
    return this.http
      .post(this.url + "/products/" + id + "/delete", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  softDeleteProduct(id) {
    return this.http.delete(`${this.url}/products/${id}`);
  }
}
