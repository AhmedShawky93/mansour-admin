import { Component, OnInit } from "@angular/core";
import { LoyalityService } from "@app/pages/services/loyality.service";
import { ContactUsService } from "../services/contact-us.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"],
})
export class ContactusComponent implements OnInit {
  requests = [];
  searchTerm;
  hideDelivered = true;
  p = 1;
  total: any;
  param = {
    p: 1,
    q: "",
  };
  constructor(
    private contactUsService: ContactUsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getContactUs(this.param);
  }

  getContactUs(data) {
    this.contactUsService.getContactUs(data).subscribe((response: any) => {
      this.requests = response.data.items;
      this.total = response.data.total;
    });
  }
  changeRequestStatus(request) {
    this.contactUsService
      .updateResolve(request.id, { resolved: request.resolved })
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.toastrService.success(response.message);
        }
      });
  }
  changePage(p) {
    this.p = p;
    this.param.p = p;
    this.getContactUs(this.param);
  }
  search(q) {
    if (!q.length) {
      this.changePage(this.p);
    }
    this.param.q = q;
    this.getContactUs(this.param);
  }
}
