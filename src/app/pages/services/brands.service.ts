import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable, observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + "/admin/";

  }

  getBrands() {
    return this.http.get(this.url + 'brands')
      .catch((error: any) => {
        return Observable.throw(error.error || 'error brands')
      })
  }

  createBrand(ad) {
    return this.http.post(this.url + 'brands', ad)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error brands')
      })
  }
  exportBrands() {
    const httpOptions = {
        responseType: 'blob' as 'json',
      };
    return this.http.get(this.url + "/groups/export",httpOptions)
        .catch((error: any) => {
            return Observable.throw(error.error || 'Server error');
        })
}
ImportBrands(importParams) {
    return this.http.post(this.url + "/groups/import",importParams)
        .catch((error: any) => {
            return Observable.throw(error.error || 'Server error');
        })
}

  updateBrand(id, data) {
    return this.http.patch(this.url + 'brands/' + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error brands')
      })
  }
}
