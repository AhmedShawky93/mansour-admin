import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + '/admin';
  }

  // Create Products

  getMenu() {
    return this.http.get<any>(this.url + '/menu');
  }

  updateMenu(data) {
    return this.http.post<any>(this.url + '/menu', data);
  }
}
