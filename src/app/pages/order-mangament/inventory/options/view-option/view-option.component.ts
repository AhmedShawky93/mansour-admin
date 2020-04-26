import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-view-option",
  templateUrl: "./view-option.component.html",
  styleUrls: ["./view-option.component.css"],
})
export class ViewOptionComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Input("selectProductDataEdit") dataView;
  constructor() {}

  ngOnInit() {}
  ngOnChanges(): void {}
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
