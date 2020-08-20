import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable()
export class CustomerService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = environment.api + "/admin";
    }

    getCustomers(p = 1) {
        return this.http.get(this.url + "/customers?page=" + p)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    getCustomersSimple() {
        return this.http.get(this.url + "/customers_simple")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }
    

    getCustomer(id) {
        return this.http.get(this.url + "/customers/" + id)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    searchCustomers(q) {
        return this.http.get(this.url + "/customers/search?q=" + q)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    } 

    activateCustomer(id) {
        return this.http.post(this.url + "/customers/" + id + "/activate", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    deactivateCustomer(id, data) {
        return this.http.post(this.url + "/customers/" + id + "/deactivate", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    cancelPoints(id) {
        return this.http.post(this.url + "/points/" + id + "/cancel", {})
    }

    verifyPhone(id) {
        return this.http.post(this.url + "/customers/" + id + "/verify_phone", {})
    }

    getCustomerToken(id) {
        return this.http.get(this.url + "/customers/" + id + "/token");
    }
}