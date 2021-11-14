import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class ImportsService {
  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin/";
  }

  downloadTemplate(type) {
    return this.http
      .get(this.url + "files/import/templates?type=" + type)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  getImports(page, data) {
    return this.http
      .post(this.url + `import/filter?page=${page}`, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  import(data) {
    return this.http
      .post(this.url + "files/import", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  retry(id) {
    return this.http
      .post(this.url + `files/import/${id}/retry`, {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  cancel(data) {
    return this.http
      .post(this.url + `import/cancel`, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  fileValidation(data) {
    return this.http
      .post(this.url + "import/File-validation", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
