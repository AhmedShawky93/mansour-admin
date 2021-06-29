import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-view-store",
  templateUrl: "./view-store.component.html",
  styleUrls: ["./view-store.component.scss"],
})
export class ViewStoreComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Input("selectProductDataEdit") dataView;
  constructor() { }

  ngOnInit() { }
  ngOnChanges(): void {
    if (this.dataView) {
      this.dataView.lat = parseFloat(this.dataView.lat);
      this.dataView.lng = parseFloat(this.dataView.lng);
    }
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
