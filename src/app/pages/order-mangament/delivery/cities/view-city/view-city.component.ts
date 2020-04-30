import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-view-city",
  templateUrl: "./view-city.component.html",
  styleUrls: ["./view-city.component.css"],
})
export class ViewCityComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") dataView;
  constructor() {}

  ngOnInit() {}

  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
