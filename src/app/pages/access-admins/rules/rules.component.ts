import { AdminsService } from "../../services/admins.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
declare var $: any;

@Component({
  selector: "app-rules",
  templateUrl: "./rules.component.html",
  styleUrls: ["./rules.component.css"],
})
export class RulesComponent implements OnInit {
  showgivin = false;
  admins = [];
  searchTerm: "";
  addSubAdminForm: FormGroup;
  editSubAdminForm: FormGroup;
  admin: any;
  p: 1;
  permissions = [];

  constructor(
    private adminService: AdminsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    // view sidebar
    $(".add-new").on("click", function () {
      $("#add-admin").toggleClass("open-view-vindor-types");
    });

    $(".table").on("click", ".edit-new", function () {
      $("#edit-admin").toggleClass("open-view-vindor-types");
    });
    // close
    $("#close-vindors1").on("click", function () {
      $("#add-admin").removeClass("open-view-vindor-types");
    });

    $("#close-vindors2").on("click", function () {
      $("#edit-admin").removeClass("open-view-vindor-types");
    });

    this.addSubAdminForm = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      permissions: new FormControl("", Validators.required),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.adminService.getPermissions().subscribe((response) => {
      this.permissions = response.data;
    });

    this.getAdmins();
  }

  setAdmin(admin) {
    this.editSubAdminForm = new FormGroup({
      id: new FormControl(admin.id ? admin.id : "", Validators.required),
      name: new FormControl(admin.name ? admin.name : "", Validators.required),
      email: new FormControl(admin.email ? admin.email : "", [
        Validators.required,
        Validators.email,
      ]),
      permissions: new FormControl(
        admin.permissions.map((p) => p.id),
        Validators.required
      ),
      password: new FormControl(admin.password ? admin.password : "", [
        Validators.minLength(8),
      ]),
    });
  }

  getAdmins() {
    this.adminService.getAdmins().subscribe((response: any) => {
      this.admins = response.data;
      this.admins = this.admins.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
    });
  }

  editadmin(admin) {
    console.log(admin);
    this.setAdmin(admin);
    console.log(this.setAdmin(admin));
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createSubAdmin(subAdmin) {
    if (!this.addSubAdminForm.valid) {
      this.markFormGroupTouched(this.addSubAdminForm);
      return;
    }

    subAdmin = this.addSubAdminForm.value;
    this.adminService.createAdmin(subAdmin).subscribe((response: any) => {
      if (response.code === 200) {
        this.admins.push(response.data);
        $("#add-admin").removeClass("open-view-vindor-types");
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  updateSubAdmin(admin) {
    if (!this.editSubAdminForm.valid) {
      this.markFormGroupTouched(this.editSubAdminForm);
      return;
    }

    admin = this.editSubAdminForm.value;
    this.adminService
      .updateAdmin(admin.id, admin)
      .subscribe((response: any) => {
        if (response.code === 200) {
          const ind = this.admins.findIndex((item) => {
            return item.id === admin.id;
          });

          if (ind !== -1) {
            this.admins[ind] = response.data;
          }
          $("#edit-admin").removeClass("open-view-vindor-types");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  toggleGivin() {
    this.showgivin = !this.showgivin;
  }

  changeActive(admin) {
    this.admins
      .filter((admin) => {
        return admin.showReason;
      })
      .map((admin) => {
        if (admin.active === admin.deactivated) {
          admin.active = !admin.active;
        }
        admin.showReason = 0;
        return admin;
      });

    if (admin.active) {
      // currently checked
      admin.showReason = 0;
      admin.notes = "";
      if (admin.deactivated) {
        this.adminService.activateAdmin(admin.id).subscribe((data: any) => {
          admin.active = 1;
          admin.notes = "";
          admin.deactivation_notes = "";
          admin.deactivated = 0;
        });
      }
    } else {
      admin.notes = admin.deactivation_notes;
      admin.notes = "";
      admin.showReason = 1;
    }
  }

  cancelDeactivate(admin) {
    admin.active = 1;
    admin.notes = "";
    admin.showReason = 0;
  }

  submitDeactivate(admin) {
    admin.active = 0;
    this.adminService
      .deactivateAdmin(admin.id, { deactivation_notes: admin.notes })
      .subscribe((data: any) => {
        admin.active = 0;
        admin.deactivation_notes = admin.notes;
        admin.showReason = 0;
        admin.deactivated = 1;
      });
  }
}
