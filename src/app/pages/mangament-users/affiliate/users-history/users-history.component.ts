import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AffiliateService } from "@app/pages/services/affiliate.service";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { NewAdminCreditComponent } from "./new-admin-credit/new-admin-credit.component";
import { debounce } from "lodash";
import { PopupDetailsComponent } from "./popup-details/popup-details.component";
import { AuthService } from "@app/shared/auth.service";
import { environment } from "@env/environment";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-users-history",
  templateUrl: "./users-history.component.html",
  styleUrls: ["./users-history.component.scss"],
})
export class UsersHistoryComponent implements OnInit {
  today = new Date();
  dateTo;
  dateFrom;
  statistics: any;
  walletHistoryAffiliates: any = [];
  total;
  selectedMainProduct: any;
  filter: any = {};
  typesList = [
    { name: "All", id: null },
    { name: "Orders", id: 1 },
    { name: "Withdraw Requests", id: 3 },
    { name: "Admin Records", id: 2 },
  ];
  statusList = [
    { name: "All", id: null },
    { name: "Pending", id: 0 },
    { name: "Approved", id: 1 },
    { name: "Rejected", id: 2 },
  ];

  constructor(
    public dialog: MatDialog,
    private affiliateService: AffiliateService,
    private auth: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.search = debounce(this.search, 3000);
  }

  ngOnInit() {
    this.filter.type = "";
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

  openPopupNewAdminCredit() {
    const dialogRef = this.dialog.open(NewAdminCreditComponent, {
      width: "500px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 200) {
        this.filter.page = 1;
        this.filter = {};
        this.getAllAffiliates();
      }
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

  openPopup(item) {
    const dialogRef = this.dialog.open(PopupDetailsComponent, {
      width: "500px",
      data: { item: item },
    });
  }

  goToLink() {
    const token = this.auth.getToken();
    const urlBasic =
      environment.api +
      "/api" +
      "/admin/affiliates/wallet_export?token=" +
      token +
      "&" +
      this.serialize(this.filter);
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
