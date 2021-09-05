import { CustomerService } from './../../../../services/customer.service';
import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: "app-view-user.",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.css"],
})
export class ViewUserComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() verifyPhoneUserEmit = new EventEmitter();
  @Output() addOrUpdateAddressEmit = new EventEmitter();
  @Input("selectProductDataEdit") dataView;
  constructor(private cs: CustomerService,
  ) { }

  ngOnInit() {
    console.log('this.dataView' , this.dataView)
  }
  ngOnChanges(): void {
    console.log('this.dataView' , this.dataView)
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }
  verifyPhoneUser(data) {
    this.verifyPhoneUserEmit.emit(data);
  }
  addOrUpdateAddress(data, selectaddress, type) {
    data.new_address = type;
    data.select_address = selectaddress;
    this.addOrUpdateAddressEmit.emit(data);
  }

  loginAsCustomer(id) {
    this.cs.getCustomerToken(id)
      .subscribe((response: any) => {
        const token = response.data;
        console.log('CustomerTokenFromAdmin:', token);
        window.open(environment.website_url + "/session/signin?token=" + token, "_blank");
      });
  }

  activateUser(user) {
    this.cs.activateCustomer(user.id)
      .subscribe((data: any) => {
        user.active = 1;
        user.deactivated = 0;
        // const ind = this.customers.findIndex((customer: any) => customer.id === user.id);
        // if (ind !== -1) {
        //   this.customers[ind].active = 1;
        //   this.customers[ind].deactivated = 0;
        // }
      });
  }
}
