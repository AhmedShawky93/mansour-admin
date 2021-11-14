import { Component, OnInit } from "@angular/core";
import { AffiliateService } from "@app/pages/services/affiliate.service";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { debounce } from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { ViewActionAffiliateComponent } from "./view-action-affiliate/view-action-affiliate.component";
import { AuthService } from "@app/shared/auth.service";
import { environment } from "environments/environment.prod";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-withdraw-requests",
  templateUrl: "./withdraw-requests.component.html",
  styleUrls: ["./withdraw-requests.component.scss"],
})
export class WithdrawRequestsComponent implements OnInit {
  today = new Date();
  dateTo;
  dateFrom;
  statistics: any;
  walletHistoryAffiliates: any = [];
  total;
  selectedMainProduct: any;
  filter: any = {};
  exportUrl;
  statusList = [
    { name: "All", id: null },
    { name: "Pending", id: 0 },
    { name: "Approved", id: 1 },
    { name: "Rejected", id: 2 },
  ];

  constructor(
    private affiliateService: AffiliateService,
    public dialog: MatDialog,
    private auth: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.search = debounce(this.search, 3000);
  }

  ngOnInit() {
    this.filter.type = "3";
    this.filter.status = "";
    this.filter.page = 1;
    this.getAllAffiliates();
  }

  getAllAffiliates() {
    this.spinner.show();
    this.affiliateService
      .getAffiliatesList(this.filter)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.walletHistoryAffiliates = response.data.wallet;
        this.statistics = response.data.statistics;
        this.total = response.data.total;
      });
  }

  search() {
    this.filter.page = 1;
    this.filterAffiliates(this.selectedMainProduct, this.filter);
  }

  filterAffiliates(product: any = null, search: any = null) {
    this.selectedMainProduct = product || null;
    this.spinner.show();
    this.affiliateService
      .getAffiliatesList(search)
      .subscribe((response: any) => {
        this.walletHistoryAffiliates = response.data.wallet;
        this.walletHistoryAffiliates = this.walletHistoryAffiliates.map(
          (item) => {
            item.deactivated = !item.active;
            return item;
          }
        );
        this.total = response.data.total;
        this.spinner.hide();
      });
  }

  setDateFrom(e) {
    this.filter.date_from = moment(e.value).format("YYYY/MM/DD");
    this.getAllAffiliates();
  }
  setDateTo(e) {
    this.filter.date_to = moment(e.value).format("YYYY/MM/DD");
    this.getAllAffiliates();
  }

  changePage(page) {
    this.filter.page = page;
    this.getAllAffiliates();
  }

  openPopupViewActionAffiliate(state, data) {
    const dialogRef = this.dialog.open(ViewActionAffiliateComponent, {
      width: "500px",
      data: { state, data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "1") {
        this.filter.page = 1;
        this.filter = {};
        this.getAllAffiliates();
      }
    });
  }

  goToLink() {
    const token = this.auth.getToken();
    const urlBasic =
      environment.api +
      "/api" +
      "/admin/affiliates/export?token=" +
      token +
      "&" +
      this.serialize(this.filter);
    console.log(urlBasic);
    console.log(this.filter);
    this.affiliateService.exportFile(urlBasic).subscribe({
      next: (rep: any) => {
        if (rep.code === 200) {
        }
      },
    });
    setTimeout(() => {
      this.toastr.success(
        "You’ll receive a notification when the export is ready for download.",
        " Your export is now being generated ",
        {
          enableHtml: true,
          timeOut: 3000,
        }
      );
    }, 500);
  }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
}
