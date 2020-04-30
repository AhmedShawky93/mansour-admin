import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-view-region",
  templateUrl: "./view-region.component.html",
  styleUrls: ["./view-region.component.css"],
})
export class ViewRegionComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") dataView;
  constructor() {}

  ngOnInit() {}

  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
