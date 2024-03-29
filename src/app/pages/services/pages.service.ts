import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { BehaviorSubject, Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable()
export class PagesService {
  private url: string;
  private uploaderObs$: BehaviorSubject<any> = new BehaviorSubject(null);
  private currentImgIndexObs$: BehaviorSubject<any> = new BehaviorSubject(0);

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  getPages() {
    return this.http.get<any>(this.url + "/pages").catch((error: any) => {
      return Observable.throw(error.error || "Server error");
    });
  }
  getSinglePage(pageId) {
    return this.http
      .get<any>(this.url + `/pages/${pageId}/show`)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  getcurrentImg(): Observable<any> {
    return this.currentImgIndexObs$.asObservable();
  }

  setcurrentImg(imgIndex) {
    this.currentImgIndexObs$.next(imgIndex);
  }

  editPage(id, data) {
    return this.http
      .post<any>(this.url + "/pages/" + id + "/update", data)
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }

  getUploads(): Observable<any> {
    return this.uploaderObs$.asObservable();
  }

  setUploads(upload) {
    this.uploaderObs$.next(upload);
  }

  addPage(data) {
    return this.http
      .post<any>(this.url + "/pages/store", data)
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }

  deletePage(id) {
    return this.http
      .post<any>(this.url + "/pages/" + id + "/delete", {})
      .catch((error: any) => {
        throw error.error || "Server error";
      });
  }
  activate(id) {
    return this.http
      .post(this.url + "/pages/" + id + "/activate", id)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivate(id, data) {
    return this.http
      .post(this.url + "/pages/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
}
