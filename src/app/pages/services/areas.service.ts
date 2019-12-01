import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private url : string ;
  constructor(private _HttpClient: HttpClient,
  ) { 
    this.url = environment.api + "/admin"
  }
     // GET Areas From Server
    getAreas(): Observable<any[]>
    {
      return this._HttpClient.get<any>(this.url +'/areas')
          .catch((error: any) => {
        return Observable.throw(error.error || 'Area error');
      })
    }

    getArea(areaId)
    {
     return  this._HttpClient.get<any>(this.url + '/areas/'+ areaId )
         .catch((error: any) => {
          return Observable.throw(error.error || 'Area error');
     })
    }

    // get cities Form Server
    getCities()
    {
      return this._HttpClient.get(this.url + "/cities")
           .catch((error: any) => {
            return Observable.throw(error.error || 'Area error');
           })
    }
        
    // Create Areas  
    createAreas(area ) 
    {
      return this._HttpClient.post(this.url +'/areas',area)
          .catch((error : any ) => {
            return Observable.throw(error.error || 'Area Error')
          })
    }
    // Update Areas 
    updateAreas(currentArea)
    {
      return this._HttpClient.put(this.url + '/areas/' + currentArea.id, currentArea)
          .catch((error : any ) => {
            return Observable.throw(error.error || 'Area Error')
          });
    }

    activateArea(id) {
        return this._HttpClient.post(this.url + "/areas/" + id + "/activate", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    deactivateArea(id, data) {
        return this._HttpClient.post(this.url + "/areas/" + id + "/deactivate", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    // delete Areas

    // deleteAreas(area : number): Observable<{}>
    // {
    //   return this._HttpClient.delete<void>(`${this.url + "'/areas/'"} ${area}`)
    //   .pipe(
    //     catchError(this.handleError('addHero', hero))
    //   );
    // }
}
