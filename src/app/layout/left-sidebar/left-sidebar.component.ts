import { Component, OnInit } from '@angular/core';
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
  constructor(private showAffiliateService: ShowAffiliateService) {
    this.showAffiliateService.showAffiliate.subscribe((response: any) => {
      this.affiliate = response
    });
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
