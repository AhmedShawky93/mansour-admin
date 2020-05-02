import { AdminsService } from "../../services/admins.service";
import { RolesService } from "../../services/roles.service";
import { OrderStatesService } from "../../services/order-states.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
declare var $: any;

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.css"],
})
export class RolesComponent implements OnInit {
  showgivin = false;
  roles = [];
  searchTerm: "";
  roleForm: FormGroup;
  addSubAdminForm: FormGroup;
  editSubAdminForm: FormGroup;
  role: any;
  p: 1;
  permissions = [];
  states = [];

  constructor(
    private adminService: AdminsService,
    private rolesService: RolesService,
    private orderStatesService: OrderStatesService,
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

    this.roleForm = new FormGroup({
      name: new FormControl("", Validators.required),
      order_states: new FormControl(""),
      permissions: new FormControl("", Validators.required),
    });

    this.adminService.getPermissions().subscribe((response: any) => {
      this.permissions = response.data;
    });

    this.orderStatesService.getOrderStatus().subscribe((response: any) => {
      this.states = response.data;
    });

    this.getRoles();
  }

  setRole(role) {
    this.roleForm = new FormGroup({
      id: new FormControl(role.id),
      name: new FormControl(role.name, Validators.required),
      permissions: new FormControl(role.permissions.map((p) => p.id), Validators.required),
      order_states: new FormControl(role.states.map((s) => s.id)),
    });
  }

  getRoles() {
    this.rolesService.getRoles().subscribe((response: any) => {
      this.roles = response.data;
      this.roles = this.roles.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
    });
  }

  editRole(role) {
    this.setRole(role);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createRole(role) {
    if (!this.roleForm.valid) {
      this.markFormGroupTouched(this.roleForm);
      return;
    }

    this.rolesService.createRole(this.roleForm.value).subscribe((response: any) => {
      if (response.code === 200) {
        this.roles.push(response.data);
        $("#add-admin").removeClass("open-view-vindor-types");
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  updateRole(role) {
    if (!this.roleForm.valid) {
      this.markFormGroupTouched(this.roleForm);
      return;
    }

    role = this.roleForm.value;
    this.rolesService
      .updateRole(role.id, role)
      .subscribe((response: any) => {
        if (response.code === 200) {
          const ind = this.roles.findIndex((item) => {
            return item.id === role.id;
          });

          if (ind !== -1) {
            this.roles[ind] = response.data;
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

  resetForm() {
    this.roleForm.reset();
  }

  changeActive(role) {
    this.roles
      .filter((role) => {
        return role.showReason;
      })
      .map((role) => {
        if (role.active === role.deactivated) {
          role.active = !role.active;
        }
        role.showReason = 0;
        return role;
      });

    if (role.active) {
      // currently checked
      role.showReason = 0;
      role.notes = "";
      if (role.deactivated) {
        this.rolesService.activateRole(role.id).subscribe((data: any) => {
          role.active = 1;
          role.notes = "";
          role.deactivation_notes = "";
          role.deactivated = 0;
        });
      }
    } else {
      role.notes = role.deactivation_notes;
      role.notes = "";
      role.showReason = 1;
    }
  }

  cancelDeactivate(role) {
    role.active = 1;
    role.notes = "";
    role.showReason = 0;
  }

  submitDeactivate(role) {
    role.active = 0;
    this.rolesService
      .deactivateRole(role.id, { deactivation_notes: role.notes })
      .subscribe((data: any) => {
        role.active = 0;
        role.deactivation_notes = role.notes;
        role.showReason = 0;
        role.deactivated = 1;
      });
  }
}
