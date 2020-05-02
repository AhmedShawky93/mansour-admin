import { AdminsService } from "./../../services/admins.service";
import { RolesService } from "./../../services/roles.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
declare var $: any;

@Component({
  selector: "app-user-sub-admin",
  templateUrl: "./user-sub-admin.component.html",
  styleUrls: ["./user-sub-admin.component.css"],
})
export class UserSubAdminComponent implements OnInit {
  showgivin = false;
  admins = [];
  searchTerm: "";
  adminForm: FormGroup;
  editSubAdminForm: FormGroup;
  admin: any;
  p: 1;
  roles = [];

  constructor(
    private adminService: AdminsService,
    private rolesService: RolesService,
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

    this.adminForm = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      role_id: new FormControl("", Validators.required),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.rolesService.getRoles().subscribe((response) => {
      this.roles = response.data;
    });

    this.getAdmins();
  }

  setAdmin(admin) {
    this.adminForm = new FormGroup({
      id: new FormControl(admin.id, Validators.required),
      name: new FormControl(admin.name, Validators.required),
      email: new FormControl(admin.email, [Validators.required, Validators.email]),
      role_id: new FormControl(admin.roles.length ? admin.roles[0].id : null, Validators.required),
      password: new FormControl("", [Validators.minLength(8)]),
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

  editAdmin(admin) {
    this.setAdmin(admin);
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
    if (!this.adminForm.valid) {
      this.markFormGroupTouched(this.adminForm);
      return;
    }

    subAdmin = this.adminForm.value;
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
    if (!this.adminForm.valid) {
      this.markFormGroupTouched(this.adminForm);
      return;
    }

    admin = this.adminForm.value;
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
