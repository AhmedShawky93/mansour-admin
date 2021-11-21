import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SettingService } from "@app/pages/services/setting.service";
// import { environmentVariables } from '../../../../../environments/enviromentalVariables';

@Component({
  selector: "app-view-store",
  templateUrl: "./view-store.component.html",
  styleUrls: ["./view-store.component.scss"],
})
export class ViewStoreComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Input("selectProductDataEdit") dataView;
  environmentVariables;
  constructor(private settingService: SettingService) {
    this.getConfig();
  }

  ngOnInit() {}
  ngOnChanges(): void {
    if (this.dataView) {
      this.dataView.lat = parseFloat(this.dataView.lat);
      this.dataView.lng = parseFloat(this.dataView.lng);
    }
  }
  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
}
