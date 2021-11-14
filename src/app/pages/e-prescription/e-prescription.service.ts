import { Injectable } from "@angular/core";
import { environment } from "@env/environment.prod";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class EPrescriptionService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.api}/api/admin/prescriptions`;
  }

  getPrescriptions(search, page) {
    return this.http.get(`${this.baseUrl}?q=${search}&page=${page}`);
  }

  changeStatus(id, data) {
    return this.http.post(`${this.baseUrl}/${id}/change_status`, data);
  }

  export() {
    return this.http.get(`${this.baseUrl}/export`);
  }
}
