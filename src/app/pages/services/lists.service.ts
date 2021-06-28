import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable({
  providedIn: "root",
})
export class ListsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin";
  }

  getLists(data) {
    return this.http
      .get(this.url + "/lists", { params: data })
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  getListById(id){
    return this.http
      .get<any>(this.url + `/lists/${id}`)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  createList(data) {
    return this.http.post(this.url + "/lists", data).catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }

  editList(id, data) {
    return this.http
      .put(this.url + "/lists/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  activate(id) {
    return this.http
      .post(this.url + "/lists/" + id + "/activate", id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivate(id, data) {
    return this.http
      .post(this.url + "/lists/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  uploadFile(id, file) {
    const fd = new FormData();
    fd.append("file", file);

    return this.http
      .post(this.url + '/lists/' + id + "/import-list-items", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "file upload error");
      });
  }
  export(id) {
    return this.http.get(this.url + '/lists/' + id + "/export-file-list-items")
  }
}
