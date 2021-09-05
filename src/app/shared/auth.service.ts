import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()
export class AuthService {
  url;
  constructor( private http: HttpClient, private permissionsService: NgxPermissionsService) {
    this.url = environment.api + "/api" + "/admin";
  }

  getToken() {
    return localStorage.getItem("auth_token_trolley")
  }

  getUser() {
    return JSON.parse(localStorage.getItem("auth_user_trolley"));
  }

  isAuthenticated() {
    var token = this.getToken();
    if (token) {
      return true
    }
    else {
      return false
    }
  }

  getProfile() {
    return this.http.get(this.url + '/profile')
  }

  async setPermissions() 
  {
    let data: any = await this.http.get(this.url + '/profile').toPromise();
    this.permissionsService.flushPermissions();

    let user = data.data;
    if (user.roles.length) {
      const perm = user.roles[0].permissions.map((perm) => perm.name);
      await this.permissionsService.loadPermissions(perm);

      if (user.roles[0].name == "Super Admin") {
        this.permissionsService.addPermission(['ADMIN']);
      }
    }
  }

  setToken(token) {
    localStorage.setItem("auth_token_trolley", token)
  }

  setUser(user) {
    localStorage.setItem("auth_user_trolley", JSON.stringify(user));
  }

  removeToken() {
    localStorage.removeItem("auth_token_trolley")
  }

  logOut() {
    this.removeToken();
  }

  login(email, password) {
    return this.http.post(this.url + "/auth", { email: email, password: password })
  }

  forgetPassword(data) {
    return this.http.post(this.url + "/auth/forget_password", data);
  }

  resetPassword(data) {
    return this.http.post(this.url + "/auth/reset_password", data);
  }
}
