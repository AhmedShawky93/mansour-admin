import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-view-section",
  templateUrl: "./view-section.component.html",
  styleUrls: ["./view-section.component.css"],
})
export class ViewSectionComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Input("sectionData") section;
  constructor() {}

  ngOnInit() {}
  ngOnChanges(): void {}
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
