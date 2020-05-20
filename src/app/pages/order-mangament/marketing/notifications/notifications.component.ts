import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@app/pages/services/notifications.service';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UploadFilesService } from '@app/pages/services/upload-files.service';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { CustomerService } from '@app/pages/services/customer.service';
import { ProductsService } from '@app/pages/services/products.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  total: any;
  p = 1;
  messages: any;
  searchTerm: string;
  notificationFor;
  selectFile = null;
  notific: any = {

  }
  notificat;
  customers: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;

  products: any = [];
  products$: Observable<any>;
  productsInput$ = new Subject<String>();
  productsLoading: boolean;
  imageViewPopup: any;

  constructor(private notificationService: NotificationsService,
    private toastrService: ToastrService, private uploadFile: UploadFilesService, private customerService: CustomerService, private productService: ProductsService
  ) { }

  ngOnInit() {


    this.notificat = new FormGroup({
      notifiName: new FormControl('', Validators.required),
      notifiContent: new FormControl('', Validators.required),
      customers: new FormControl(''),
      product_id: new FormControl(''),
      image: new FormControl('')
    });

    // manage-charges
    $("body").on("click", ".add-not-charges", function () {
      $("#add-not").toggleClass("open-view-vindor-types")
      // $(".left-sidebar").toggleClass("toggle-left-sidebar")
      // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    })

    $("#close-vindors3").on("click", function () {
      $("#add-not").removeClass("open-view-vindor-types")
    })



    $('.switch').on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    // manage-charges
    $(".owls-table").on("click", ".edit-manage-charges", function () {
      $("#manage-charges").toggleClass("open-view-vindor-types")
      // $(".left-sidebar").toggleClass("toggle-left-sidebar")
      // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    })
    $("#close-vindors4").on("click", function () {
      $("#manage-charges").removeClass("open-view-vindor-types")
    })
    this.notification();

    this.customers$ = concat(
      of([]), // default items
      this.customersInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.customersLoading = true),
        switchMap(term => this.customerService.searchCustomers(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.customersLoading = false),
          map((response: any) => {
            return response.data.customers.map(c => {
              return {
                id: c.id,
                name: c.id + ": " + c.name
              }
            })
          })
        ))
      )
    );

    this.products$ = concat(
      of([]), // default items
      this.productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.productsLoading = true),
        switchMap(term => this.productService.searchProducts({q: term}, 1).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.productsLoading = false),
          map((response: any) => {
            return response.data.products.map(p => {
              return {
                id: p.id,
                name: p.id + ": " + p.name
              }
            })
          })
        ))
      )
    );
  }

  notification() {
    this.notificationService.getNotification()
      .subscribe((response: any) => {
        this.messages = response.data.messages;
        this.total = response.data.total;
      })
  }

  addNotification(notific) {
    if (!this.notificat.valid) {
      this.markFormGroupTouched(this.notificat);
      return;
    }
    console.log(notific);
    if (!notific.customers) {
      if (confirm("You didn't specify any customers so this notification will be broadcast to everyone, are you sure you want to proceed?")) {
        this.notificationService.addNotification(notific)
          .subscribe((response: any) => {
            if (response.code == 200) {
              $("#add-not").removeClass("open-view-vindor-types")
              this.messages.unshift(response.data);
              this.notificat.reset();
              this.notific.image = "";
              this.notific.imageUrl = "";
            }
            else {
              this.toastrService.error(response.message);
            }

          })
      }
    } else {
      this.notificationService.addNotification(notific)
        .subscribe((response: any) => {
          if (response.code == 200) {
            $("#add-not").removeClass("open-view-vindor-types")
            this.messages.unshift(response.data);
            this.notificat.reset();
          }
          else {
            this.toastrService.error(response.message);
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

  onimgeSelected(notification, event) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile)
      .subscribe((response: any) => {

        if (response.body) {
          notification.image = response.body.data.name;
          notification.imageUrl = response.body.data.filePath;
        }

      });
  }

  imageView(img)
  {
    this.imageViewPopup = img;
  }

  resetForm() {
    this.notific = {}
  }
}
