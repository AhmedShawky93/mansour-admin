import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable()
export class BracnhesStoreService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  getBranches(data) {
    return this.http
      .get(this.url + "/branches", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  getBranchId(id) {
    return this.http.get(this.url + "/branches/" + id).catch((error: any) => {
      throw error.error || "Server error";
    });
  }

  createBranch(data) {
    return this.http.post(this.url + "/branches", data).catch((error: any) => {
      throw error.error || "Server error";
    });
  }

  updateBranch(id, data) {
    return this.http
      .put(this.url + "/branches/" + id, data)
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }
  deleteBranch(id) {
    return this.http
      .post(this.url + "/branches/" + id + "/delete", {})
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }

  activate(id) {
    return this.http
      .post(this.url + "/branches/" + id + "/activate", {})
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }

  deactivate(id, data) {
    return this.http
      .post(this.url + "/branches/" + id + "/deactivate", data)
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }
}
