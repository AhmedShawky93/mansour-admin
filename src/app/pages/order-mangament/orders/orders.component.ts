import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdersService } from '@app/pages/services/orders.service';
import { CategoryService } from '@app/pages/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MatInput } from '@angular/material';

import * as moment from 'moment';

import {Title} from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '@app/shared/auth.service';
import { environment } from '@env/environment';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  loading: boolean;
  date: any;
  selectedSubcategory: string;
  selectedCategory: string;
  search: boolean;
  listFilter: string;
  viewFilter: string;
  @ViewChild('mdate', { read: MatInput }) input: MatInput;

  showDelete: any;
  show = false;
  hide = true;

  orders: any[] = [];

  categories: any[];
  sub_categories: any[];

  order: any;

  currentOrder: any;

  availableDeliverers: any[];

  product_list: any[];

  filter = {
    term: '',
    state_id: '',
    date_from: '',
    date_to: '',
    hide_scheduled: 1
  };

  p = 1;

  newAmount;

  searchTerm = '';

  total: number = 0;

  filter$ = new Subject;
  exportUrl: string;
  exportProductsUrl: string;
  productsUrl: string;

  constructor(private ordersService: OrdersService,
     private catService: CategoryService, private toasterService: ToastrService, private titleService: Title, private auth: AuthService) {
    this.titleService.setTitle('Orders');
  }

  ngOnInit() {




    $('.payment-open').on('click', function () {
      $('.payment-area').slideToggle(100);
    });


    $('.tb-processing').on('click', '.color-yellow', function () {
      $('#view-deactive').toggleClass('open-view-vindor-types');
    });

    $('.tb-processing').on('click', '.color-purple', function () {
      $('#view-deactive').toggleClass('open-view-vindor-types');
    });

    $('.tb-assign').on('click', ' .bg-blue', function () {
      $('#delevary1').slideToggle(100);
    });

    $('.tb-delivaring').on('click', ' .color-blue', function () {
      $('#view-delivaring').toggleClass('open-view-vindor-types');
    });


    // $(".tb-assign").on("click", " .bg-blue", function () {
    //   $("#delevary1").slideToggle(100)
    // });

    $('.delevaryman-popup .close').on('click', function () {
      $('#delevary1').slideUp(100);
    });

    $('.add-item-btn').on('click', function () {
      $('.add-prod').slideToggle(100);
    });

    $('.toggle-delevary').on('click', function () {
      $('#delevary2').slideToggle(100);
    });


    $('.toggle-delevary2').on('click', function () {
      $('#delevary3').slideToggle(100);
    });


    $('#delevary2 .close').on('click', function () {
      $('#delevary2').slideUp(100);
    });


    $('#delevary3 .close').on('click', function () {
      $('#delevary3').slideUp(100);
    });

    // for close only
    $('#view-deactive').on('click', '#close-vindors4', function () {
      $('#view-deactive').removeClass('open-view-vindor-types');
    });

    $('#close-vindors6').on('click', function () {
      $('#view-delivaring').removeClass('open-view-vindor-types');
    });

    $('.payment-area .close').on('click', function () {
      $('.payment-area').slideUp();
    });


    $('.add-prod .close').on('click', function () {
      $('.add-prod').slideUp();
    });

    // this.ordersService.getOrders(1)
    //   .subscribe((response: any) => {
    //     this.orders = response.data.orders;
    //     this.total = response.data.total;
    //   });

    this.filter$.debounceTime(400)
      .pipe(tap(e => this.loading = true))
      .switchMap(filter => this.filterOrders())
      .subscribe((response: any) => {
        this.loading = false;
        this.orders = response.data.orders;
        this.total = response.data.total;
        console.log(this.total)
        if (this.total === 0) {
          this.p = 1;
        }
      });

    this.filter$.next(this.filter);

    this.catService.getCategories()
      .subscribe((response: any) => {
        this.categories = response.data;
      });

    let token = this.auth.getToken();
    this.exportUrl = environment.api + "/admin/orders/export?token=" + token;
    this.productsUrl = environment.api + "/admin/products/export_sales?token=" + token;
    this.exportProductsUrl = this.productsUrl;
  }

  clearDateFrom() {
    this.filter.date_from = '';
    this.changePage(1);
  }

  clearDateTo() {
    this.filter.date_to = '';
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
      this.filter.date_from = moment(this.filter.date_from).format('YYYY-MM-DD');
    }

    if (this.filter.date_to) {
      this.filter.date_to = moment(this.filter.date_to).format('YYYY-MM-DD');
    }
    // console.log(this.serialize(this.filter));
    this.exportProductsUrl = this.productsUrl + "&" + this.serialize(this.filter);

    return this.ordersService.filterOrders(this.filter, this.p);
  }

  toggleProductSelect() {
    $('.add-prod').slideToggle(100);
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
    this.orders.map(item => item.showPayment = 0);
    this.newAmount = order.paid_amount;
    order.showPayment = 1;
  }

  updatePaidAmount(order, newAmount) {
    this.ordersService.updatePaidAmount(order.id, { paid_amount: newAmount })
      .subscribe((response: any) => {
        if (response.code === 200) {
          const ind = this.orders.findIndex(item => item.id === order.id);

          if (ind !== -1) {
            this.orders[ind] = response.data;
          }
        }
      });
  }

  getDeliverers(order: any) {
    // load available
    this.orders.map(item => item.showPopup = 0);
    this.ordersService.getAvailableDeliverers(order.id)
      .subscribe((response: any) => {
        this.availableDeliverers = response.data;
        this.viewFilter = '';
        this.listFilter = '';
      });

    // order.showPopup = !order.showPopup;
  }

  selectDeliverer(selectedUser) {
    this.availableDeliverers.map(user => {
      if (user.id === selectedUser.id) {
        user.selected = 1;
      } else {
        user.selected = 0;
      }
      return user;
    });
  }

  assignDeliverer(order) {
    const deliverer = this.availableDeliverers.filter(user => user.selected);

    if (!deliverer.length) {
      return;
    }


    this.ordersService.assignDeliverer(order.id, { deliverer_id: deliverer[0].id })
      .subscribe((response: any) => {

        if (response.code === 200) {
          const ind = this.orders.findIndex(item => item.id === order.id);

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
    this.ordersService.cancelOrder(this.order.id)
      .subscribe((response: any) => {

        if (response.code === 200) {
          const ind = this.orders.findIndex(item => item.id === this.order.id);

          if (ind !== -1) {
            this.orders[ind] = response.data;
          }

          if (this.currentOrder) {
            this.currentOrder.state_id = 6;
          }

          $('#removePopUp').modal('hide');
        }
      });
  }

  promtReturn(order) {
    this.order = order;
  }

  returnOrder() {
    this.ordersService.returnOrder(this.order.id)
      .subscribe((response: any) => {

        if (response.code === 200) {
          const ind = this.orders.findIndex(item => item.id === this.order.id);

          if (ind !== -1) {
            this.orders[ind] = response.data;
          }

          this.currentOrder.state_id = 7;

          $('#removePopUp3').modal('hide');
        }
      });
  }

  proceedOrder(order) {
    this.ordersService.proceedOrder(order.id)
      .subscribe((response: any) => {

        if (response.code === 200) {
          const ind = this.orders.findIndex(item => item.id === order.id);

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
    this.ordersService.getOrder(order.id)
      .subscribe((response: any) => {
        $('#view-deactive').toggleClass('open-view-vindor-types');
        this.currentOrder = response.data;
        this.selectedCategory = '';
        this.selectedSubcategory = '';
        this.product_list = [];
        $('.add-prod').hide();
      });
  }

  loadSubcategories(cat_id) {
    const index = this.categories.findIndex(item => item.id == cat_id);

    this.sub_categories = this.categories[index].sub_categories;

  }

  loadProducts(cat_id) {
    this.catService.getProducts(cat_id)
      .subscribe((response: any) => {
        this.product_list = response.data;
        this.product_list.map(prod => prod.amount = 0);
      });

  }

  getDeleteCount() {
    return this.currentOrder ? this.currentOrder.items.filter((item) => item.remove).length : 0;
  }

  deleteItems() {
    const ids = this.currentOrder.items.filter((item) => item.remove).map(item => item.id);

    this.ordersService.removeItems(this.currentOrder.id, { item_ids: ids })
      .subscribe((response: any) => {
        this.currentOrder.items = response.data;
      });
  }

  addAmount(product) {
    product.amount++;
  }

  removeAmount(product) {
    product.amount > 0 ? product.amount-- : product.amount = 0;
  }

  addProducts() {
    const items = this.product_list.filter(item => item.amount).map((item) => {
      return {
        product_id: item.id,
        amount: item.amount
      };
    });

    if (items.length) {
      this.ordersService.addItems(this.currentOrder.id, { items: items })
        .subscribe((response: any) => {
          this.currentOrder.items = response.data;
        });
    }

    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.product_list = [];
    this.toggleProductSelect();

  }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
}
