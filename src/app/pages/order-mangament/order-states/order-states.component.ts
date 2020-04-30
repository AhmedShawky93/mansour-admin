import { OrderStatesService } from "./../../services/order-states.service";
import { AdminsService } from "../../services/admins.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
declare var $: any;

@Component({
  selector: "app-order-states",
  templateUrl: "./order-states.component.html",
  styleUrls: ["./order-states.component.css"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d(0px, 0, 0)",
        })
      ),
      state(
        "out",
        style({
          transform: "translate3d(-100%, 0, 0)",
        })
      ),
      transition("in => out", animate("300ms ease-in-out")),
      transition("out => in", animate("300ms ease-in-out")),
    ]),
  ],
})
export class OrderStatesComponent implements OnInit {
  admins = [];
  searchTerm: "";
  orderStatus: any;
  toggleAddEditData: string = "out";
  viewDataSidebar: string = "out";
  selectData: any;
  selectDataView: any;
  constructor(
    private adminService: AdminsService,
    private toastrService: ToastrService,
    private orderStatesService: OrderStatesService
  ) {}

  ngOnInit() {
    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });
    this.getOrderStates();
  }

  getOrderStates() {
    this.orderStatesService.getOrderStatus().subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.orderStatus = response.data;
        }
      },
    });
  }
  editadmin() {}

  viewData(data) {
    console.log(data);
    this.selectDataView = data;
    this.toggleAddEditData = "out";
    this.viewDataSidebar = "in";
  }

  toggleMenu(data) {
    this.selectData = data;
    this.viewDataSidebar = "out";
    this.toggleAddEditData = "in";
    console.log(this.selectData);
  }

  closeSideBar() {
    this.toggleAddEditData = "out";
    this.viewDataSidebar = "out";
  }

  addOrUpdateOption(data) {
    const index = this.orderStatus.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.orderStatus[index] = data;
    }
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

  addOrUpdateData(data) {
    const index = this.orderStatus.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.orderStatus[index] = data;
    } else {
      this.orderStatus.push(data);
    }
  }
}
