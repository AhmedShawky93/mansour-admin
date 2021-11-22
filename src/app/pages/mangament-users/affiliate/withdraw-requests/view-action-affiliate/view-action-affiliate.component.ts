import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AffiliateService } from "@app/pages/services/affiliate.service";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
@Component({
  selector: "app-view-action-affiliate",
  templateUrl: "./view-action-affiliate.component.html",
  styleUrls: ["./view-action-affiliate.component.scss"],
})
export class ViewActionAffiliateComponent implements OnInit {
  message_title;
  info;
  message;
  withdrawForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ViewActionAffiliateComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private toastrService: ToastrService,
    private affiliateService: AffiliateService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setForm();
    this.info = this.data;
    this.getMessage();
  }

  setForm() {
    this.withdrawForm = this.formBuilder.group({
      message: new FormControl("", Validators.required),
    });
  }

  getMessage() {
    this.message_title = `Are you sure you want to ${
      this.info.state == 1 ? "accept" : "reject"
    } this withdraw request for  '${
      this.info.data.affiliate.name + " " + this.info.data.affiliate.last_name
    }'?`;
  }

  submitForm() {
    if (this.info.state == 1) {
      this.withdrawForm.get("message").clearValidators();
      this.approveWithdraw();
    } else {
      this.rejectWithdraw();
    }
  }

  approveWithdraw() {
    this.affiliateService
      .affiliateWithdrawApprove(this.info.data.id)
      .subscribe((rep: any) => {
        if (rep.code == 200) {
          this.toastrService.success("Successful accepted");
          this.dialogRef.close("1");
        } else {
          this.toastrService.error(rep.message);
        }
      });
  }

  rejectWithdraw() {
    const rejection_reason = this.withdrawForm.get("message").value;
    this.affiliateService
      .affiliateWithdrawReject(this.info.data.id, rejection_reason)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.toastrService.success(response.message);
          this.dialogRef.close("1");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  closePopup() {
    this.dialogRef.close();
  }
}
