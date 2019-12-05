import { HttpClient , HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable()
export class OrdersService {

    private url: string;

    constructor(private http: HttpClient) {
        this.url = environment.api + "/admin";
    }

    

    getOrders(p = 1) {
        return this.http.get(this.url + "/orders?page=" + p)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    getUnassignedOrders() {
        return this.http.get(this.url + "/orders/unassigned")
    }

    filterOrders(data, p = 1) {
        data.page = p;
        return this.http.get(this.url + "/orders/filter", {
            params: data
        });
    }

    getOrderPrint(id) {
        const httpOptions = {
            headers: new HttpHeaders({
              'lang':  '2',
           
            })
          };
        return this.http.get(this.url + "/orders/" + id, httpOptions)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }
    getOrder(id) {
       
        return this.http.get(this.url + "/orders/" + id)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    getAvailableDeliverers(id) {
        return this.http.get(this.url + "/orders/" + id + "/available_deliverers")
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    assignDeliverer(id, data) {
        return this.http.post(this.url + "/orders/" + id + "/assign", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    cancelOrder(id) {
        return this.http.post(this.url + "/orders/" + id + "/cancel", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    prepareOrder(id) {
        return this.http.post(this.url + "/orders/" + id + "/prepare", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    deliverOrder(id) {
        return this.http.post(this.url + "/orders/" + id + "/deliver", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    completeOrder(id) {
        return this.http.post(this.url + "/orders/" + id + "/complete", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    updatePaidAmount(id, data) {
        return this.http.post(this.url + "/orders/" + id + "/update_payment", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    returnOrder(id) {
        return this.http.post(this.url + "/orders/" + id + "/return", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    proceedOrder(id) {
        return this.http.post(this.url + "/orders/" + id + "/proceed", {})
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    removeItems(id, data) {
        return this.http.post(this.url + "/orders/" + id + "/remove", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }

    addItems(id, data) {
        return this.http.post(this.url + "/orders/" + id + "/add_items", data)
            .catch((error: any) => {
                return Observable.throw(error.error || 'Server error');
            })
    }
}