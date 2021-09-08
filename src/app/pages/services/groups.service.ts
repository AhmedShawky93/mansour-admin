import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable({
    providedIn: "root",
})

export class GroupsService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = environment.api + "/api" + "/admin";
    }

    getGroups() {
        return this.http.get(this.url + "/groups")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }
    exportGroups() {
        const httpOptions = {
            responseType: 'blob' as 'json',
          };
        return this.http.post(this.url + "/groups/export",{},httpOptions)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }
    ImportGroups(importParams) {
        return this.http.post(this.url + "/groups/import",importParams)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    createGroup(data) {
        return this.http.post(this.url + "/groups", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    updateGroup(id, data) {
        return this.http.post(this.url + "/groups/" + id, data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    getGroup(id) {
        return this.http.get(this.url + "/groups/" + id + "/products")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    activateGroup(id) {
        return this.http.post(this.url + "/groups/" + id + "/activate", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    deactivateGroup(id, data) {
        return this.http.post(this.url + "/groups/" + id + "/deactivate", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

}