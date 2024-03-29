import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import * as moment from "moment";
import { ToastrService } from "ngx-toastr";

import { SettingService } from "@app/pages/services/setting.service";
import { ShowAffiliateService } from "@app/pages/services/show-affiliate.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { NgxSpinnerService } from "ngx-spinner";

function currentPasswordValidator(group: AbstractControl) {
  if (group.get("password").value && !group.get("current_password").value) {
    return { currentPassword: true };
  }

  return null;
}

function confirmPasswordValidator(group: AbstractControl) {
  if (
    group.get("password").value &&
    group.get("confirmPassword").value !== group.get("password").value
  ) {
    return { confirmPassword: true };
  }
  return null;
}

function timeValidator(group: AbstractControl) {
  let open_time = group.get("open_time").value;
  let off_time = group.get("off_time").value;
  if (
    off_time &&
    open_time &&
    moment(open_time, "h:mma").isAfter(moment(off_time, "h:mma"))
  ) {
    return { timeError: true };
  }

  return null;
}

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  page: any = 1;
  gallery: any;
  public errorMatch;
  selectFile = null;
  setting: any = [];

  formSetting: FormGroup;
  user: any;
  users: any;
  requiredIf: boolean;
  selectedFiles: File[];
  settings: any;
  settingsLoading: boolean;
  systemForm: FormGroup;
  starsForm: FormGroup;
  systemLoading: boolean;
  starsLoading: boolean;
  environmentVariables;
  passwordForm: FormGroup;
  stateSubmitting: boolean;
  showUpdateForm: boolean;
  constructor(
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private showAffiliateService: ShowAffiliateService,
    private spinner: NgxSpinnerService
  ) {
    this.getConfig();
  }

  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }

  ngOnInit() {
    this.getUser();

    this.uploadFile.getUploadedFiles().subscribe((response: any) => {
      this.gallery = response.data;
    });

    this.loadSettings();
  }

  loadMore() {
    this.page++;
    this.uploadFile.getUploadedFiles(this.page).subscribe((response: any) => {
      this.gallery = this.gallery.concat(response.data);
    });
  }

  setForm(user) {
    this.formSetting = new FormGroup(
      {
        image: new FormControl(user.image),
        name: new FormControl(user.name, [
          Validators.required,
          Validators.maxLength(20),
        ]),
        email: new FormControl(user.email, Validators.required),
        // current_password: new FormControl(""),
        // password: new FormControl("", [Validators.minLength(8), Validators.required]),
        // confirmPassword: new FormControl(""),
      }
      // { validators: [currentPasswordValidator, confirmPasswordValidator] }
    );
    this.passwordForm = new FormGroup(
      {
        name: new FormControl(user.name, [
          Validators.required,
          Validators.maxLength(20),
        ]),
        email: new FormControl(user.email, Validators.required),
        current_password: new FormControl("", Validators.required),
        password: new FormControl("", [
          Validators.minLength(8),
          Validators.required,
        ]),
        confirmPassword: new FormControl("", Validators.required),
      },
      { validators: [currentPasswordValidator, confirmPasswordValidator] }
    );
  }

  getUser() {
    this.spinner.show();
    this.settingService.getNotification().subscribe((response: any) => {
      this.spinner.hide();
      this.user = response.data;
      this.user.imageUrl = this.user.image;
      this.setForm(this.user);
    });
  }

  onimgeSelected(event, image) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        this.user.image = response.body.data.name;
        this.user.imageUrl = response.body.data.filePath;
        image.setValue(response.body.data.filePath);
      }
    });
  }

  oniImageSelected(event) {
    this.selectedFiles = <Array<File>>event.target.files;

    this.uploadFile
      .uploadFiles(this.selectedFiles)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.gallery = this.gallery.concat(response.data);
          this.toastrService.success(response.message);
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  updateSetting(user) {
    if (!this.formSetting.valid) {
      this.markFormGroupTouched(this.formSetting);
      return;
    }

    user = this.formSetting.value;

    if (this.user.imageUrl === "") {
      user.imageUrl = "";
      user.image = "";
    }

    // delete user.confirmPassword;
    this.systemLoading = true;
    this.settingService.updateNotification(user).subscribe((response: any) => {
      this.systemLoading = false;
      if (response.code === 200) {
        this.user = response.data;
        this.user.imageUrl = this.user.image;
        this.formSetting.reset();
        this.setForm(this.user);
        this.settingService.imageload(response.data);
        this.toastrService.success(response.message);
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  openResetPasswordForm() {
    this.showUpdateForm = true;
    $("#updatePassword").modal("show");
  }

  updatePassword(user) {
    this.stateSubmitting = true;
    if (!this.passwordForm.valid) {
      this.markFormGroupTouched(this.passwordForm);
      this.stateSubmitting = false;
      return;
    }

    user = this.passwordForm.value;

    delete user.confirmPassword;

    this.settingService.updateNotification(user).subscribe((response: any) => {
      this.stateSubmitting = false;
      if (response.code === 200) {
        this.user = response.data;
        this.user.imageUrl = this.user.image;
        this.passwordForm.reset();
        this.setForm(this.user);
        this.settingService.imageload(response.data);
        this.toastrService.success(response.message);
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  // checkColorValidity(color) {
  //   if (color.substring(0, 1) == '#') {
  //     return;
  //   } else {
  //     color = `#${color}`;
  //     this.systemForm.controls.softbar_bg_color.setValue(color);
  //   }
  // }

  loadSettings() {
    // this.settingsLoading = true;
    // if (!this.settings) {
    //   this.settingsLoading = true;
    //   this.settingService.getSettings().subscribe((response: any) => {
    //     this.settings = response.data;
    //     this.systemForm = new FormGroup(
    //       {
    //         enable_affiliate: new FormControl(this.settings.enable_affiliate),
    //         affiliate_pending_days: new FormControl(this.settings.affiliate_pending_days, [Validators.pattern("^[0-9]+$"), Validators.min(0)]),
    //         min_order_amount: new FormControl(this.settings.min_order_amount),
    //         except_cod_amount: new FormControl(this.settings.except_cod_amount),
    //         off_time: new FormControl(this.settings.off_time),
    //         open_time: new FormControl(this.settings.open_time),
    //         showSoftLaunchBar: new FormControl(this.settings.showSoftLaunchBar ? this.settings.showSoftLaunchBar : false),
    //         softbar_text_ar: new FormControl(this.settings.softbar_text_ar ? this.settings.softbar_text_ar : ''),
    //         softbar_text_en: new FormControl(this.settings.softbar_text_en ? this.settings.softbar_text_en : ''),
    //         softbar_bg_color: new FormControl(this.settings.softbar_bg_color ? this.settings.softbar_bg_color : ''),
    //       },
    //       timeValidator
    //     );

    //     this.starsForm = new FormGroup({
    //       ex_rate_pts: new FormControl(
    //         this.settings.ex_rate_pts,
    //         Validators.required
    //       ),
    //       ex_rate_egp: new FormControl(
    //         this.settings.ex_rate_egp,
    //         Validators.required
    //       ),
    //       ex_rate_gold: new FormControl(
    //         this.settings.ex_rate_gold,
    //         Validators.required
    //       ),
    //       refer_points: new FormControl(
    //         this.settings.refer_points,
    //         Validators.required
    //       ),
    //       refer_minimum: new FormControl(
    //         this.settings.refer_minimum,
    //         Validators.required
    //       ),
    //       egp_gold: new FormControl(
    //         this.settings.egp_gold,
    //         Validators.required
    //       ),
    //       pending_days: new FormControl(
    //         this.settings.pending_days,
    //         Validators.required
    //       ),
    //     });
    //     this.settingsLoading = false;
    //   });
    // }
    this.systemForm = new FormGroup(
      {
        enable_affiliate: new FormControl(""),
        affiliate_pending_days: new FormControl("", [
          Validators.pattern("^[0-9]+$"),
          Validators.min(0),
        ]),
        min_order_amount: new FormControl(""),
        except_cod_amount: new FormControl(""),
        off_time: new FormControl(""),
        open_time: new FormControl(""),
        showSoftLaunchBar: new FormControl(false),
        softbar_text_ar: new FormControl(""),
        softbar_text_en: new FormControl(""),
        softbar_bg_color: new FormControl(""),
      },
      timeValidator
    );

    this.starsForm = new FormGroup({
      ex_rate_pts: new FormControl("", Validators.required),
      ex_rate_egp: new FormControl("", Validators.required),
      ex_rate_gold: new FormControl("", Validators.required),
      refer_points: new FormControl("", Validators.required),
      refer_minimum: new FormControl("", Validators.required),
      egp_gold: new FormControl("", Validators.required),
      pending_days: new FormControl("", Validators.required),
    });
    // this.settingsLoading = false;
  }

  updateSystemSettings() {
    if (!this.systemForm.valid) {
      return this.markFormGroupTouched(this.systemForm);
    }

    this.systemLoading = true;
    this.settingService
      .updateSystemSettings(this.systemForm.value)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.settings = response.data;
          this.toastrService.success("System Settings Updated Successfully!");
          this.showAffiliateService.showAffiliate.next(
            this.systemForm.get("enable_affiliate").value
          );
          this.systemLoading = false;
        }
      });
  }

  updateLoyalitySettings() {
    if (!this.starsForm.valid) {
      return this.markFormGroupTouched(this.starsForm);
    }

    this.starsLoading = true;
    this.settingService
      .updateLoyalitySettings(this.starsForm.value)
      .subscribe((response: any) => {
        this.settings = response.data;
        // var environmentVariables = JSON.parse(localStorage.getItem("systemConfig"));
        this.toastrService.success(
          `${this.environmentVariables.brandRelatedVariables.brand} Stars Settings Updated Successfully!`
        );
        this.starsLoading = false;
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  deleteImage(img) {
    this.user.imageUrl = "";
    this.user.image = "";
  }
}
