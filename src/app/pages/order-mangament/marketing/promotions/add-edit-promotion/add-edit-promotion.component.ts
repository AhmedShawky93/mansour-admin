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
import { PromotionsService } from "@app/pages/services/promotions.service";
import { BrandsService } from "@app/pages/services/brands.service";

@Component({
  selector: "app-add-edit-promotion",
  templateUrl: "./add-edit-promotion.component.html",
  styleUrls: ["./add-edit-promotion.component.css"],
})
export class AddEditPromotionComponent implements OnInit, OnChanges {

  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("promotionData") promotionData;
  promotionForm: FormGroup;
  showError: number;
  brands = [];
  values: FormArray;
  today: Date = new Date();

  imageUrl: any;
  submitting: boolean;
  loading: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private promotionService: PromotionsService,
    private brandsService: BrandsService
  ) {}

  ngOnInit() {
    console.log("initializing")
    this.brandsService.getBrands()
      .subscribe((response: any) => {
        this.brands = response.data;
      });
    this.getForm(this.promotionData);
  }
  ngOnChanges(): void {
    console.log(this.promotionData);
    this.getForm(this.promotionData);
  }

  getForm(data) {
    this.promotionForm = this.formBuilder.group({
      name: new FormControl(data ? data.name : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      brand_id: new FormControl(data ? data.brand_id : "", Validators.required),
      discount: new FormControl(data ? data.discount : "", [Validators.required, Validators.max(100), Validators.min(0)]),
      expiration_date: new FormControl(data ? data.expiration_date : "", [Validators.required]),
    });
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    this.promotionForm.reset();
  }

  submitForm() {

    if (this.promotionData) {
      // edit
      const data = this.promotionForm.value;

      console.log(data);
      if (!this.promotionForm.valid) {
        this.markFormGroupTouched(this.promotionForm);
        return;
      }
      this.submitting = true;

      this.promotionService
        .editPromotion(this.promotionData.id, data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.dataOptionEmit.emit(response.data);
            this.imageUrl = "";
            this.promotionForm.reset();
            this.closeSideBar();
          } else {
            this.toastrService.error(response.message);
          }
          this.submitting = false;
        });
    } else {
      // add
      const data = this.promotionForm.value;
      console.log(data);
      if (!this.promotionForm.valid) {
        this.markFormGroupTouched(this.promotionForm);
        return;
      }
      this.submitting = true;

      this.promotionService.createPromotion(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.promotionForm.reset();
          this.dataOptionEmit.emit(response.data);
          this.imageUrl = "";
          this.promotionForm.reset();
          this.closeSideBar();
        } else {
          this.toastrService.error(response.message);
        }
        this.submitting = false;
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
