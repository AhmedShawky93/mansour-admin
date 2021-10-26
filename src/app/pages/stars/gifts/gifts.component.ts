import { Component, OnInit } from "@angular/core";
import { LoyalityService } from "@app/pages/services/loyality.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-gifts",
  templateUrl: "./gifts.component.html",
  styleUrls: ["./gifts.component.css"],
})
export class GiftsComponent implements OnInit {
  requests = [];
  searchTerm;
  hideDelivered = true;
  p = 1;

  constructor(
    private loyalityService: LoyalityService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.loyalityService.getGiftRequests().subscribe((response: any) => {
      this.spinner.hide();
      this.requests = response.data;
    });
  }

  changeRequestStatus(request) {
    this.loyalityService
      .changeRequestStatus(request.id, { status: request.status })
      .subscribe((response: any) => {});
  }
}
