import { Injectable } from '@angular/core';
import {environment} from '@env/environment.prod';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.api}/api/admin`;
  }

  getTransactions(data) {
    return this.http.get(`${this.baseUrl}/transactions`, {
      params: data,
    });
  }
  createOrder(id) {
    return this.http.post(`${this.baseUrl}/orders/create_by_transaction/${id}`, {});
  }
  export(data) {
    return this.http.get(`${this.baseUrl}/transactions/export`, {
      params: data,
    });
  }
}
