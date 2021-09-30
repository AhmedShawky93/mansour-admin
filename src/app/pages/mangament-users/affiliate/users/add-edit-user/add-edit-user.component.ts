import { CustomerService } from './../../../../services/customer.service';
import { AreasService } from "./../../../../services/areas.service";
import { OptionsService } from "./../../../../services/options.service";
import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import {
  Validators,
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CategoryService } from "@app/pages/services/category.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { DeliveryService } from "@app/pages/services/delivery.service";
import { AffiliateService } from '@app/pages/services/affiliate.service';
import { SettingService } from '@app/pages/services/setting.service';

@Component({
  selector: "app-add-edit-user",
  templateUrl: "./add-edit-user.component.html",
  styleUrls: ["./add-edit-user.component.css"],
})
export class AddEditUserComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataCustomerEmit = new EventEmitter();
  @Input('selectedCustomer') selectedCustomer;
  customerForm: FormGroup;
  environmentVariables: any;

  constructor(private customerService: CustomerService, private toastrService: ToastrService,
    private affiliateService: AffiliateService, private settingService: SettingService) { }

  ngOnInit() {
    this.setupForm(this.selectedCustomer);
    this.getConfig();
  }

  getConfig() {
    this.settingService.getenvConfig().subscribe(res => {
      this.environmentVariables = res;
      this.customerForm.controls.phone.setValidators(
        [
          Validators.required,
          Validators.minLength(this.environmentVariables.localization.phone_length),
          Validators.maxLength(this.environmentVariables.localization.phone_length),
          Validators.pattern(this.environmentVariables.localization.phone_pattern)
        ]
      )
      this.customerForm.controls.phone.updateValueAndValidity()

    })
  }

  ngOnChanges() {
    this.setupForm(this.selectedCustomer);
  }

  setupForm(data) {
    this.customerForm = new FormGroup({
      name: new FormControl(data ? data.name : '', Validators.required),
      last_name: new FormControl(data ? data.last_name : '', Validators.required),
      email: new FormControl(data ? data.email : '', [Validators.required, Validators.email]),
      phone: new FormControl(data ? data.phone : '', Validators.required),
      password: new FormControl('', this.selectedCustomer ? [] : Validators.required),
      closed_payment_methods: new FormControl(data ? data.closed_payment_methods.map(c => c.id) : []),
    });
  }

  submitCustomer() {
    if (!this.customerForm.valid) {
      console.log("INVALID FORM");
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    let customer = this.customerForm.value;
    console.log(customer);
    if (this.selectedCustomer) {
      this.affiliateService.updateAffiliate(this.selectedCustomer.id, customer)
        .subscribe((response: any) => {
          console.log(response);
          if (response.code == 200) {
            this.closeSideBar(response.data);
          } else {
            this.toastrService.error(response.message, "Error");
          }
        });
    } else {
      this.affiliateService.createAffiliate(customer)
        .subscribe((response: any) => {
          console.log(response);
          if (response.code == 200) {
            this.closeSideBar(response.data);
          } else {
            this.toastrService.error(response.message, "Error");
          }
        });
    }
  }

  closeSideBar(data = null) {
    this.closeSideBarEmit.emit(data);
    this.customerForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  formControlValidator(formGroup, controlName, err) {
    if (formGroup.controls[controlName].invalid && (formGroup.controls[controlName].touched || formGroup.controls[controlName].dirty)) {
      if (formGroup.controls[controlName].errors) {
        return formGroup.controls[controlName].errors[err];
      }
    }
  }

}
