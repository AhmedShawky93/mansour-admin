import { AffiliateService } from "./../../../services/affiliate.service";
import { OptionsService } from "../../../services/options.service";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import "rxjs/Rx";
import { Subject } from "rxjs/Rx";
import { tap, delay } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
@Component({
  selector: "app-requests-join",
  templateUrl: "./requests-join.component.html",
  styleUrls: ["./requests-join.component.css"],
})
export class RequestsJoinComponent implements OnInit {
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  searchTerm;
  q = 1;
  submitting = false;

  categories: any;
  searchForm: FormGroup;
  total = 0;
  p = 1;
  searchObj = {
    page: 1,
    q: "",
  };
  selectOptionData: any;
  selectOptionDataView: any;
  loading: boolean;
  productIsEmpty: boolean;
  users = [];
  filter$ = new Subject();
  filter = {
    q: "",
    page: 1,
  };
  selectDataToMakeAction: any;
  constructor(
    private toastrService: ToastrService,
    private affiliateService: AffiliateService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getRequestsJoin();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });

    this.filter$
      .debounceTime(400)
      .pipe(tap((e) => (this.loading = true)))
      .switchMap((filter) => this.searchDeliverers())
      .subscribe((result: any) => {
        this.users = result.data.affiliates;
        this.total = result.data.total;
        this.loading = false;
      });
  }

  getRequestsJoin() {
    this.spinner.show();
    this.affiliateService
      .getUserRequests(this.filter)
      .subscribe((response: any) => {
        this.spinner.hide();

        this.users = response.data.affiliates;
        this.total = response.data.total;
      });
  }

  searchDeliverers() {
    return this.affiliateService.getUserRequests(this.filter);
  }

  changePage(p) {
    this.p = p;
    this.filter.page = p;
    console.log(this.filter);
    this.filter$.next(this.filter);
  }

  addOrUpdateOption(data) {
    const index = this.users.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.users[index] = data;
    } else {
      this.users.unshift(data);
    }
  }
  openPopupAction(type: any, data) {
    this.selectDataToMakeAction = data;
    this.selectDataToMakeAction.type = type;
    this.selectDataToMakeAction.message = "";
    this.selectDataToMakeAction.message_error = "";
    const message_title = `Are you sure you want to ${
      type == 1 ? "Accept" : "Reject"
    } user '${data.name + "" + data.last_name}' as an affiliate?`;
    this.selectDataToMakeAction.message_title = message_title;
    $("#viewActionUser").modal("show");
  }
  submitAcceptUser(data) {
    data.message_error = "";
    if (data.type == 1) {
      // api user Approve
      this.submitting = true;
      this.affiliateService.userApprove(data.id).subscribe((rep: any) => {
        if (rep.code == 200) {
          // this.updateStatus(data)
          this.toastrService.success("Successful accepted");
          $("#viewActionUser").modal("hide");
          this.getRequestsJoin();
        } else {
          this.toastrService.error(rep.message);
        }
        this.submitting = false;
      });
    } else if ((data.type = 2)) {
      // api user Reject
      if (data.message == "") {
        data.message_error = "rejection reason is required";
        return;
      }
      console.log(data.message);
      this.submitting = true;
      this.affiliateService
        .userReject(data.id, data.message)
        .subscribe((rep: any) => {
          if (rep.code == 200) {
            this.toastrService.success(rep.message);
            $("#viewActionUser").modal("hide");
            this.getRequestsJoin();
          } else {
            this.toastrService.error(rep.message);
          }
          this.submitting = false;
        });
    }
  }
  updateStatus(data) {
    const index = this.users.findIndex((item) => item.id == data.id);
    console.log(index);
    console.log(this.users[index]);
    if (index !== -1) {
      data.status = data.type;
      this.users[index] = data;
      if (data.type == 1) {
        this.users.splice(index, 1);
      }
    }
  }
}
