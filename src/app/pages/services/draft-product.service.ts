import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class DraftProductService {
  draftProducts: Array<any>;
  constructor() {
    this.draftProducts = this.getDraftProducts() || [];
  }
  SetDraftProduct(product) {
    this.draftProducts = this.getDraftProducts();
    const idx = this.draftProducts.findIndex(data => data.id === product.id);
    if (idx !== -1) {
      this.draftProducts.splice(idx, 1, product);
    } else {
      product.id = this.uniqueID();
      this.draftProducts.unshift(product);
    }
    localStorage.setItem('draftProduct', JSON.stringify(this.draftProducts));
  }
  clearDraftProduct(product) {
    const idx = this.draftProducts.findIndex(data => data.id === product.id);
    if (idx !== -1) {
      this.draftProducts.splice(idx, 1);
      localStorage.setItem('draftProduct', JSON.stringify(this.draftProducts));
    }
  }
  getDraftProducts() {
   return JSON.parse(localStorage.getItem('draftProduct')) || [];
  }
  uniqueID () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return `_${Math.random().toString(36).substr(2, 9)}`;
  }
}
