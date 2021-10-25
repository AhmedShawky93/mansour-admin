import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PagesService } from "./services/pages.service";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.css"],
})
export class PagesComponent implements OnInit {
  uploaderIndex = 0;
  uploaders = [];
  showFilemangerModal = false;
  constructor(private pageServ: PagesService, private router: Router) {
    this.getUploaders();
    router.events.subscribe((val) => {
      // console.log("router : ",this.router.url);

      if (!this.router.url.includes("filemanager")) {
        this.showFilemangerModal = true;
      }
    });
  }

  async ngOnInit() {
    // this.getAffiliate();
  }
  getUploaders() {
    this.pageServ.getcurrentImg().subscribe((res) => {
      this.uploaderIndex = res;
    });
    this.pageServ.getUploads().subscribe((res) => {
      this.uploaders = res;
    });
  }

  // getAffiliate() {
  //   this.settingsService.getSettings().subscribe((response: any) => {
  //     if (response.code === 200) {
  //       this.showAffiliateService.showAffiliate.next(response.data.enable_affiliate)
  //     }
  //   })
  // }
  updateUploaders() {
    if (this.uploaders[this.uploaderIndex]) {
      this.uploaders[this.uploaderIndex] = "";
      console.log("uploaders : ", this.uploaders);
      this.pageServ.setUploads(this.uploaders);
    }
  }
  // getAffiliate() {
  //   this.settingsService.getSettings().subscribe((response: any) => {
  //     if (response.code === 200) {
  //       this.showAffiliateService.showAffiliate.next(response.data.enable_affiliate)
  //     }
  //   })
  // }
}
