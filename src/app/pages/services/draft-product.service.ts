import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})

export class DraftProductService {

  constructor() { }
  SetDraftProduct(data) {
    localStorage.setItem('draftProduct', JSON.stringify(data))
  }
  clearDraftProduct() {
    localStorage.setItem('draftProduct', JSON.stringify(null))

  }
}
