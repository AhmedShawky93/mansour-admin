import { Component, OnInit } from "@angular/core";
import { SettingService } from "../services/setting.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  iframeUrl: SafeResourceUrl;
  iframeLoaded = false;

  constructor(
    private settingsService: SettingService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.settingsService.reports().subscribe((response: any) => {
      this.spinner.hide();
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        response.data.iframeUrl
      );
      this.iframeLoaded = true;
    });
  }
}
