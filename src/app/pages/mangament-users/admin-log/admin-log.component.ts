import { Component, OnInit } from '@angular/core';
import { AdminsService } from '@app/pages/services/admins.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-log',
  templateUrl: './admin-log.component.html',
  styleUrls: ['./admin-log.component.css']
})
export class AdminLogComponent implements OnInit {
  list: any[] = [];
  loading: boolean = false;
  itemsPerPage: number = 15;
  totalPages: number = 1;
  page: 1;
  constructor(private adminService: AdminsService, private toasterService: ToastrService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.loading = true;
    this.adminService.getLog(this.page).subscribe((res) => {
      if (res.code === 200) {
        this.list = res.data.logs;
        this.totalPages = res.data.total;
      } else {
        this.toasterService.error(res.message);
      }
      this.loading = false;
    })
  }

  loadData(page: any = null) {
    this.spinner.show();
    this.page = (page) ? page : this.page;
    this.adminService.getLog(this.page)
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.list = res.data.logs;
            this.totalPages = res.data.total;
          } else {
            this.toasterService.error(res.message);
          }
          this.spinner.hide();
        }
      );
  }

}