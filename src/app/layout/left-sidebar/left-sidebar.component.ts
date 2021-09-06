// import { environmentVariables } from './../../../environments/enviromentalVariables';
import { Component, OnInit } from '@angular/core';
import { SettingService } from '@app/pages/services/setting.service';
import { ShowAffiliateService } from '@app/pages/services/show-affiliate.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {

  affiliate: boolean;
  environmentVariables;

  constructor(private showAffiliateService: ShowAffiliateService,private settingService:SettingService) {
     this.getConfig();
    this.showAffiliateService.showAffiliate.subscribe((response: any) => {
      this.affiliate = response
    });
  }
  getConfig(){
    this.settingService.getenvConfig().subscribe(res=>{
     this.environmentVariables=res;
    })
  }

  ngOnInit() {
    $('.collapse').collapse({
      toggle: false
    })
    // $('.').collapse()

    // collapse side nav
    $(".side-nav-item").on("click", function (event) {
      $('.side-nav-item').removeClass('active');
      $(this).addClass('active');
      event.preventDefault()
    }
    );




  }

}
