import { Component, OnInit } from '@angular/core';
import { CustomerService } from '@app/pages/services/customer.service';
declare var jquery: any;
declare var $: any;
import { environment } from '@env/environment';
import { AuthService } from '@app/shared/auth.service';

@Component({
  selector: 'app-manage-castomer',
  templateUrl: './manage-castomer.component.html',
  styleUrls: ['./manage-castomer.component.css']
})
export class ManageCastomerComponent implements OnInit {
  show = false;
  hide = true;

  exportUrl;

  searchTerm: any;

  customers: any = [];
  total = 0;

  p = 1;

  customer;
  currentPoints: any;
  customerLoading: boolean;

  constructor(private cs: CustomerService, private auth: AuthService) { }

  ngOnInit() {


    $('.table').on('click', '.toggle-vindor-view', function () {
      $('#view-active').toggleClass('open-view-vindor-types');
      // $(".left-sidebar").toggleClass("toggle-left-sidebar")
      // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    });


    $('.toggle-view-active').on('click', function () {
      $('#view-active').toggleClass('open-view-vindor-types');
      // $(".left-sidebar").toggleClass("toggle-left-sidebar")
      // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    });


    $('.switch').on('click', '.slider', function () {
      const then = $(this).siblings('.reason-popup').slideToggle(100);
      $('.reason-popup').not(then).slideUp(50);
    });


    // for close only
    $('#close-vindors4').on('click', function () {
      $('#view-deactive').removeClass('open-view-vindor-types');
    });

    $('#close-vindors1').on('click', function () {
      $('#view-active').removeClass('open-view-vindor-types');
    });

    const token = this.auth.getToken();
    this.exportUrl = environment.api + '/admin/customers/export?token=' + token;

    this.loadCustomers();
  }

  toggleShow() {
    this.show = !this.show;
    this.hide = !this.hide;
  }

  changePage(p) {
    this.cs.getCustomers(p)
      .subscribe((data: any) => {
        this.p = p;
        this.customers = data.data.customers;
      });
  }

  loadCustomers() {
    this.cs.getCustomers(1)
      .subscribe((response: any) => {
        this.customers = response.data.customers;
        this.customers.map(user => {
          user.age = this.calculateAge(new Date(user.birthdate));
          user.deactivated = !user.active;
          return user;
        });
        this.total = response.data.total;
      });
  }

  searchCustomers(q) {
    if (!q.length) {
      this.changePage(this.p);
    }
    this.cs.searchCustomers(q)
      .subscribe((response: any) => {
        this.customers = response.data.customers;
        this.customers.map(user => {
          user.age = this.calculateAge(new Date(user.birthdate));
          user.deactivated = !user.active;
          return user;
        });
        this.p = 1;
        this.total = response.data.total;
      });
  }

  viewCustomer(customer) {
    this.customerLoading = true;
    this.cs.getCustomer(customer.id)
      .subscribe((response: any) => {
        this.customer = response.data;
        this.customerLoading = false;
      });
  }

  calculateAge(birthday) { // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  changeActive(user) {
    this.customers.filter((user) => {
      return user.showReason;
    }).map((user) => {
      if (user.active === user.deactivated) {
        user.active = !user.active;
      }
      user.showReason = 0;
      return user;
    });

    if (user.active) {
      // currently checked
      user.showReason = 0;
      user.notes = '';
      if (user.deactivated) {
        this.cs.activateCustomer(user.id)
          .subscribe((data: any) => {
            user.active = 1;
            user.deactivated = 0;
          });
      }

    } else {
      user.notes = user.deactivation_notes;
      user.showReason = 1;
    }
  }

  confirmCancelPoints(point) {
    this.currentPoints = point;
  }

  cancelPoints() {
    this.cs.cancelPoints(this.currentPoints.id)
      .subscribe((response: any) => {
        this.currentPoints = response.data;
        let ind = this.customer.points.findIndex(p => p.id == this.currentPoints.id);
        if (ind !== -1) {
          this.customer.points[ind] = this.currentPoints;
        }
      });
  }

  confirmVerifyPhone(customer) {
    this.customer = customer;
  }

  verifyPhone() {
    console.log(this.customer);
    this.cs.verifyPhone(this.customer.id)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.customer.phone_verified = response.data.phone_verified;
        }
      });
  }

  loginAsCustomer(id) {
    this.cs.getCustomerToken(id)
      .subscribe((response: any) => {
        let token = response.data;

        window.open("https://footloose.el-dokan.com/session/signin?token=" + token, "_blank");
      });
  }

  cancelDeactivate(user) {
    user.active = 1;
    user.notes = '';
    user.showReason = 0;
  }

  activateUser (user) {
    this.cs.activateCustomer(user.id)
      .subscribe((data: any) => {
        user.active = 1;
        user.deactivated = 0;

        const ind = this.customers.findIndex((customer: any) => customer.id === user.id);
        if (ind !== -1) {
          this.customers[ind].active = 1;
          this.customers[ind].deactivated = 0;
        }
      });
  }

  submitDeactivate(user) {
    user.active = 0;
    this.cs.deactivateCustomer(user.id, {deactivation_notes: user.notes})
      .subscribe((data: any) => {
        user.active = 0;
        user.deactivation_notes = user.notes;
        user.showReason = 0;
        user.deactivated = 1;
      });
  }
}
