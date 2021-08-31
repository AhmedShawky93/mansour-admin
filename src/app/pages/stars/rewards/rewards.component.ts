import { Component, OnInit } from "@angular/core";
import { LoyalityService } from "@app/pages/services/loyality.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { T } from "@angular/core/src/render3";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-rewards",
  templateUrl: "./rewards.component.html",
  styleUrls: ["./rewards.component.css"],
})
export class RewardsComponent implements OnInit {
  p = 1;
  rewards = [];
  addForm: FormGroup;
  selectFile: File;
  currentReward: any;
  submitting: boolean;
  searchTerm: "";
  constructor(
    private loyalityService: LoyalityService,
    private uploadService: UploadFilesService
  ) {}

  ngOnInit() {
    this.loyalityService.getRewards().subscribe((response: any) => {
      this.rewards = response.data;
      this.rewards = this.rewards.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
    });

    $("body").on("click", ".add-product", function () {
      $("#add-prod").toggleClass("open-view-vindor-types");
    });

    $(".edit-product").on("click", function () {
      $("#edit-prod").toggleClass("open-view-vindor-types");
    });

    $("body").on("click", ".open-show", function () {
      $("#show-p-details").toggleClass("open-view-vindor-types");
    });

    $(".slider").on("click", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    $("#close-vindors1").on("click", function () {
      $("#add-prod").removeClass("open-view-vindor-types");
    });

    $("#close-vindors2").on("click", function () {
      $("#edit-prod").removeClass("open-view-vindor-types");
    });

    $("#show-p-details").on("click", "#close-vindors4", function () {
      $("#show-p-details").removeClass("open-view-vindor-types");
    });

    this.addForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl("", Validators.required),
      name_ar: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      description_ar: new FormControl("", Validators.required),
      point_cost: new FormControl("", Validators.required),
      is_gold: new FormControl(false),
      type: new FormControl("", Validators.required),
      image: new FormControl(""),
      amount_type: new FormControl(""),
      amount: new FormControl(""),
      max_amount: new FormControl(""),
    });
  }

  viewReward(reward) {
    this.currentReward = reward;
  }

  onFormSubmit() {
    if (this.addForm.get("id").value) {
      this.updateReward();
    } else {
      this.addReward();
    }
  }

  addReward() {
    if (!this.addForm.valid) {
      return this.markFormGroupTouched(this.addForm);
    }
    this.submitting = true;
    this.loyalityService
      .createReward(this.addForm.value)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.rewards.unshift(response.data);
          this.addForm.reset();
          $("#add-prod").toggleClass("open-view-vindor-types");
        }

        this.submitting = false;
      });
  }

  editReward(reward) {
    this.addForm = new FormGroup({
      id: new FormControl(reward.id),
      name: new FormControl(reward.name, Validators.required),
      name_ar: new FormControl(reward.name_ar, Validators.required),
      description: new FormControl(reward.description, Validators.required),
      description_ar: new FormControl(
        reward.description_ar,
        Validators.required
      ),
      point_cost: new FormControl(reward.point_cost, Validators.required),
      is_gold: new FormControl(Boolean(reward.is_gold)),
      type: new FormControl(reward.type, Validators.required),
      image: new FormControl(reward.image),
      amount_type: new FormControl(reward.amount_type),
      amount: new FormControl(reward.amount),
      max_amount: new FormControl(reward.max_amount),
    });
    this.changeType(this.addForm);
    this.changeAmountType(this.addForm);
  }

  updateReward() {
    if (!this.addForm.valid) {
      return this.markFormGroupTouched(this.addForm);
    }
    this.submitting = true;
    this.loyalityService
      .updateReward(this.addForm.get("id").value, this.addForm.value)
      .subscribe((response: any) => {
        if (response.code == 200) {
          let ind = this.rewards.findIndex((r) => r.id == response.data.id);
          if (ind !== -1) {
            this.rewards[ind] = response.data;
            this.addForm.reset();
            $("#add-prod").toggleClass("open-view-vindor-types");
          }
        } else {
        }

        this.submitting = false;
      });
  }

  changeType(form: FormGroup) {
    let type = form.get("type").value;

    if (type == 1) {
      form.get("amount_type").setValidators([Validators.required]);

      // clear validators
      form.get("image").clearValidators();
    } else if (type == 2) {
      form.get("image").setValidators([Validators.required]);

      // clear validators
      form.get("amount_type").clearValidators();
      form.get("amount").clearValidators();
      form.get("max_amount").clearValidators();
    }

    form.get("image").updateValueAndValidity();
    form.get("amount_type").updateValueAndValidity();
    form.get("amount").updateValueAndValidity();
    form.get("max_amount").updateValueAndValidity();
  }

  changeAmountType(form: FormGroup) {
    let amount_type = form.get("amount_type").value;

    if (amount_type == 1) {
      form.get("amount").setValidators([Validators.required]);

      form.get("max_amount").clearValidators();
    } else if (amount_type == 2) {
      form.get("amount").setValidators([Validators.required]);
      form.get("max_amount").setValidators([Validators.required]);
    }

    form.get("amount").updateValueAndValidity();
    form.get("max_amount").updateValueAndValidity();
  }

  onImageSelected(event, form: FormGroup) {
    this.selectFile = <File>event.target.files[0];
    this.uploadService
      .uploadFile(this.selectFile)
      .subscribe((response: any) => {
        if (response.body) {
          form.get("image").setValue(response.body.data.filePath);
        }
      });
  }

  changeActive(reward) {
    this.rewards
      .filter((reward) => {
        return reward.showReason;
      })
      .map((reward) => {
        if (reward.active == reward.deactivated) {
          reward.active = !reward.active;
        }
        reward.showReason = 0;
        return reward;
      });

    if (reward.active) {
      // currently checked
      reward.showReason = 0;
      reward.notes = "";
      if (reward.deactivated) {
        this.loyalityService
          .activateReward(reward.id)
          .subscribe((data: any) => {
            reward.active = 1;
            reward.notes = "";
            reward.deactivation_notes = "";
            reward.deactivated = 0;
          });
      }
    } else {
      reward.notes = reward.deactivation_notes;
      reward.showReason = 1;
    }
  }

  cancelDeactivate(reward) {
    reward.active = 1;
    reward.notes = "";
    reward.showReason = 0;
  }

  submitDeactivate(reward) {
    reward.active = 0;
    this.loyalityService
      .deactivateReward(reward.id, { deactivation_notes: reward.notes })
      .subscribe((data: any) => {
        reward.active = 0;
        reward.deactivation_notes = reward.notes;
        reward.showReason = 0;
        reward.deactivated = 1;
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
}
