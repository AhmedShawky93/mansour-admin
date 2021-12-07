import "rxjs/add/operator/catch";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  // Create Products
  getMenuItems() {
    return this.http.get<any>(`${environment.api}/api/customer/home/menu`);
  }

  getMenu() {
    return this.http.get<any>(this.url + "/menu");
  }

  updateMenu(data) {
    return this.http.post<any>(this.url + "/menu", data);
  }

  generateMenu() {
    return this.http.get<any>(this.url + "/menu/generate");
  }
}
