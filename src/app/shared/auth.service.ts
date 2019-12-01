import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  url;
  constructor( private http: HttpClient) {
    this.url = environment.api + "/admin";
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
