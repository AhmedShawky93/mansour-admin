import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  private url: string;
  constructor(private http: HttpClient) {
    this.url = environment.api + "/admin/";

  }

  getImports(data) {
    return this.http.post(this.url + "import/filter", data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }

  import(data) {
    return this.http.post(this.url + "files/import", data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }

  downloadTemplate(type) {
    return this.http.get(this.url + "files/import/templates?type=" + type)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }
}
