import { Component, OnInit } from "@angular/core";
import { SettingService } from "../services/setting.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  iframeUrl: SafeResourceUrl;
  iframeLoaded = false

  constructor(private settingsService: SettingService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.settingsService.reports()
      .subscribe((response: any) => {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.data.iframeUrl)
        this.iframeLoaded = true
        console.log(this.iframeUrl);
      })
  }
}
