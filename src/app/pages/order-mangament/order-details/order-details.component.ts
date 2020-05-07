import { OrderStatesService } from './../../services/order-states.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { OrdersService } from "@app/pages/services/orders.service";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
})
export class OrderDetailsComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isOptional = false;
  notifyUser: boolean = true;

  order;

  processing = false;
  delivering = false;
  cancelled = false;
  delivered = false;
  returned = false;

  stepperStates = [1, 2, 3, 4];
  orderId: any;
  orderStatuId: any;
  typeStatusPopup: any;
  orderStatus: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private orderService: OrdersService,
    private orderStatesService : OrderStatesService
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: "",
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: "",
    });

    this.activeRoute.params.subscribe((params) => {
      let id = params["id"];

      this.orderService.getOrder(id).subscribe((response: any) => {
        this.order = response.data;

        this.order.history.map((state) => {
          state.name = this.getStateName(state.state_id);
          state.image = this.getStateImage(state.state_id);
          return state;
        });

        const lastCreatedIndex = this.order.history.reduce((a, v, i) => {
          if (v.state_id == 1) {
            a = i;
          }

          return a;
        });
        let stepsArray = this.order.history.slice(lastCreatedIndex);

        this.order.showStepper = this.stepperStates.includes(
          this.order.state_id
        );
        this.processing = this.hasState(stepsArray, 2);
        this.cancelled = this.hasState(stepsArray, 6);
        this.delivering = this.hasState(stepsArray, 3);
        this.delivered = this.hasState(stepsArray, 4);
        this.returned = this.hasState(stepsArray, 7);
      });
    });
    this.getOrderStates()
  }

  getStateName(id) {
    switch (id) {
      case 1:
        return "Created";
      case 2:
        return "Processing";
      case 3:
        return "On Delivery";
      case 4:
        return "Delivered";
      case 5:
        return "Investigating";
      case 6:
        return "Cancelled";
      case 7:
        return "Returned";
      case 8:
        return "Prepared";
      case 9:
        return "Not Paid";

      default:
        break;
    }
  }

  getStateImage(id) {
    switch (id) {
      case 6:
      case 7:
        return "assets/img/available.svg";
      default:
        return "";
    }
  }

  hasState(stepsArray, state_id) {
    const ind = stepsArray.findIndex((item) => item.state_id === state_id);

    return ind !== -1;
  }

  selectStatus(id, data, indexstatus) {
    console.log(id, data, indexstatus);

    let index = data.order_status.findIndex((item) => item.id == id);
    console.log(index);

    if (index !== -1) {
      data.sub_states = data.order_status[index].sub_states;
      console.log(data);
      this.orderId = data.id;
    }
    // if (!this.firstTime) {
    //   $("#confirmOrderStatus").modal("show");
    //   this.firstTime = false;
    // }
    // console.log(this.firstTime);
  }

  openPopupConfirmStatus(data, type) {
    // type 1 change order status and 2 sub statue
    console.log(data);
    this.orderStatuId = data;
    this.typeStatusPopup = type;
    $("#confirmOrderStatus").modal("show");
  }

  changeStatus(notifyUser, type) {
    console.log(notifyUser, type);
    if (type == 1) {
      this.orderService
        .changeStatus(this.orderId, {
          state_id: this.orderStatuId,
          notify_customer: notifyUser,
        })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#confirmOrderStatus").modal("hide");
          }
        });
    } else {
      this.orderService
        .changeSubStatus(this.orderId, {
          sub_state_id: this.orderStatuId,
        })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#confirmOrderStatus").modal("hide");
          }
        });
    }
  }

  getOrderStates() {
    this.orderStatesService.getOrderEditableStatus().subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.orderStatus = response.data;
        }
      },
    });
  }
}
