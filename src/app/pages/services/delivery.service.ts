import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable()
export class DeliveryService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = environment.api + "/admin";
    }

    getDeliverers() {
        return this.http.get(this.url + "/deliverers")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }
    getDeliverersId(id) {
        return this.http.get(this.url + "/deliverers/" + id)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    getDelivererOrders(id) {
        return this.http.get(this.url + "/deliverers/" + id + "/orders");
    }

    createDeliverer(data) {
        return this.http.post(this.url + "/deliverers", data);
    }

    updateDeliverer(id, data) {
        return this.http.post(this.url + "/deliverers/" + id, data);
    }

    activateDeliverer(id) {
        return this.http.post(this.url + "/deliverers/" + id + "/activate", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    deactivateDeliverer(id, data) {
        return this.http.post(this.url + "/deliverers/" + id + "/deactivate", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }


}