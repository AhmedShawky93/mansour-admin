import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/catch';

@Injectable({
    providedIn: 'root'
})
export class LoyalityService {

    private url: string;
    constructor(private http: HttpClient) {
        this.url = environment.api + "/admin/";
    }

    getRewards() {
        return this.http.get(this.url + 'rewards')
    }

    createReward(data) {
        return this.http.post(this.url + 'rewards', data);
    }

    updateReward(id, data) {
        return this.http.post(this.url + 'rewards/' + id, data);
    }

    activateReward(id) {
        return this.http.post(this.url + 'rewards/' + id + '/activate', {});
    }

    deactivateReward(id, data) {
        return this.http.post(this.url + 'rewards/' + id + '/deactivate', data);
    }

    getGiftRequests() {
        return this.http.get(this.url + 'rewards/gifts')
    }

    changeRequestStatus(id, data) {
        return this.http.post(this.url + "rewards/gifts/" + id + "/status", data);
    }
}
