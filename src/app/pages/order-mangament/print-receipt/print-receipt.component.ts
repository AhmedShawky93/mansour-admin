import {
  Component,
  OnInit,
} from "@angular/core";
import {
  ActivatedRoute,
  Router,
} from "@angular/router";

import { OrdersService } from "@app/pages/services/orders.service";
import { SettingService } from "@app/pages/services/setting.service";

// import { environmentVariables } from '../../../../environments/enviromentalVariables';

@Component({
  selector: "app-print-receipt",
  templateUrl: "./print-receipt.component.html",
  styleUrls: ["./print-receipt.component.css"],
})
export class PrintReceiptComponent implements OnInit {
  order: any = [
    {
      id: "",
      user: {
        name: "",
      },
    },
  ];
  loading = true;
  environmentVariables;

  item: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private orderService: OrdersService,
    private settingService: SettingService
  ) {
    this.getConfig();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      let id = params["id"];
      this.orderService.getOrderPrint(id).subscribe((response: any) => {
        this.order = response.data;
        this.loading = false;
        // setTimeout(() => {
        //   this.print();
        // }, 800);
      });
    });
  }
  print() {
    window.print();
  }
  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }
}
