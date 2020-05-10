import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-view-list",
  templateUrl: "./view-list.component.html",
  styleUrls: ["./view-list.component.css"],
})
export class ViewListComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Input("listData") list;
  constructor() {}

  ngOnInit() {}
  ngOnChanges(): void {}
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
