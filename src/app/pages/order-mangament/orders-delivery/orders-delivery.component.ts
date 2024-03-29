import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/map";

import { Component, OnInit, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";

import { AreasService } from "@app/pages/services/areas.service";
import { CategoryService } from "@app/pages/services/category.service";
import { OrdersService } from "@app/pages/services/orders.service";
import { AuthService } from "@app/shared/auth.service";

// import { Console } from "@angular/core/src/r3_symbols";
import { OrderStatesService } from "../../services/order-states.service";
import { NgxSpinnerService } from "ngx-spinner";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-orders-delivery",
  templateUrl: "./orders-delivery.component.html",
  styleUrls: ["./orders-delivery.component.css"],
})
export class OrdersDeliveryComponent implements OnInit {
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
    hide_scheduled: 1,
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
  pickups: any = [];
  currentPickup: any;
  constructor(
    private ordersService: OrdersService,
    private catService: CategoryService,
    private toasterService: ToastrService,
    private titleService: Title,
    private auth: AuthService,
    private router: Router,
    private _areaService: AreasService,
    private orderStatesService: OrderStatesService,
    private spinner: NgxSpinnerService
  ) {
    this.titleService.setTitle("Orders");
  }

  ngOnInit() {
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
    this.spinner.show();
    this.ordersService.getOrderPickups().subscribe((response: any) => {
      this.spinner.hide();
      this.pickups = response.data;
    });
  }
  selectAll() {
    this.ordersBulk = [];
    if (this.orders.length) {
      if (!this.selectAllChecked) {
        this.orders.forEach((element) => {
          element.select = true;
          this.selectAllChecked = true;
        });
      } else {
        this.orders.forEach((element) => {
          element.select = false;
          this.selectAllChecked = false;
        });
      }
    }
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
  }

  clearDateFrom() {
    this.filter.date_from = "";
    this.changePage(1);
  }

  clearDateTo() {
    this.filter.date_to = "";
    this.changePage(1);
  }

  changePage(p) {
    this.p = p;

    // this.filterOrders(p);
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
        this.availableDeliverers = response.data;
        this.availableDeliverers.map((deliverer) => {
          deliverer.deliverer_profile.district_names =
            deliverer.deliverer_profile.districts.map((d) => d.name).join(", ");
        });
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

  promtCancel(pickup) {
    this.currentPickup = pickup;
  }

  cancelPickup() {
    this.ordersService
      .cancelPickup(this.currentPickup.id)
      .subscribe((response: any) => {
        if (response.code === 200) {
          // const ind = this.orders.findIndex((item) => item.id === this.order.id);

          // if (ind !== -1) {
          //   this.orders[ind] = response.data;
          // }
          if (this.currentOrder) {
            this.currentOrder.status = 3;
          }
          // To Hide Remove pickup
          this.currentPickup.status = 3;

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
    // if (product.quantity < product.amount) {
    product.amount++;
    // }
  }
  removeAmountOldItem(product) {
    product.amount > 1 ? product.amount-- : (product.amount = 1);
    // product.quantity > 0 ? product.quantity-- : (product.quantity = 0);
  }

  addAmountOldItemReturn(product) {
    if (product.quantity < product.amount) {
      product.quantity++;
    }
  }
  removeAmountOldItemReturn(product) {
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
    product.amount > 0 ? product.amount-- : (product.amount = 1);

    const productAmountIndex = this.currentOrder.items.findIndex(
      (item) => item.id == product.id
    );
    if (productAmountIndex !== -1) {
      if (product.amount > 0) {
        this.currentOrder.items[productAmountIndex].amount = product.amount;
      } else if (product.amount == 0) {
        this.currentOrder.items.splice(productAmountIndex, 1);
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
    this.orderStatuId = data;
    this.typeStatusPopup = type;
    $("#confirmOrderStatus").modal("show");
  }

  changeStatus(notifyUser, type) {
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

            response.data.order_status_editable =
              !this.ineditableStates.includes(response.data.state_id);

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
    if (type == 1) {
      // assign delivery
      this.getDeliverers(data);
      data.showPopup = 1;
      this.getArea(data.address.city_id);
      this.getDistrict(data.address.area_id);
    } else if (type == 2) {
      // order details
      this.router.navigate(["/pages/orders-delivery/details/", data.id]);
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

  SelectDistrict(event, data) {}
  public getArea(area) {
    const index = this.cities.findIndex((item) => item.id == area);
    if (index !== -1) {
      if (this.cities[index].areas.length) {
        this.areaList = this.cities[index].areas;
      } else {
        this.areaList = [];
        this.areaList.push(this.cities[index]);
        this.districts.push(this.cities[index]);
      }
    }
    this.districts = [];
  }
  public getDistrict(district) {
    const index = this.areaList.findIndex((item) => item.id == district);
    // this.selectedDistrict = district;
    if (index !== -1) {
      if (this.areaList[index].districts.length) {
        this.districts = this.areaList[index].districts;
      } else {
        this.districts = [];
        this.districts.push(this.areaList[index]);
      }
    }
  }
  closeSideBar() {
    $("#view-deactive").removeClass("open-view-vindor-types");
    $("#view-side-bar-return-order").removeClass("open-view-vindor-types");
  }
}
