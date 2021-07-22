import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReactivityService {
  public storeObserver$: any;
  public storeData: Object;
  private store: any;

  constructor() {
    this.storeData = {};
    this.store = new BehaviorSubject<any>(null);
    this.storeObserver$ = this.store.asObservable();
  }

  setDataToStore(key: string, data: any) {
    const obj = {};
    obj[key] = data;
    this.storeData[key] = data;
    this.store.next(obj);
  }

  getStoreData(key: string) {
    return this.storeData[key];
  }
}
