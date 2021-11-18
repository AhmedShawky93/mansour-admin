import { OrderStatesService } from "./../../../services/order-states.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { OrdersService } from "@app/pages/services/orders.service";
import { ToastrService } from "ngx-toastr";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-order-delivery-details",
  templateUrl: "./order-delivery-details.component.html",
  styleUrls: ["./order-delivery-details.component.css"],
})
export class OrderDeliveryDetailsComponent implements OnInit {
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
  orderSubStates = [];
  state_id: any;
  sub_state_id: any;
  textMessage = "";
  orderStatusId: string;
  status_notesText: string;
  error_status_notes: boolean;
  pickup: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private orderService: OrdersService,
    private toastrService: ToastrService,
    private orderStatesService: OrderStatesService
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      let id = params["id"];

      this.orderService.getOrderPickup(id).subscribe((response: any) => {
        this.pickup = response.data;
      });
    });
  }
}
