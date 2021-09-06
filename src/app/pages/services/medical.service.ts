import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Observable, observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {

  private url: string;
  constructor(private http : HttpClient) {
    this.url = environment.api + "/api" + "/admin/";

   }
   getMedical()
   {
     return this.http.get(this.url + 'prescriptions')
       .catch((error :any) =>
       {
        return Observable.throw(error.error || 'error ads')
       })
   }
   getMedicalId(med)
   {
     return this.http.get(this.url + 'prescriptions/' + med)
       .catch((error :any) =>
       {
        return Observable.throw(error.error || 'error ads')
       })
   }
}
