import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable()
export class CategoryService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = environment.api + "/api" + "/admin";
    }

    getCategories() {
        return this.http.get(this.url + "/categories")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    createCategory(data) {
        return this.http.post(this.url + "/categories", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    updateCategory(id, data) {
        return this.http.post(this.url + "/categories/" + id, data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    getProducts(id) {
        return this.http.get(this.url + "/categories/" + id + "/products")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    activateCategory(id) {
        return this.http.post(this.url + "/categories/" + id + "/activate", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    deactivateCategory(id, data) {
        return this.http.post(this.url + "/categories/" + id + "/deactivate", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

}