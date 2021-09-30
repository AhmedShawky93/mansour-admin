import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SettingService } from '@app/pages/services/setting.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit , OnChanges{
  @Output() closeSideBarEmit = new EventEmitter()
  @Input('selectProductDataEdit') currentProduct;
  environmentVariables: any;
  constructor(private settingService: SettingService) { }
  getConfig() {
    this.settingService.getenvConfig().subscribe(res => {
      this.environmentVariables = res;
    })
  }
  ngOnInit() {
  }
  ngOnChanges(): void {
  }
  closeSideBar() {
    this.closeSideBarEmit.emit()
  }
}
