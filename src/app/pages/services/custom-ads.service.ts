import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class CustomAdsService {

  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin/";

  }

  getAds() {
    return this.http.get(this.url + 'custom-ads')
      .catch((error: any) => {
        return Observable.throw(error.error || 'error ads')
      })
  }
  getAdsId(ad) {
    return this.http.get(this.url + 'custom-ads/' + ad)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error ads')
      })
  }
  creatAds(ad) {
    return this.http.post(this.url + 'custom-ads', ad)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error ads');
      });
  }
  updateAds(id, data) {
    return this.http.put(this.url + 'custom-ads/' + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error ads');
      });
  }

  activateAd(id) {
    return this.http.post(this.url + "custom-ads/" + id + "/activate", {})
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }

  deactivateAd(id, data) {
    return this.http.post(this.url + "custom-ads/" + id + "/deactivate", data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }
}
