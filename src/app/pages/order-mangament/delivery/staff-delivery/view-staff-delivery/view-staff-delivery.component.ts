import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-view-staff-delivery.",
  templateUrl: "./view-staff-delivery.component.html",
  styleUrls: ["./view-staff-delivery.component.css"],
})
export class ViewStaffDeliveryComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Input("selectProductDataEdit") dataView;
  constructor() {}

  ngOnInit() {}
  ngOnChanges(): void {}
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
