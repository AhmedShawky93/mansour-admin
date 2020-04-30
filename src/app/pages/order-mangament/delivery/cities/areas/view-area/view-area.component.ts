import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-view-area",
  templateUrl: "./view-area.component.html",
  styleUrls: ["./view-area.component.css"],
})
export class ViewAreaComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") dataView;
  constructor() {}

  ngOnInit() {}

  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
