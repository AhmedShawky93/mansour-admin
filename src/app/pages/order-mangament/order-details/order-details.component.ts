import { OrderStatesService } from "./../../services/order-states.service";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { OrdersService } from "@app/pages/services/orders.service";
import { ToastrService } from "ngx-toastr";
import { DeliveryService } from "@app/pages/services/delivery.service";
import * as moment from "moment";

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
  SerialNumberForm: FormGroup;
  // serials: FormArray;
  isOptional = false;
  notifyUser: boolean = true;

  amount: number;
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
  cancelReasons = [];
  cancelReason: string = '';
  cancelReasonError: boolean;
  stateSubmitting: boolean = false;
  serialNumber: any;
  selectedAddress: any;
  selectedOrder: any;
  shipmentForm: FormGroup;
  available_pickups: any = [];
  branches: any = [];
  today: Date;
  date: Date;
  SerialNumberArr: any;
  allSerialNumber: any;
  submitted:boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private orderService: OrdersService,
    private toastrService: ToastrService,
    private orderStatesService: OrderStatesService,
    private deliveryService: DeliveryService
  ) { }

  ngOnInit() {
  
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);

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
    this.orderService.cancelReasons()
      .subscribe((response: any) => {
        this.cancelReasons = response.data.filter(item => item.user_type == 'admin')
      });
    // this.order.state_id = this.order.previous_state;
    // this.order.sub_state_id = this.order.previous_subState;
    this.SerialNumberForm = this._formBuilder.group({
      serials: new FormArray([])
    })
  }


  get serialNumberFormGroub() { return this.SerialNumberForm.controls; }
  get serialsFormArr() { return this.serialNumberFormGroub.serials as FormArray; }

  getDynamicFormControlSerialNumberNames() {
    for (let i = this.serialsFormArr.length; i < this.amount; i++) {
      this.serialsFormArr.push(this._formBuilder.group({
        name: new FormControl('', Validators.required),
      }));
    }
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

    this.deliveryService.getAllDeliverers()
      .subscribe((response: any) => {
        this.branches = response.data;
        this.resetShipmentForm();
      });

    this.orderService.getAvailablePickups()
      .subscribe((response: any) => {
        this.available_pickups = response.data;
      })

    this.resetShipmentForm();

  }

  resetShipmentForm() {
    this.shipmentForm = new FormGroup({
      pickup_date: new FormControl(new Date()),
      pickup_time: new FormControl('00:00'),
      pickup_guid: new FormControl(),
      shipping_notes: new FormControl(),
      shipping_method: new FormControl(3),
      aramex_account_number: new FormControl(1),
      branch_id: new FormControl(this.branches.length ? this.branches[0].id : '')
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
    if (index !== -1) {
      this.orderSubStates = this.orderStatus[index].sub_states;
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
        this.error_status_notes = true
        return
      } else if (this.cancelReason == '' || this.cancelReason == undefined) {
        this.cancelReasonError = true
        return
      }
    }
    this.orderService
      .changeBulkChangeState(this.orderId, {
        order_ids: [this.orderId],
        state_id: this.state_id,
        sub_state_id: this.sub_state_id,
        notify_customer: notifyUser,
        subtract_stock: this.subtract_stock,
        status_notes: this.status_notesText ? this.status_notesText : '',
        cancellation_id: this.cancelReason
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

  openEditSerialNumber(product) {
    $("#orderChangeSerial").modal("show");
    this.serialNumberFormGroub.serials = new FormArray([]);
    this.currentItem = product;
    this.amount = product.amount;
    if(product.serial_number != null){
      let x = product.serial_number.split(",");
      for (let i = 0; i < x.length; i++) {
        this.serialsFormArr.push(this._formBuilder.group({
          name: new FormControl(x[i], Validators.required),
        }));
      }
    }else if(product.serial_number == null){
      this.getDynamicFormControlSerialNumberNames();
    }
  }

  submitItemUpdate() {
    this.orderService.updateItemPrice(this.order.id, this.currentItem.id, { discount_price: this.discount, notify_customer: this.notifyUser })
      .subscribe((response: any) => {
        this.currentItem.discount_price = this.discount;
        this.discount = null;
        $("#orderChangePriceAndDiscount").modal("hide");
      });
  }

  submitItemSerialUpdate() {
    if (this.serialNumberFormGroub.serials.valid) {
      this.submitted = true;
      this.allSerialNumber = this.SerialNumberForm.get('serials').value;
      this.allSerialNumber = this.allSerialNumber.map((res) => this.allSerialNumber = res.name)
      let data = {
        id: this.currentItem.id,
        serial_number: this.allSerialNumber
      }
      this.orderService.updateSerial(this.order.id, data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            let oneProduct = this.order.items.find(item => item.id == this.currentItem.id);
            oneProduct.serial_number = data.serial_number.toString();
            this.toastrService.success("successfully");
            $("#orderChangeSerial").modal("hide");
          } else {
            this.toastrService.error(response.message, "Error");
          }
        });
    }else{
      this.markFormGroupTouched(this.SerialNumberForm);
    }
  }

  openEditPriceTotal(product) {
    this.discount = this.order.invoice.total_amount - this.order.invoice.discount
    $("#orderChangePriceTotal").modal("show");
  }

  submitInvoiceUpdate() {
    this.orderService.updateInvoiceDiscount(this.order.id, { discount: this.invoiceDiscount, notify_customer: this.notifyUser })
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

  editAddress(order) {
    this.selectedAddress = order.address;
    this.selectedOrder = order;
    $("#addressModal").modal("show");
  }

  closeAddressModal(data) {
    this.selectedAddress = null;
    this.selectedOrder = null;
    $("#addressModal").modal("hide");
    if (data) {
      this.order.address = data.address;
    }
  }
  addToPickup(id) {
    const orderPickupIds = JSON.parse(localStorage.getItem('orderPickup')) ? JSON.parse(localStorage.getItem('orderPickup')) : [];
    if (orderPickupIds.length) {
      const orderIndexPickup = orderPickupIds.findIndex(item => item == id);
      if (orderIndexPickup == -1) {
        orderPickupIds.push(id);
        localStorage.setItem('orderPickup', JSON.stringify(orderPickupIds));
        this.toastrService.success('Order Is Added');

      } else {
        this.toastrService.error('Order Is Already exists');
      }
    } else {
      localStorage.setItem('orderPickup', JSON.stringify([id]));
      this.toastrService.success('Order Is Added');
    }

  }

  createShipment() {
    $("#shipmentModal").modal("show");
    this.resetShipmentForm();
  }

  submitShipment() {
    let shipment = this.shipmentForm.value;

    shipment.order_id = this.order.id;

    this.stateSubmitting = true
    shipment.pickup_date = moment(shipment.pickup_date).format("YYYY-MM-DD") + " " + shipment.pickup_time;
    this.orderService.createShipment(shipment)
      .subscribe((response: any) => {
        this.stateSubmitting = false;

        if (response.code == 200) {
          this.order.shipments.push(response.data);
          $("#shipmentModal").modal("hide");
          this.resetShipmentForm();
        } else {
          this.toastrService.error('Error Creating Shipment', 'Error');
        }
      });
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object)
      .values(formGroup.controls)
      .forEach((control: FormGroup, ind) => {
        control.markAsTouched();
        control.markAsDirty();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
  }
}
