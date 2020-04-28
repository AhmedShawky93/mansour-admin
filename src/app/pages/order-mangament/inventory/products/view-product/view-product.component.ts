import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit , OnChanges{
  @Output() closeSideBarEmit = new EventEmitter()
  @Input('selectProductDataEdit') currentProduct;
  constructor() { }

  ngOnInit() {
    console.log(this.currentProduct)
  }
  ngOnChanges(): void {
    console.log(this.currentProduct)
  }
  closeSideBar() {
    this.closeSideBarEmit.emit()
  }
}
