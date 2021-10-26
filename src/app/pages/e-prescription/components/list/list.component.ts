import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { EPrescriptionService } from "@app/pages/e-prescription/e-prescription.service";
import { debounce } from "lodash";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
})
export class ListComponent implements OnInit {
  @ViewChild("closebutton") closebutton;
  @Input() ModifiedItem: any;
  @Output() listOperation = new EventEmitter();
  searchTerm: string;
  list: Array<any> = [];
  changeStatusData: any;
  itemsPerPage: number;
  totalPages: number;
  page: number;
  prescriptionForm: FormGroup;
  fallbackImage: string;
  stateSubmitting: boolean = false;

  constructor(
    private service: EPrescriptionService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.searchTerm = "";
    this.itemsPerPage = 20;
    this.totalPages = 0;
    this.page = 1;
    this.fallbackImage = "/assets/img/placeholder70.png";
    this.search = debounce(this.loadData, 700);
  }

  ngOnInit() {
    this.createForm();
    this.loadData();
  }

  search() {}

  createForm() {
    this.prescriptionForm = this.formBuilder.group({
      invoice_id: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      comment: new FormControl("", [Validators.required]),
      cancel_reason: new FormControl("", [Validators.required]),
    });
  }

  formControlValidator(controlName, err) {
    if (
      this.prescriptionForm.controls[controlName].touched &&
      this.prescriptionForm.controls[controlName].dirty
    ) {
      if (this.prescriptionForm.controls[controlName].errors) {
        return this.prescriptionForm.controls[controlName].errors[err];
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  loadData(page: any = null) {
    this.page = page ? page : this.page;
    this.service
      .getPrescriptions(this.searchTerm, this.page)
      .subscribe((res) => {
        this.list = res["data"]["prescriptions"];
        this.totalPages = res["data"]["total"];
      });
  }

  view(item: any) {
    this.listOperation.emit({ operation: "view", data: item });
  }

  setStatusData(item, status) {
    this.updateValidator(status);
    this.changeStatusData = {
      item: item,
      status: {
        id: status,
        value:
          status === 2 ? "Process" : status === 3 ? "Delivered" : "Canceled",
      },
    };
  }

  updateValidator(status) {
    if (status === 2) {
      this.prescriptionForm
        .get("invoice_id")
        .setValidators([Validators.required]);
      this.prescriptionForm.get("amount").setValidators([Validators.required]);
      this.prescriptionForm.get("comment").setValidators([Validators.required]);
      this.prescriptionForm.get("cancel_reason").setValidators([]);
    } else if (status === 4) {
      this.prescriptionForm
        .get("cancel_reason")
        .setValidators([Validators.required]);
      this.prescriptionForm.get("invoice_id").setValidators([]);
      this.prescriptionForm.get("amount").setValidators([]);
      this.prescriptionForm.get("comment").setValidators([]);
    } else {
      this.prescriptionForm.get("cancel_reason").setValidators([]);
      this.prescriptionForm.get("invoice_id").setValidators([]);
      this.prescriptionForm.get("amount").setValidators([]);
      this.prescriptionForm.get("comment").setValidators([]);
    }
    this.prescriptionForm.get("invoice_id").updateValueAndValidity();
    this.prescriptionForm.get("amount").updateValueAndValidity();
    this.prescriptionForm.get("comment").updateValueAndValidity();
    this.prescriptionForm.get("cancel_reason").updateValueAndValidity();
  }
  changeStatus() {
    const data = {
      ...this.prescriptionForm.value,
      status: this.changeStatusData.status.id,
    };
    data.amount = data.amount ? Number(data.amount) : 0;
    this.stateSubmitting = true;
    this.service
      .changeStatus(this.changeStatusData.item.id, data)
      .subscribe((res) => {
        if (res["code"] === 200) {
          this.updateTable(res["data"]);
          this.stateSubmitting = false;
          this.prescriptionForm.reset();
        } else {
          this.close();
          this.stateSubmitting = false;
        }
      });
  }

  onSave() {
    if (!this.prescriptionForm.valid) {
      this.markFormGroupTouched(this.prescriptionForm);
      return false;
    } else {
      this.changeStatus();
    }
  }

  close() {
    this.closebutton.nativeElement.click();
  }

  updateTable(item) {
    const itemIndex = this.list.findIndex((obj) => obj.id === item.id);
    if (itemIndex !== -1) {
      this.list.splice(itemIndex, 1, item);
    }
    this.close();
  }
  setFallbackImage(event, item) {
    if (event.target) {
      event.target.src = this.fallbackImage;
      item.images[0] = this.fallbackImage;
    }
  }

  export() {
    this.service.export().subscribe((response: any) => {});
    const msgOptions = {
      message:
        "You’ll receive a notification when the export is ready for download.",
      title: "Your export is now being generated",
      options: {
        enableHtml: true,
        timeOut: 3000,
      },
    };
    this.toastrService.success(
      msgOptions.message,
      msgOptions.title,
      msgOptions.options
    );
  }
}
