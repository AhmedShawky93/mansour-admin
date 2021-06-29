import { OrderStatesService } from "./../../../services/order-states.service";
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
} from "@angular/core";

@Component({
  selector: "app-view-order-states",
  templateUrl: "./view-order-states.component.html",
  styleUrls: ["./view-order-states.component.css"],
})
export class ViewOrderStatesComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") dataView;
  constructor(private orderStatesService: OrderStatesService) {}

  ngOnInit() {}
  ngOnChanges() {
    if (this.dataView) {
      this.dataView.sub_states = this.dataView.sub_states.map((item) => {
        if (item) {
          item.deactivated = !item.active;
        }
        return item;
      });
    }
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }

  changeActive(orderState) {
    this.dataView.sub_states
      .filter((orderState) => {
        return orderState.showReason;
      })
      .map((orderState) => {
        if (orderState.active === orderState.deactivated) {
          orderState.active = !orderState.active;
        }
        orderState.showReason = 0;
        return orderState;
      });

    if (orderState.active) {
      // currently checked
      orderState.showReason = 0;
      orderState.notes = "";
      if (orderState.deactivated) {
        this.orderStatesService
          .activateOrderStatus(orderState.id)
          .subscribe((data: any) => {
            orderState.active = 1;
            orderState.notes = "";
            orderState.deactivation_notes = "";
            orderState.deactivated = 0;
          });
        this.dataEmit.emit(orderState);
      }
    } else {
      orderState.notes = orderState.deactivation_notes;
      orderState.notes = "";
      orderState.showReason = 1;
    }
  }

  cancelDeactivate(orderState) {
    orderState.active = 1;
    orderState.notes = "";
    orderState.showReason = 0;
  }

  submitDeactivate(orderState) {
    orderState.active = 0;
    this.orderStatesService
      .deactivateOrderStatus(orderState.id, {
        deactivation_notes: orderState.notes,
      })
      .subscribe((data: any) => {
        orderState.active = 0;
        orderState.deactivation_notes = orderState.notes;
        orderState.showReason = 0;
        orderState.deactivated = 1;
      });
  }
}
