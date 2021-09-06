import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@app/pages/services/orders.service';
import { SettingService } from '@app/pages/services/setting.service';
// import { environmentVariables } from '../../../../environments/enviromentalVariables';

@Component({
  selector: 'app-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.css']
})
export class PrintReceiptComponent implements OnInit {
  order: any = [
    {
      id: '',
      user: {
        name: ''
      }

    }

  ];
  environmentVariables;

  item: any;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private orderService: OrdersService,private settingService:SettingService) { 
    this.getConfig();
  }

  ngOnInit() {

    this.activeRoute.params.subscribe((params) => {
      let id = params['id'];

      this.orderService.getOrderPrint(id)
        .subscribe((response: any) => {
          this.order = response.data;
          setTimeout(() => {
            window.print()
          }, 800);
        })
    });
  }
  getConfig(){
    this.settingService.getenvConfig().subscribe(res=>{
     this.environmentVariables=res;
    })
  }
}
