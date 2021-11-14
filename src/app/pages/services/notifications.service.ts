import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment.prod";
import { Observable, observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin/";
  }
  getNotification() {
    return this.http.get(this.url + "push_messages").catch((error: any) => {
      return Observable.throw(error.error || "error Notification");
    });
  }

  addNotification(message) {
    return this.http
      .post(this.url + "push_messages", message)
      .catch((error: any) => {
        return Observable.throw(error.error || "error Notification");
      });
  }
}
