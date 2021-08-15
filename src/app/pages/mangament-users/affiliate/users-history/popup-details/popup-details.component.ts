import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-details',
  templateUrl: './popup-details.component.html',
  styleUrls: ['./popup-details.component.scss']
})
export class PopupDetailsComponent implements OnInit {
  affiliateDetails;
  constructor(public dialogRef: MatDialogRef<PopupDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.affiliateDetails = this.data.item;
    console.log(this.data)
  }


  closePopup(){
    this.dialogRef.close();
  }

}
