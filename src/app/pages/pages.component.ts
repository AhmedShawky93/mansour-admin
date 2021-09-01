import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { SettingService } from './services/setting.service';
import { ShowAffiliateService } from './services/show-affiliate.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private permissionsService: NgxPermissionsService,
    private showAffiliateService: ShowAffiliateService,
    private settingsService: SettingService,
  ) { }

  async ngOnInit() {
    // this.getAffiliate();
  }



  // getAffiliate() {
  //   this.settingsService.getSettings().subscribe((response: any) => {
  //     if (response.code === 200) {
  //       this.showAffiliateService.showAffiliate.next(response.data.enable_affiliate)
  //     }
  //   })
  // }
}
