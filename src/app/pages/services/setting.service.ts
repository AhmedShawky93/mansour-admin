import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import { EventEmitter } from '@angular/core';


@Injectable({

  providedIn: 'root'
})
export class SettingService {

  public imagesEmitter: EventEmitter<SettingService>;

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api + "/api" + '/admin/';
    this.imagesEmitter = new EventEmitter();

  }

  getNotification() {
    return this.http.get(this.url + 'profile')
      .catch((error: any) => {
        return Observable.throw(error.error || 'error Notification');
      });
  }
  updateNotification(user) {
    return this.http.post(this.url + 'profile', user)
      .catch((error: any) => {
        return Observable.throw(error.error || 'error Notification');
      });
  }

  getNotifications() {
    return this.http.get(this.url + 'profile/notifications')
      .catch((error: any) => {
        return Observable.throw(error.error || 'error Notification');
      });
  }

  getSettings() {
    return this.http.get(this.url + 'settings');
  }
  getConfigurations() {
    return this.http.get(this.url + 'configurations/manager/index');
  }

  getPublicSettings() {
    return this.http.get(this.url + 'public_settings');
  }

  updateSystemSettings(data) {
    return this.http.post(this.url + 'settings/system', data);
  }

  updateLoyalitySettings(data) {
    return this.http.post(this.url + 'settings/loyality', data);
  }

  getStatistics() {
    return this.http.get(this.url + 'dashboard');
  }

  reports() {
    return this.http.get(this.url + 'metabase');
  }

  imageload(user) {
    this.imagesEmitter.emit(user);
  }

  markRead() {
    return this.http.get(this.url + 'profile/notifications/read');
  }
  getEnv_variables() {
    return this.http.get(this.url + 'configurations');
  }
  updateDynamicSettings(data) {
    return this.http.post(this.url + 'configurations/manager/update', data);
  }

}
