import { PromosService } from './../../services/promos.service';
import { AreasService } from "@app/pages/services/areas.service";
import { Router } from "@angular/router";
import { OrderStatesService } from "./../../services/order-states.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { OrdersService } from "@app/pages/services/orders.service";
import { CategoryService } from "@app/pages/services/category.service";
import { ToastrService } from "ngx-toastr";
import { MatInput } from "@angular/material";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/map";
import * as moment from "moment";

import { Title } from "@angular/platform-browser";
import { Subject, Observable, concat, of } from "rxjs";
import { tap, switchMap, debounceTime, distinctUntilChanged, catchError, map } from "rxjs/operators";
import { AuthService } from "@app/shared/auth.service";
import { environment } from "@env/environment";
import { DeliveryService } from "@app/pages/services/delivery.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProductsService } from "@app/pages/services/products.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AffiliateService } from '@app/pages/services/affiliate.service';
import { debounce } from 'lodash';

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
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
export class OrdersComponent implements OnInit {
  loading: boolean;
  date: any;
  selectedSubcategory = "";
  selectedCategory = "";
  search: boolean;
  firstTime: boolean = true;
  no_orders: boolean = false;
  listFilter: string;
  viewFilter: string;
  @ViewChild("mdate", { read: MatInput }) input: MatInput;

  showDelete: any;
  show = false;
  hide = true;
  state_id = "";
  sub_state_id = "";
  orders: any[] = [];

  categories: any[];
  sub_categories: any[];

  order: any;
  productTerm: "";
  currentOrder: any;

  availableDeliverers: any[];

  product_list: any[];

  filter = {
    term: "",
    state_id: "",
    date_from: "",
    date_to: "",
    customer_city_ids: [],
    customer_area_ids: [],
    hide_scheduled: 1,
    ids: [],
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_id: "",
    payment_method: null,
    user_agent: "",
  };

  p = 1;

  newAmount;

  searchTerm = "";
  listSearch = "";

  total: number = 0;

  filter$ = new Subject();
  exportUrl: string;
  exportProductsUrl: string;
  productsUrl: string;
  orderStatus = [];
  orderSubStatus: any;
  typeStatusPopup: any;
  notifyUser: boolean = true;
  subtract_stock: boolean = false;
  idOrder: any;
  orderId: any;
  orderStatuId: any;
  ineditableStates = [9, 11, 12];
  cities: any;
  areaList: any;
  districts: any;
  loadingProductSideBar: boolean;
  orderSelected: any;
  selectedDistrict: any;
  ordersBulk: any = [];
  selectAllChecked = false;
  orderSubStates = [];
  errorMessage: string;
  showErrorItems: string;
  items: any;
  status_notes = "";
  status_notesText = "";
  deleteIds: any;
  error_status_notes: boolean;
  orderStatusId: any;
  branches: any = [];
  stateForm: FormGroup;
  areaListSearch: any[];
  available_pickups: any[];

  products: any = [];
  products$: Observable<any>;
  productsInput$ = new Subject<String>();
  productsLoading: boolean;
  selectedProduct: any;
  stateSubmitting: boolean = false;
  cancelReasons: any;
  cancelReasonError: boolean;
  toggleAddOrder: string = "out";
  selectedOrder: any;
  paymentMethods: any;
  orderSelectedPickup = [];
  enableSubmitPickupOrder: boolean;
  today: Date;
  affiliateUsersLoading: boolean;
  affiliateUsers: Array<any>;
  constructor(
    private ordersService: OrdersService,
    private catService: CategoryService,
    private toasterService: ToastrService,
    private titleService: Title,
    private auth: AuthService,
    private router: Router,
    private _areaService: AreasService,
    private orderStatesService: OrderStatesService,
    private deliveryService: DeliveryService,
    private productService: ProductsService,
    private promoService: PromosService,
    private affiliateService: AffiliateService,

  ) {
    this.affiliateSearch = debounce(this.affiliateSearch, 700);
    this.titleService.setTitle("Orders");
  }

  ngOnInit() {
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
    this.orderSelectedPickup = JSON.parse(localStorage.getItem("orderPickup"));
    this.getCities();
    this.getOrderStates();
    this.getPaymentMethods();
    this.ordersService.cancelReasons().subscribe((response: any) => {
      this.cancelReasons = response.data.filter(
        (item) => item.user_type == "admin"
      );
    });

    $(".payment-open").on("click", function () {
      $(".payment-area").slideToggle(100);
    });

    $(".tb-processing").on("click", ".color-yellow", function () {
      $("#view-deactive").toggleClass("open-view-vindor-types");
    });

    $(".tb-processing").on("click", ".color-purple", function () {
      $("#view-deactive").toggleClass("open-view-vindor-types");
    });

    $(".tb-assign").on("click", " .bg-blue", function () {
      $("#delevary1").slideToggle(100);
    });

    $(".tb-delivaring").on("click", " .color-blue", function () {
      $("#view-delivaring").toggleClass("open-view-vindor-types");
    });

    // $(".tb-assign").on("click", " .bg-blue", function () {
    //   $("#delevary1").slideToggle(100)
    // });

    $(".delevaryman-popup .close").on("click", function () {
      $("#delevary1").slideUp(100);
    });

    $(".add-item-btn").on("click", function () {
      $(".add-prod").slideToggle(100);
    });

    $(".toggle-delevary").on("click", function () {
      $("#delevary2").slideToggle(100);
    });

    $(".toggle-delevary2").on("click", function () {
      $("#delevary3").slideToggle(100);
    });

    $("#delevary2 .close").on("click", function () {
      $("#delevary2").slideUp(100);
    });

    $("#delevary3 .close").on("click", function () {
      $("#delevary3").slideUp(100);
    });

    // for close only
    $("#view-deactive").on("click", "#close-vindors4", function () {
      $("#view-deactive").removeClass("open-view-vindor-types");
    });

    $("#close-vindors6").on("click", function () {
      $("#view-delivaring").removeClass("open-view-vindor-types");
    });

    $(".payment-area .close").on("click", function () {
      $(".payment-area").slideUp();
    });

    $(".add-prod .close").on("click", function () {
      $(".add-prod").slideUp();
    });

    // this.ordersService.getOrders(1)
    //   .subscribe((response: any) => {
    //     this.orders = response.data.orders;
    //     this.total = response.data.total;
    //   });
    this.filter$
      .debounceTime(400)
      .pipe(
        tap((e) => ((this.loading = true), (this.no_orders = false))),
        switchMap((filter) => this.filterOrders())
      )
      .subscribe((response: any) => {
        this.loading = false;

        this.orders = response.data.orders;
        this.total = response.data.total;
        if (this.orders.length == 0) {
          this.no_orders = true;
        } else {
          this.orders.forEach((element) => {
            element.select = false;
          });
        }
        console.log(this.total);
        if (this.total === 0) {
          this.p = 1;
        }
      });

    this.filter$.next(this.filter);

    this.catService.getCategories().subscribe((response: any) => {
      this.categories = response.data;
    });

    let token = this.auth.getToken();
    this.exportUrl = environment.api + "/admin/orders/export?token=" + token;
    this.productsUrl =
      environment.api + "/admin/products/export_sales?token=" + token;
    this.exportProductsUrl = this.productsUrl;

    this.deliveryService.getAllDeliverers().subscribe((response: any) => {
      this.branches = response.data;
    });

    this.products$ = concat(
      this.productsInput$.pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap(() => (this.productsLoading = true)),
        switchMap((term) =>
          this.productService.searchProductVariants({ q: term }, 1).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.productsLoading = false)),
            map((response: any) => {
              this.products = response.data.products;
              return response.data.products.map((p) => {
                return {
                  id: p.id,
                  name: p.sku + ": " + p.name,
                };
              });
            })
          )
        )
      )
    );

    this.ordersService.getAvailablePickups().subscribe((response: any) => {
      this.available_pickups = response.data;
    });
  }

  getPaymentMethods() {
    this.promoService.getPaymentMethods().subscribe((rep) => {
      if (rep.code === 200) {
        this.paymentMethods = rep.data.filter((item) => item.active == "1");
      }
    });
  }
  ClearSearch() {
    this.filter = {
      term: "",
      state_id: "",
      date_from: "",
      date_to: "",
      customer_city_ids: [],
      customer_area_ids: [],
      hide_scheduled: 1,
      ids: [],
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      shipping_id: "",
      user_agent: "",
      payment_method: null,
    };
    this.changePage(1);
  }
  setupStateForm() {
    this.stateForm = new FormGroup({
      status_notes: new FormControl(),
      pickup_guid: new FormControl(),
      cancellation_id: new FormControl(null),
      order_ids: new FormControl(this.ordersBulk),
      state_id: new FormControl(this.orderStatusId),
      sub_state_id: new FormControl(this.sub_state_id),
      pickup_date: new FormControl(new Date()),
      pickup_time: new FormControl("00:00"),
      shipping_notes: new FormControl(),
      shipping_method: new FormControl(3),
      aramex_account_number: new FormControl(1),
      branch_id: new FormControl(
        this.branches.length ? this.branches[0].id : ""
      ),
      subtract_stock: new FormControl(),
    });

    if (this.orderStatusId == 8) {
      // this.stateForm.get("pickup_date").setValidators([Validators.required]);
      // this.stateForm.get("pickup_time").setValidators([Validators.required]);
      this.stateForm.get("branch_id").setValidators([Validators.required]);
      this.stateForm
        .get("shipping_method")
        .setValidators([Validators.required]);
      this.stateForm
        .get("aramex_account_number")
        .setValidators([Validators.required]);
    } else if (this.orderStatusId == 6) {
      // this.stateForm.get("status_notes").setValidators([Validators.required]);
      this.stateForm
        .get("cancellation_id")
        .setValidators([Validators.required]);
    }
  }

  selectAll() {
    this.ordersBulk = [];
    if (this.orders.length) {
      if (!this.selectAllChecked) {
        this.orders.forEach((element) => {
          element.select = true;
          this.selectAllChecked = true;
          // this.countPickupOrder('add', element.id)
        });
      } else {
        this.orders.forEach((element) => {
          element.select = false;
          this.selectAllChecked = false;
          // this.countPickupOrder('remove', element.id)
        });
      }
    }
  }

  changeSelectBulk(order) {
    if (order.select) {
      order.select = false;
      // this.countPickupOrder('remove', order.id)
    } else {
      order.select = true;
      // this.countPickupOrder('add', order.id)
    }
  }

  removePickupId(id) {
    this.countPickupOrder("remove", id);
  }

  stateFormValid() {
    return !!this.state_id;
  }

  changeStausBulkInOrders() {
    this.enableSubmitPickupOrder = false;
    if (!this.stateFormValid()) {
      this.errorMessage = "Please select a status";
      $("#errorPopup").modal("show");
      return;
    }

    // if (this.orderSelectedPickup.length) {
    //   this.ordersBulk = this.orderSelectedPickup
    // } else {
    this.ordersBulk = this.orders
      .filter((element) => element.select)
      .map((item) => item.id);
    if (!this.ordersBulk.length) {
      this.errorMessage = "Please select at least 1 order";
      $("#errorPopup").modal("show");
      return;
    }
    // }

    console.log(this.ordersBulk);
    this.setupStateForm();
    $("#confirmOrderStatus").modal("show");
  }

  changePickupInOrders() {
    this.enableSubmitPickupOrder = false;
    if (!this.stateFormValid()) {
      this.errorMessage = "Please select a status";
      $("#errorPopup").modal("show");
      return;
    }

    if (this.orderSelectedPickup.length) {
      this.ordersBulk = this.orderSelectedPickup;
    } else {
      this.ordersBulk = this.orders
        .filter((element) => element.select)
        .map((item) => item.id);
      if (!this.ordersBulk.length) {
        this.errorMessage = "Please select at least 1 order";
        $("#errorPopup").modal("show");
        return;
      }
    }

    console.log(this.ordersBulk);
    this.setupStateForm();
    $("#confirmOrderPickup").modal("show");
  }

  confirmPickup(notifyUser) {
    console.log(this.stateForm.value);
    if (!this.stateForm.valid) {
      return this.markFormGroupTouched(this.stateForm);
    }
    let data = this.stateForm.value;
    data.pickup_date =
      moment(data.pickup_date).format("YYYY-MM-DD") + " " + data.pickup_time;
    data.shipping_method = +data.shipping_method;
    data.state_id = +data.state_id;
    data.notify_customer = this.notifyUser;
    this.stateSubmitting = true;
    this.ordersService
      .createPickup(this.orderId, data)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.status_notesText = "";
          $("#confirmOrderPickup").modal("hide");
          this.filter$.next(this.filter);
          this.orderSelectedPickup = [];
          localStorage.setItem(
            "orderPickup",
            JSON.stringify(this.orderSelectedPickup)
          );
        } else {
          this.toasterService.error(response.message, "Error");
        }
        this.stateSubmitting = false;
      });
  }

  confirmPickupOrders() {
    this.enableSubmitPickupOrder = true;
    const orderPickupIds = JSON.parse(localStorage.getItem("orderPickup"))
      ? JSON.parse(localStorage.getItem("orderPickup"))
      : [];
    if (orderPickupIds.length) {
      this.orderStatusId = "8";
      this.state_id = "8";
      this.changePickupInOrders();
    } else {
      this.toasterService.error("Please Select Orders First");
    }
  }
  countPickupOrder(type, id) {
    const orderIndexPickup = this.orderSelectedPickup.findIndex(
      (item) => item == id
    );
    if (type == "add") {
      if (orderIndexPickup == -1) {
        this.orderSelectedPickup.push(id);
      }
    } else {
      if (orderIndexPickup !== -1) {
        this.orderSelectedPickup.splice(orderIndexPickup, 1);
      }
    }
    localStorage.setItem(
      "orderPickup",
      JSON.stringify(this.orderSelectedPickup)
    );
  }

  confirmChangeStatus(notifyUser) {
    // this.error_status_notes = false

    // if (this.orderStatusId == '6') {
    //   if (this.status_notesText == '' || this.status_notesText == undefined) {
    //     console.log('if data');
    //     this.error_status_notes = true
    //     return
    //   } else {
    //     console.log('else data');
    //   }
    // }

    if (this.stateForm.get("shipping_method").value !== "3") {
      this.stateForm.get("aramex_account_number").setValidators([]);
      this.stateForm.get("aramex_account_number").updateValueAndValidity();
    } else {
      this.stateForm
        .get("aramex_account_number")
        .setValidators([Validators.required]);
      this.stateForm.get("aramex_account_number").updateValueAndValidity();
    }
    console.log(this.stateForm.value);
    if (!this.stateForm.valid) {
      return this.markFormGroupTouched(this.stateForm);
    }
    let data = this.stateForm.value;
    if (data.state_id == 8) {
      data.pickup_date =
        moment(data.pickup_date).format("YYYY-MM-DD") + " " + data.pickup_time;
      data.shipping_method = +data.shipping_method;
    }
    // if (this.orderStatusId == '6') {
    //   if (!this.status_notesText) {
    //     this.error_status_notes = true
    //     return
    //   }
    // }
    data.state_id = +data.state_id;
    data.notify_customer = this.notifyUser;
    this.stateSubmitting = true;
    this.ordersService
      .changeBulkChangeState(this.orderId, data)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.status_notesText = "";
          $("#confirmOrderStatus").modal("hide");
          this.filter$.next(this.filter);
        } else {
          this.toasterService.error(response.message, "Error");
        }

        this.stateSubmitting = false;
      });
  }

  affiliateSearch(event) {
    this.affiliateUsersLoading = true;
    const filter = {
      q: event.target.value,
      page: 1,
    };
    this.affiliateService.getUsersAffiliates(filter)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.affiliateUsers = res.data.affiliates;
        } else {
          this.toasterService.error(res.message);
        }
        this.affiliateUsers = this.affiliateUsers.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.affiliateUsersLoading = false;
      });
  }

  getOrderStates() {
    this.orderStatesService.getOrderEditableStatus().subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.orderStatus = response.data;
          // this.selectStatus(this.order.state_id);
        }
      },
    });
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

  changePage(p) {
    this.p = p;
    console.log(this.filter);

    this.filter$.next(this.filter);
  }

  filterOrders() {
    this.search = true;
    // this.p = p;
    if (this.filter.date_from) {
      this.filter.date_from = moment(this.filter.date_from).format(
        "YYYY-MM-DD"
      );
    }

    if (this.filter.date_to) {
      this.filter.date_to = moment(this.filter.date_to).format("YYYY-MM-DD");
    }
    if (
      typeof this.filter.ids === "string" ||
      this.filter.ids instanceof String
    ) {
      this.filter.ids = [this.filter.ids];
    }
    // console.log(this.serialize(this.filter));
    this.exportProductsUrl =
      this.productsUrl + "&" + this.serialize(this.filter);

    return this.ordersService.filterOrders(this.filter, this.p);
  }

  toggleProductSelect() {
    $(".add-prod").slideToggle(100);
  }

  toggleShow() {
    this.show = !this.show;
    this.hide = !this.hide;
  }

  toggleDelete() {
    if (!this.showDelete) {
      this.currentOrder.items.map((item) => {
        item.remove = false;
        return item;
      });
    }
    this.showDelete = !this.showDelete;
  }

  addProductToOrder() {
    if (this.selectedProduct) {
      let exists = this.currentOrder.items.findIndex(
        (i) => i.id == this.selectedProduct
      );

      if (exists !== -1) {
        return;
      }

      let ind = this.products.findIndex((p) => p.id == this.selectedProduct);
      if (ind !== -1) {
        let item = {
          id: this.products[ind].id,
          amount: 1,
          product: this.products[ind],
        };
        // let product = this.products[ind];
        // product.amount = 1;
        this.currentOrder.items.push(item);
        this.selectedProduct = null;
      }
    }
  }

  showAmount(order) {
    this.orders.map((item) => (item.showPayment = 0));
    this.newAmount = order.paid_amount;
    order.showPayment = 1;
  }

  updatePaidAmount(order, newAmount) {
    this.ordersService
      .updatePaidAmount(order.id, { paid_amount: newAmount })
      .subscribe((response: any) => {
        if (response.code === 200) {
          const ind = this.orders.findIndex((item) => item.id === order.id);

          if (ind !== -1) {
            this.orders[ind] = response.data;
          }
        }
      });
  }

  getDeliverers(order: any) {
    // load available
    this.orders.map((item) => (item.showPopup = 0));
    this.selectedDistrict = order.address.district_id;

    if (order.address.district) {
      this.listSearch = order.address.district.name;
    }
    this.ordersService
      .getAvailableDeliverers(order.id)
      .subscribe((response: any) => {
        console.log(response.data);
        this.availableDeliverers = response.data;
        this.availableDeliverers.map((deliverer) => {
          deliverer.deliverer_profile.district_names = deliverer.deliverer_profile.districts
            .map((d) => d.name)
            .join(", ");
        });
        console.log(this.availableDeliverers);
        this.viewFilter = "";
        this.listFilter = "";
        order.showPopup = 1;
      });

    // order.showPopup = !order.showPopup;
  }

  selectDeliverer(selectedUser) {
    this.availableDeliverers.map((user) => {
      if (user.id === selectedUser.id) {
        user.selected = 1;
      } else {
        user.selected = 0;
      }
      return user;
    });
  }

  assignDeliverer(order) {
    const deliverer = this.availableDeliverers.filter((user) => user.selected);

    if (!deliverer.length) {
      return;
    }

    this.ordersService
      .assignDeliverer(order.id, { deliverer_id: deliverer[0].id })
      .subscribe((response: any) => {
        if (response.code === 200) {
          const ind = this.orders.findIndex((item) => item.id === order.id);
          // this.orders[ind] = response.data;
          order.showPopup = false;
          order.showViewPopup = false;
          order.state_id = response.data.state_id;
        }
      });
  }

  promtCancel(order) {
    this.order = order;
  }

  cancelOrder() {
    this.ordersService.cancelOrder(this.order.id).subscribe((response: any) => {
      if (response.code === 200) {
        const ind = this.orders.findIndex((item) => item.id === this.order.id);

        if (ind !== -1) {
          this.orders[ind] = response.data;
        }

        if (this.currentOrder) {
          this.currentOrder.state_id = 6;
        }

        $("#removePopUp").modal("hide");
      }
    });
  }

  promtReturn(order) {
    this.order = order;
  }

  returnOrder() {
    this.ordersService.returnOrder(this.order.id).subscribe((response: any) => {
      if (response.code === 200) {
        const ind = this.orders.findIndex((item) => item.id === this.order.id);

        if (ind !== -1) {
          this.orders[ind] = response.data;
        }

        this.currentOrder.state_id = 7;

        $("#removePopUp3").modal("hide");
      }
    });
  }

  proceedOrder(order) {
    this.ordersService.proceedOrder(order.id).subscribe((response: any) => {
      if (response.code === 200) {
        const ind = this.orders.findIndex((item) => item.id === order.id);

        if (ind !== -1) {
          this.orders[ind] = response.data;
        }

        this.currentOrder.state_id = 1;
        this.currentOrder.deliverer = null;
      } else {
        this.toasterService.error(response.message);
      }
    });
  }

  openSideView(order) {
    this.ordersService.getOrder(order.id).subscribe((response: any) => {
      $("#view-deactive").toggleClass("open-view-vindor-types");

      this.currentOrder = response.data;
      this.currentOrder.items.forEach((element) => {
        element.quantity = element.amount;
      });
      this.selectedCategory = "";
      this.selectedSubcategory = "";
      this.product_list = [];
      $(".add-prod").hide();
    });
  }
  openSideViewReturnOrder(order) {
    this.orderSelected = order;
    this.ordersService.getOrder(order.id).subscribe((response: any) => {
      $("#view-side-bar-return-order").toggleClass("open-view-vindor-types");
      this.currentOrder = response.data;
      this.currentOrder.items.forEach((element) => {
        element.amount = element.amount - element.returned_quantity;
        element.quantity = 0;
      });
      this.selectedCategory = "";
      this.selectedSubcategory = "";
      this.product_list = [];
      $(".add-prod").hide();
    });
  }

  loadSubcategories(cat_id) {
    const index = this.categories.findIndex((item) => item.id == cat_id);
    this.sub_categories = this.categories[index].sub_categories;
  }

  loadProducts(cat_id) {
    this.loadingProductSideBar = true;
    this.product_list = [];
    this.catService.getProducts(cat_id).subscribe((response: any) => {
      console.log(response);
      console.log(this.currentOrder.items);
      if (response.code === 200) {
        this.loadingProductSideBar = false;
        this.product_list = response.data;
        this.product_list.forEach((element) => {
          const indexProduct = this.currentOrder.items.findIndex(
            (item) => item.id == element.id
          );
          if (indexProduct !== -1) {
            element.amount = this.currentOrder.items[indexProduct].amount;
            element.quantity = this.currentOrder.items[indexProduct].quantity;
          } else {
            element.amount = 0;
            element.quantity = 0;
          }
        });

        // this.product_list.map((prod) => (prod.amount = 0));
      }
    });
  }

  getDeleteCount() {
    return this.currentOrder
      ? this.currentOrder.items.filter((item) => item.remove).length
      : 0;
  }

  deleteItems() {
    const ids = this.currentOrder.items
      .filter((item) => item.remove)
      .map((item) => item.id);

    this.ordersService
      .removeItems(this.currentOrder.id, { item_ids: ids })
      .subscribe((response: any) => {
        this.currentOrder.items = response.data;
      });
  }

  addAmountOldItem(product) {
    console.log(product);
    if (product.amount < product.product.stock) {
      product.amount++;
    }
  }
  removeAmountOldItem(product) {
    console.log(product);
    product.amount > 1 ? product.amount-- : (product.amount = 1);
    // product.quantity > 0 ? product.quantity-- : (product.quantity = 0);
  }

  addAmountOldItemReturn(product) {
    console.log(product);
    if (product.quantity < product.amount) {
      product.quantity++;
    }
  }
  removeAmountOldItemReturn(product) {
    console.log(product);

    product.quantity > 1 ? product.quantity-- : (product.quantity = 0);
  }
  addAmount(product) {
    product.amount++;
    const productAmountIndex = this.currentOrder.items.findIndex(
      (item) => item.id == product.id
    );
    if (productAmountIndex !== -1) {
      this.currentOrder.items[productAmountIndex].amount = product.amount;
    } else {
      console.log(product);
      console.log(this.currentOrder.items);

      this.currentOrder.items.push({
        id: product.id,
        amount: product.amount,
        quantity: product.amount,
        order_id: null,
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
        },
      });
    }
  }
  removeAmount(product) {
    console.log(product);
    product.amount > 0 ? product.amount-- : (product.amount = 1);

    const productAmountIndex = this.currentOrder.items.findIndex(
      (item) => item.id == product.id
    );
    if (productAmountIndex !== -1) {
      if (product.amount > 0) {
        this.currentOrder.items[productAmountIndex].amount = product.amount;
        console.log("if");
      } else if (product.amount == 0) {
        this.currentOrder.items.splice(productAmountIndex, 1);
        console.log("else if ");
      }
    }
  }

  addProducts() {
    const items = this.currentOrder.items
      .filter((item) => item.amount)
      .map((item) => {
        return {
          product_id: item.id,
          amount: item.amount,
        };
      });

    if (items.length) {
      this.ordersService
        .addItems(this.currentOrder.id, { items: items })
        .subscribe((response: any) => {
          this.currentOrder.items = response.data;
        });
    }
    this.selectedCategory = "";
    this.selectedSubcategory = "";
    this.product_list = [];
    this.toggleProductSelect();
  }

  returnProducts() {
    $("#returnOrder").modal("show");
  }
  returnItemsProducts() {
    const itemReturn = this.currentOrder.items
      .filter((item) => item.retrun)
      .map((item) => {
        return {
          id: item.id,
          returned_quantity: item.quantity,
        };
      });
    console.log(itemReturn);

    if (itemReturn.length) {
      this.ordersService
        .retrunItems(this.currentOrder.id, { items: itemReturn })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#returnOrder").modal("hide");
            $("#view-side-bar-return-order").removeClass(
              "open-view-vindor-types"
            );
          }
        });
    }
    this.selectedCategory = "";
    this.selectedSubcategory = "";
    this.product_list = [];
  }
  updateProducts() {
    this.showErrorItems = "";
    this.items = this.currentOrder.items
      .filter((item) => item.amount && !item.remove)
      .map((item) => {
        if (!item.remove) {
          return {
            id: item.id,
            amount: item.amount,
          };
        }
      });
    this.deleteIds = this.currentOrder.items
      .filter((item) => item.remove)
      .map((item) => item.id);
    if (this.items.length) {
      $("#confirmOrderUpdate").modal("show");
    } else {
      this.showErrorItems = "Order must have at least one item";
    }
  }

  confirmUpdateProducts(notifyUser) {
    if (this.items.length) {
      this.ordersService
        .updateItems(this.currentOrder.id, {
          items: this.items,
          admin_notes: this.currentOrder.admin_notes,
          notes: this.currentOrder.notes,
          delivery_fees: this.currentOrder.delivery_fees,
          admin_discount: null,
          notify_customer: notifyUser,
          deleted_items: this.deleteIds,
        })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#confirmOrderUpdate").modal("hide");
            $("#view-deactive").toggleClass("open-view-vindor-types");
            this.currentOrder.items = response.data.items;

            let ind = this.orders.findIndex(
              (o) => o.id == this.currentOrder.id
            );
            if (ind !== -1) {
              this.orders[ind].amount = +response.data.amount;
              this.orders[ind].delivery_fees = +response.data.delivery_fees;
            }
          }
        });
    }
    this.selectedCategory = "";
    this.selectedSubcategory = "";
    this.product_list = [];
  }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
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
      this.ordersService
        .changeStatus(this.orderId, {
          state_id: this.orderStatuId,
          notify_customer: notifyUser,
        })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#confirmOrderStatus").modal("hide");
            const indexOrderStatus = this.orderStatus.findIndex(
              (item) => item.id == response.data.state_id
            );
            if (indexOrderStatus !== -1) {
              response.data.order_status_name =
                response.data.order_status[indexOrderStatus].name;
            }

            response.data.order_status_editable = !this.ineditableStates.includes(
              response.data.state_id
            );

            const indexOrder = this.orders.findIndex(
              (item) => item.id == response.data.id
            );
            if (indexOrder !== -1) {
              this.orders[indexOrder] = response.data;
            }
          }
        });
    } else {
      this.ordersService
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

  cancelStateChange() {
    this.currentOrder.state_id = this.currentOrder.previous_state;
  }

  openPopupAction(type, data) {
    console.log(type, data);
    if (type == 1) {
      // assign delivery
      this.getDeliverers(data);
      data.showPopup = 1;
      this.getArea(data.address.city_id);
      this.getDistrict(data.address.area_id);
    } else if (type == 2) {
      // order details
      this.router.navigate(["/pages/orders/order-details", data.id]);
    } else if (type == 3) {
      // edit order
      this.openSideView(data);
    } else if (type == 5) {
      // Return order
      this.openSideViewReturnOrder(data);
    } else if (type == 4) {
      // cancel order
      this.promtCancel(data);
      $("#removePopUp").modal("show");
    }
  }

  getCities() {
    this._areaService.getCities().subscribe((response: any) => {
      if (response.code === 200) {
        this.cities = response.data;
      }
    });
  }

  SelectDistrict(event, data) {
    console.log(event);
    console.log(data);
  }
  public getArea(area) {
    console.log(area);
    const index = this.cities.findIndex((item) => item.id == area);
    if (index !== -1) {
      if (this.cities[index].areas.length) {
        this.areaList = this.cities[index].areas;
        console.log(this.areaList, "if");
      } else {
        this.areaList = [];
        this.areaList.push(this.cities[index]);
        this.districts.push(this.cities[index]);

        console.log(this.areaList, "else");
      }
    }
    this.districts = [];
  }
  public selectCity(cityId) {
    if (cityId) {
      console.log(" cityId===>", cityId);
      this.filter.customer_city_ids = [];
      this.filter.customer_area_ids = [];

      const index = this.cities.findIndex((item) => item.id == cityId);
      if (index !== -1) {
        if (this.cities[index].areas.length) {
          this.areaListSearch = this.cities[index].areas;
          console.log(this.areaList, "if");
        } else {
          this.areaListSearch = [];
          this.areaListSearch.push(this.cities[index]);
          console.log(this.areaList, "else");
        }
      }

      this.filter.customer_city_ids = [cityId];
    } else {
      this.filter.customer_city_ids = [];
      this.areaListSearch = [];
    }
    // this.changePage(1);
  }
  selectArea(areaId) {
    if (areaId) {
      this.filter.customer_area_ids = [areaId];
    } else {
      // this.filter.customer_area_ids = [areaId]
      this.filter.customer_area_ids = [];
    }
    // this.changePage(1);
  }

  public getDistrict(district) {
    const index = this.areaList.findIndex((item) => item.id == district);
    // this.selectedDistrict = district;
    if (index !== -1) {
      if (this.areaList[index].districts.length) {
        this.districts = this.areaList[index].districts;
        console.log(this.areaList, "if");
      } else {
        this.districts = [];
        this.districts.push(this.areaList[index]);
        console.log(this.areaList, "else");
      }
    }
  }

  createOrder() {
    this.selectedOrder = null;
    // this.viewOrderSidebar = 'out';
    this.toggleAddOrder = "in";
  }

  editOrder(order) {
    this.selectedOrder = order;
    // this.viewOrderSidebar = 'out';
    this.toggleAddOrder = "in";
  }

  closeSideBar(data = null) {
    $("#view-deactive").removeClass("open-view-vindor-types");
    $("#view-side-bar-return-order").removeClass("open-view-vindor-types");
    this.selectedOrder = null;
    this.toggleAddOrder = "out";
    if (data) {
      this.filter$.next(this.filter);
    }
  }

  addToPickup(id) {
    const orderPickupIds = JSON.parse(localStorage.getItem("orderPickup"))
      ? JSON.parse(localStorage.getItem("orderPickup"))
      : [];
    if (orderPickupIds.length) {
      const orderIndexPickup = orderPickupIds.findIndex((item) => item == id);
      if (orderIndexPickup == -1) {
        orderPickupIds.push(id);
        localStorage.setItem("orderPickup", JSON.stringify(orderPickupIds));
        this.orderSelectedPickup.push(id);
        this.toasterService.success("Order Is Added");
      } else {
        this.toasterService.error("Order Is Already exists");
      }
    } else {
      localStorage.setItem("orderPickup", JSON.stringify([id]));
      this.orderSelectedPickup.push(id);
      this.toasterService.success("Order Is Added");
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
