import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { AffiliateService } from '@app/pages/services/affiliate.service';

@Component({
  selector: 'app-new-admin-credit',
  templateUrl: './new-admin-credit.component.html',
  styleUrls: ['./new-admin-credit.component.scss']
})
export class NewAdminCreditComponent implements OnInit {
  newAdminCredit: FormGroup;
  stateSubmitting: boolean = false;
  affiliate;
  affiliatesLoading: boolean;
  affiliatesInput$ = new Subject<String>();
  affiliates$: Observable<any>;
  adminCredit: any = {};
  constructor(public dialogRef: MatDialogRef<NewAdminCreditComponent>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private affiliateService: AffiliateService,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    console.log(this.data)
    this.setForm();
    this.getAllAffiliates();
    if (this.data) {
      this.newAdminCredit.get('affiliate').setValue(this.data.nameAffiliate);

    }
  }



  getAllAffiliates() {
    this.affiliates$ = concat(
      of([]), // default items
      this.affiliatesInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.affiliatesLoading = true),
        switchMap(term => this.affiliateService.getAllAffiliate(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.affiliatesLoading = false),
          map((response: any) => {
            console.log(response)
            return response.data.affiliates.map(c => {
              return {
                id: c.id,
                name: c.id + ": " + c.name
              }
            })
          })
        ))
      )
    );
  }



  setForm() {
    this.newAdminCredit = this.formBuilder.group({
      affiliate: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      comment: new FormControl(''),
    })
  }


  addAdminCredit() {
    if (this.data.id) {
      this.adminCredit.affiliate_id = this.data.id;
    } else {
      this.adminCredit.affiliate_id = this.affiliate;
    }
    this.adminCredit.amount = this.newAdminCredit.get('amount').value;
    this.adminCredit.admin_comment = this.newAdminCredit.get('comment').value;

    if (!this.newAdminCredit.valid) {
      this.markFormGroupTouched(this.newAdminCredit);
      return;
    }
    else {
      this.stateSubmitting = true;
      this.affiliateService.addAdminCredit(this.adminCredit)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.dialogRef.close(response.code);
            this.toastr.success(response.message);
            this.stateSubmitting = false;
          }
          else {
            this.toastr.error(response.message);
            this.stateSubmitting = false;
          }

        })
    }
  }



  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
