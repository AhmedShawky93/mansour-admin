import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowAffiliateService {
  showAffiliate = new BehaviorSubject(null);
  constructor() { }
}
