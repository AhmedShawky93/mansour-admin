import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment.prod";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class AreasService {
  private url: string;
  constructor(private _HttpClient: HttpClient) {
    this.url = environment.api + "/api" + "/admin";
  }

  // start City

  uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);

    return this._HttpClient
      .post(this.url + "/cities/import", fd)
      .catch((error: any) => {
        return Observable.throw(error.error || "file upload error");
      });
  }

  // getCities() {
  //   return this._HttpClient.get(this.url + "/cities").catch((error: any) => {
  //     return Observable.throw(error.error || "Area error");
  //   });
  // }

  getCities(limit, page) {
    return this._HttpClient
      .get(`${this.url}/cities?limit=${limit}?page=${page}`)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area error");
      });
  }

  createCity(data) {
    return this._HttpClient
      .post(this.url + "/cities", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area Error");
      });
  }
  updateCity(id, data) {
    return this._HttpClient
      .post(this.url + "/cities/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area Error");
      });
  }
  activateCity(id) {
    return this._HttpClient
      .post(this.url + "/cities/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateCity(id, data) {
    return this._HttpClient
      .post(this.url + "/cities/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  // End City

  // start areas
  getAreaById(id) {
    return this._HttpClient
      .get(this.url + "/cities/" + id + "/areas")
      .catch((error: any) => {
        return Observable.throw(error.error || "Area error");
      });
  }

  createArea(id, data) {
    return this._HttpClient
      .post(this.url + "/cities/" + id + "/areas", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area Error");
      });
  }
  updateArea(idParent, data, IdChild) {
    return this._HttpClient
      .post(this.url + "/cities/" + idParent + "/areas/" + IdChild, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area Error");
      });
  }
  activateArea(idParent, IdChild) {
    return this._HttpClient
      .post(
        this.url + "/cities/" + idParent + "/areas/" + IdChild + "/activate",
        {}
      )
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateArea(idParent, data, IdChild) {
    return this._HttpClient
      .post(
        this.url + "/cities/" + idParent + "/areas/" + IdChild + "/deactivate",
        data
      )
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  // End areas
  // start areas
  getDistrictById(id) {
    return this._HttpClient
      .get(this.url + "/areas/" + id + "/districts")
      .catch((error: any) => {
        return Observable.throw(error.error || "Area error");
      });
  }

  createDistrict(id, data) {
    return this._HttpClient
      .post(this.url + "/areas/" + id + "/districts", data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area Error");
      });
  }
  updateDistrict(idParent, data, IdChild) {
    return this._HttpClient
      .post(this.url + "/areas/" + idParent + "/districts/" + IdChild, data)
      .catch((error: any) => {
        return Observable.throw(error.error || "Area Error");
      });
  }
  activateDistrict(idParent, IdChild) {
    return this._HttpClient
      .post(
        this.url + "/areas/" + idParent + "/districts/" + IdChild + "/activate",
        {}
      )
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }

  deactivateDistrict(idParent, data, IdChild) {
    return this._HttpClient
      .post(
        this.url +
          "/areas/" +
          idParent +
          "/districts/" +
          IdChild +
          "/deactivate",
        data
      )
      .catch((error: any) => {
        return Observable.throw(error.error || "Server error");
      });
  }
  // End areas
}
