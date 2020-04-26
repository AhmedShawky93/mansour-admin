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
    this.url = environment.api + "/admin/";

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

  updateBrand(id, data) {
    return this.http.post(this.url + 'brands/' + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error brands')
      })
  }
}
