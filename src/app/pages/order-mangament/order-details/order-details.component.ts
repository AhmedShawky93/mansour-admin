import { OrderStatesService } from "./../../services/order-states.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { OrdersService } from "@app/pages/services/orders.service";
import { ToastrService } from "ngx-toastr";
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
  subtract_stock: boolean = false;

  stepperStates = [1, 2, 3, 4];
  orderId: any;
  orderStatuId: any;
  typeStatusPopup: any;
  orderStatus: any;
  orderSubStates = [];
  state_id: any;
  sub_state_id: any;
  textMessage = "";
  orderStatusId: string;
  status_notesText: string;
  error_status_notes: boolean;
  discount: any;
  currentItem: any;
  invoiceDiscount: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private orderService: OrdersService,
    private toastrService: ToastrService,
    private orderStatesService: OrderStatesService
  ) { }

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

      this.getOrderDetails(id)
    });
    // this.order.state_id = this.order.previous_state;
    // this.order.sub_state_id = this.order.previous_subState;
  }
  getOrderDetails(id) {
    this.orderService.getOrder(id).subscribe((response: any) => {
      this.order = response.data;
      this.getOrderStates();

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

  changeStausInOrder(state, sub_state, id) {
    console.log(state, sub_state);
    this.state_id = state;
    this.sub_state_id = sub_state;
    this.orderId = id;
    $("#confirmOrderStatus").modal("show");
  }

  selectStatus(id) {
    this.orderStatusId = id;
    let index = this.orderStatus.findIndex((item) => item.id == id);
    console.log(index);

    if (index !== -1) {
      this.orderSubStates = this.orderStatus[index].sub_states;
      console.log(this.orderSubStates);
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
    this.status_notesText = ''
  }

  confirmChangeStatus(notifyUser) {
    console.log(notifyUser);
    if (this.orderStatusId == '6') {
      console.log(this.status_notesText)
      if (this.status_notesText == '' || this.status_notesText == undefined) {
        console.log('if data');
        this.error_status_notes = true
        return
      } else {
        console.log('else data');
      }
    }
    this.orderService
      .changeBulkChangeState(this.orderId, {
        order_ids: [this.orderId],
        state_id: this.state_id,
        sub_state_id: this.sub_state_id,
        notify_customer: notifyUser,
        subtract_stock: this.subtract_stock,
        status_notes: this.status_notesText ? this.status_notesText : ''

      })
      .subscribe((response: any) => {
        if (response.code === 200) {
          $("#confirmOrderStatus").modal("hide");
          this.status_notesText = '';
          this.getOrderDetails(this.orderId)
        }
      });
  }

  openEditPriceProduct(product) {
    this.currentItem = product;
    this.discount = product.discount_price;
    $("#orderChangePriceAndDiscount").modal("show");
  }

  submitItemUpdate() {
    this.orderService.updateItemPrice(this.order.id, this.currentItem.id, {discount_price: this.discount, notify_customer: this.notifyUser})
      .subscribe((response: any) => {
        this.currentItem.discount_price = this.discount;
        this.discount = null;
        $("#orderChangePriceAndDiscount").modal("hide");
      });
  }

  openEditPriceTotal(product) {
    console.log(product);
    this.discount = this.order.invoice.total_amount - this.order.invoice.discount
    $("#orderChangePriceTotal").modal("show");
  }

  submitInvoiceUpdate() {
    this.orderService.updateInvoiceDiscount(this.order.id, {discount: this.invoiceDiscount, notify_customer: this.notifyUser})
      .subscribe((response: any) => {
        this.invoiceDiscount = null;
        this.order.invoice.discoutn = this.invoiceDiscount;
        $("#orderChangePriceTotal").modal("hide");
      });
  }

  getOrderStates() {
    this.orderStatesService.getOrderEditableStatus().subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.orderStatus = response.data;
          this.selectStatus(this.order.state_id);
        }
      },
    });
  }

  copyInputMessage() {
    this.textMessage = "";
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    this.generateSkusToCopy();
    selBox.value = this.textMessage;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.toastrService.success("copied");
  }

  generateSkusToCopy() {
    this.order.items.forEach((element, index) => {
      console.log('index ==> ', index + 1)
      console.log('this.order.items.length ==> ', this.order.items.length)
      if (index + 1 < this.order.items.length) {
        this.textMessage = this.textMessage.concat(element.product.sku + " \n");
      } else {
        this.textMessage = this.textMessage.concat(element.product.sku);
      }
    });
  }
}
