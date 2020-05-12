import { AreasService } from "@app/pages/services/areas.service";
import { Router } from "@angular/router";
import { Console } from "@angular/core/src/console";
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
import { Subject } from "rxjs";
import { tap, switchMap } from "rxjs/operators";
import { AuthService } from "@app/shared/auth.service";
import { environment } from "@env/environment";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
})
export class OrdersComponent implements OnInit {
  loading: boolean;
  date: any;
  selectedSubcategory: string;
  selectedCategory: string;
  search: boolean;
  firstTime: boolean = true;
  no_orders: boolean = false;
  listFilter: string;
  viewFilter: string;
  @ViewChild("mdate", { read: MatInput }) input: MatInput;

  showDelete: any;
  show = false;
  hide = true;

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
  orderStatus: any;
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
  constructor(
    private ordersService: OrdersService,
    private catService: CategoryService,
    private toasterService: ToastrService,
    private titleService: Title,
    private auth: AuthService,
    private router: Router,
    private _areaService: AreasService,
    private orderStatesService: OrderStatesService
  ) {
    this.titleService.setTitle("Orders");
  }

  ngOnInit() {
    this.getCities();
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
        }
        console.log(this.total);
        if (this.total === 0) {
          this.p = 1;
        }
        // this.orders.forEach((element, index) => {
        //   element.order_status = this.orderStatus;
        //   this.selectStatus(element.state_id, element, index);
        //   const indexOrderStatus = element.order_status.findIndex(
        //     (item) => item.id == element.state_id
        //   );
        //   if (indexOrderStatus !== -1) {
        //     element.order_status_name =
        //       element.order_status[indexOrderStatus].name;
        //     element.order_status_editable = !this.ineditableStates.includes(
        //       element.state_id
        //     );
        //   }
        //   console.log(element);
        // });
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
    console.log(this.filter);

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
        element.quantity = 1;
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
    // if (product.quantity < product.amount) {
    product.amount++;
    // console.log(product, "if");
    // }
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
      console.log(product, "if");
    }
  }
  removeAmountOldItemReturn(product) {
    console.log(product);

    product.quantity > 1 ? product.quantity-- : (product.quantity = 1);
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
  updateProducts() {
    $("#confirmOrderUpdate").modal("show");
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
          amount: item.quantity,
        };
      });
    console.log(itemReturn);

    if (itemReturn.length) {
      this.ordersService
        .retrunItems(this.currentOrder.id, { items: itemReturn })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#returnOrder").modal("hide");
          }
        });
    }
    this.selectedCategory = "";
    this.selectedSubcategory = "";
    this.product_list = [];
  }
  confirmUpdateProducts(notifyUser) {
    console.log(this.currentOrder.items);

    const items = this.currentOrder.items
      .filter((item) => item.amount && !item.remove )
      .map((item) => {
        if (!item.remove) {
          return {
            id: item.id,
            amount: item.amount,
          };
        }
      });
    const deleteIds = this.currentOrder.items
      .filter((item) => item.remove)
      .map((item) => item.id);


    console.log(items);
    console.log(deleteIds);
    if (items.length) {
      this.ordersService
        .updateItems(this.currentOrder.id, {
          items: items,
          notes: this.currentOrder.notes,
          delivery_fees: this.currentOrder.delivery_fees,
          admin_discount: null,
          notify_customer: notifyUser,
          deleted_items: deleteIds,
        })
        .subscribe((response: any) => {
          if (response.code === 200) {
            $("#confirmOrderUpdate").modal("hide");
            this.currentOrder.items = response.data.items;
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
  closeSideBar() {
    $("#view-deactive").removeClass("open-view-vindor-types");
    $("#view-side-bar-return-order").removeClass("open-view-vindor-types");
  }
}
