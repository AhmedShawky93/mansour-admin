import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AffiliateService } from '@app/pages/services/affiliate.service';
import { NewAdminCreditComponent } from '../../users-history/new-admin-credit/new-admin-credit.component';
import { PopupDetailsComponent } from '../../users-history/popup-details/popup-details.component';

@Component({
  selector: 'app-affiliate-details',
  templateUrl: './affiliate-details.component.html',
  styleUrls: ['./affiliate-details.component.scss']
})
export class AffiliateDetailsComponent implements OnInit {
  statistics: any;
  walletHistoryAffiliates = [];
  total;
  pageNumber;
  filter: any = {};
  affiliate: any = {};
  nameAffiliate;
  constructor(public dialog: MatDialog, private affiliateService: AffiliateService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.filter.affiliate_id = this.activatedRoute.snapshot.params.id;
    this.affiliateDetails();
    this.getAllAffiliates();
  }


  affiliateDetails() {
    this.affiliateService.getAffiliateDetails(this.filter.affiliate_id).subscribe((response: any) => {
      console.log(response)
      this.affiliate = response.data.affiliate
    })
  }



  getAllAffiliates() {
    this.affiliateService.getAffiliatesList(this.filter).subscribe((response: any) => {
      this.walletHistoryAffiliates = response.data.wallet;
      this.statistics = response.data.statistics;
      this.total = response.data.total;
      console.log(response)
    })
  }









  openPopupNewAdminCredit() {
    const dialogRef = this.dialog.open(NewAdminCreditComponent, {
      width: '500px', data: { nameAffiliate: this.affiliate.name, id: this.affiliate.id }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.statistics = result.statistics;

      }
      this.pageNumber = 1;
      this.filter = {};
      this.filter.affiliate_id = this.activatedRoute.snapshot.params.id;
      this.getAllAffiliates();
    });
  }






  changePage(page) {
    this.pageNumber = page;
    this.getAllAffiliates();
  }
  openPopup(item) {
    const dialogRef = this.dialog.open(PopupDetailsComponent, {
      width: '500px', data: { item: item }
    });
  }
}
