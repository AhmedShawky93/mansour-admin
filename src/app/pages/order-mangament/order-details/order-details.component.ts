import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@app/pages/services/orders.service';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})


export class OrderDetailsComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isOptional = false;

  order;

  processing = false;
  delivering = false;
  cancelled = false;
  delivered = false;
  returned = false;

  constructor(private _formBuilder: FormBuilder, private router: Router,
    private activeRoute: ActivatedRoute, private orderService: OrdersService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });

    this.activeRoute.params.subscribe((params) => {
      let id = params['id'];

      this.orderService.getOrder(id)
        .subscribe((response: any) => {
          this.order = response.data;

          this.order.history.map(state => {
            state.name = this.getStateName(state.state_id);
            state.image = this.getStateImage(state.state_id);
            return state;
          });


          const lastCreatedIndex = this.order.history.reduce((a, v, i) => {
            if (v.state_id == 1) {
              a = i;
            }

            return a;
          })
          let stepsArray = this.order.history.slice(lastCreatedIndex);


          this.processing = this.hasState(stepsArray, 2);
          this.cancelled = this.hasState(stepsArray, 6);
          this.delivering = this.hasState(stepsArray, 3);
          this.delivered = this.hasState(stepsArray, 4);
          this.returned = this.hasState(stepsArray, 7);
        });
    });
  }

  getStateName(id) {
    switch (id) {
      case 1:
        return 'Created'
      case 2:
        return 'Processing'
      case 3:
        return 'On Delivery'
      case 4:
        return 'Delivered'
      case 5:
        return 'Investigating'
      case 6:
        return 'Cancelled'
      case 7:
        return 'Returned'
      case 8:
        return 'Prepared'
      case 9:
        return 'Not Paid'

      default:
        break;
    }
  }

  getStateImage(id) {
    switch (id) {
      case 6:
      case 7:
        return 'assets/img/unavailable.svg';
      case 5:
        return 'assets/img/med.svg'

      default:
        return 'assets/img/available.svg';
    }
  }

  hasState(stepsArray, state_id) {
    const ind = stepsArray.findIndex(item => item.state_id === state_id);

    return ind !== -1;
  }

}
