import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin/contact_us";
  }

  getContactUs(data) {
    return this.http.get(this.url , { params: data }).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  updateResolve(id, data) {
    return this.http
      .post(this.url +'/'+ id + "/update_resolve", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
