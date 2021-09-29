import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounce} from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {OrdersService} from '@app/pages/services/orders.service';
import {TransactionsService} from '@app/pages/order-mangament/transactions/transactions.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('closeModalButton') closeModalButton;
  @Input() ModifiedItem: any;
  @Output() listOperation = new EventEmitter();
  selectedItem: any;
  list: Array<any> = [];
  itemsPerPage: number;
  totalPages: number;
  page: number;
  filter: any;
  showModal: boolean;


  constructor(
    private service: TransactionsService,
    private orderService: OrdersService,
    private toasterService: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.itemsPerPage = 20;
    this.totalPages = 0;
    this.page = 1;
    this.filter = {
      q: '',
      page: 1,
      date_from: '',
      date_to: '',
      status: ''
    };
    this.search = debounce(this.loadData, 700);
  }

  ngOnInit() {
    this.loadData();
  }

  search() {
  }

  loadData(page: any = null) {
    this.spinner.show();
    this.filter.page = (page) ? page : this.filter.page;
    this.service.getTransactions(this.filter)
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.list = res.data.transactions;
            this.totalPages = res.data.total;
          } else {
            this.toasterService.error(res.message);
          }
          this.spinner.hide();
        }
      );
  }

  updateTable(item) {
    this.selectedItem.order_id = item.id;
    /*const itemIndex = this.list.findIndex(obj => obj.id === item.id);
    if (itemIndex !== -1) {
      this.list.splice(itemIndex, 1, item);
    }*/
    this.closeModal();
  }

  closeModal() {
    this.closeModalButton.nativeElement.click();
    this.showModal = false;
  }

  createOrderConfirmation(data) {
    this.selectedItem = data;
    this.showModal = true;
  }

  createOrder() {
    this.service.createOrder(this.selectedItem.id)
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.updateTable(res.data);
            this.toasterService.success('Order Created Successfully');
          } else {
            this.toasterService.error(res.message);
          }
          this.closeModal();
        }
      );
  }

  export() {
    this.service.export(this.filter)
      .subscribe(() => {
        const msgOptions = {
          message: 'You’ll receive a notification when the export is ready for download.',
          title: 'Your export is now being generated',
          options: {
            enableHtml: true,
            timeOut: 3000
          }
        };
        this.toasterService.success(msgOptions.message, msgOptions.title, msgOptions.options);
    });

  }

  goToDetails(item) {
    this.router.navigate(['/pages/orders/order-details', item.order.id]);
  }

  setDateFilters(data , key) {
    this.filter[key] = moment(data).format('YYYY-MM-DD');
    this.loadData();
  }
}
