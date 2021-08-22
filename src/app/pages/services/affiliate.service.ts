import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable()
export class AffiliateService {

  private url: string;
  private wallet_store: string;

  constructor(private http: HttpClient) {
    this.wallet_store = environment.api + "/admin/wallet";
    this.url = environment.api + "/admin/affiliates";
  }

  getUserRequests(data) {
    return this.http.get(this.url + "/requests", { params: data })
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }

  getUsersAffiliates(data) {
    return this.http.get(this.url, { params: data })
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }


  userApprove(id) {
    return this.http.post(this.url + "/requests/" + id + '/approve', id)
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }
  userReject(id, message) {
    return this.http.post(this.url + "/requests/" + id + '/reject', { rejection_reason: message })
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }
  getDeliverersId(id) {
    return this.http.get(this.url + '/' + id)
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }

  activate(id) {
    return this.http.post(this.url + '/' + id + "/activate", {})
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }

  deactivate(id, data) {
    return this.http.post(this.url + '/' + id + "/deactivate", data)
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }

  getAllAffiliate(q) {
    return this.http.get(this.url + "?q=" + q)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }



  getAffiliatesList(data) {
    return this.http.get(this.wallet_store, { params: data })
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }


  addAdminCredit(data) {
    return this.http.post(this.wallet_store, data)
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }


  getAffiliateDetails(id) {
    return this.http.get(this.url + '/' + id)
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }


  affiliateWithdrawApprove(id) {
    return this.http.post(this.wallet_store + "/" + id + '/approve', id)
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }
  affiliateWithdrawReject(id, message) {
    return this.http.post(this.wallet_store + "/" + id + '/reject', { rejection_reason: message })
      .catch((error: any) => {
        throw (error.error || 'Server error');
      })
  }




  createAffiliate(data) {
    return this.http.post(this.url, data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }

  updateAffiliate(id, data) {
    return this.http.put(this.url + "/" + id, data)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      })
  }
  exportFileProducts(url) {
    return this.http
      .get(url)
      .catch((error: any) => {
        return Observable.throw(error.error || 'Server error');
      });
  }

}
