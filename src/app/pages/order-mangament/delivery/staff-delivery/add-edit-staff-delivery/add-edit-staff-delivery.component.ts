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

@Component({
  selector: "app-add-edit-staff-delivery",
  templateUrl: "./add-edit-staff-delivery.component.html",
  styleUrls: ["./add-edit-staff-delivery.component.css"],
})
export class AddEditStaffDeliveryComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("selectProductDataEdit") selectProductDataEdit;
  OptionForm: FormGroup;
  showError: number;
  cities: any;
  areas: any;
  submitting: boolean;
  loading: boolean;
  districts: any;
  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private formbuilder: FormBuilder,
    private uploadService: UploadFilesService,
    private deliveryService: DeliveryService,
    private _areaService: AreasService
  ) {}

  ngOnInit() {
    this.getForm(this.selectProductDataEdit);
    this.getCities();
  }
  ngOnChanges(): void {
    this.getForm(this.selectProductDataEdit);
  }
  getCities() {
    this._areaService.getCities().subscribe((response: any) => {
      if (response.code === 200) {
        this.cities = response.data;
      }
    });
  }

  getForm(data) {
    this.OptionForm = this.formBuilder.group({
      name: new FormControl(data ? data.name : "", Validators.required),
      address: new FormControl(data ? data.address : "", Validators.required),
      city_id: new FormControl(
        data ? data.delivererProfile.city.id : "",
        Validators.required
      ),
      area_id: new FormControl(
        data ? data.delivererProfile.area.id : "",
        Validators.required
      ),
      // districts_id: new FormControl(
      //   data ? data.delivererProfile.districts.map((p) => p.id) : [],
      //   Validators.required
      // ),
    });
    if (data) {
      this.selectCity(data.delivererProfile.city.id);
      this.selectArea(data.delivererProfile.area.id);
    }
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    if(!this.selectProductDataEdit){
      this.OptionForm.reset();
    }
  }
  submitForm() {
    if (this.selectProductDataEdit) {
      // edit
      const data = this.OptionForm.value;

      console.log(data);
      if (!this.OptionForm.valid) {
        this.markFormGroupTouched(this.OptionForm);
        return;
      }
      this.submitting = true;

      this.deliveryService
        .updateDeliverer(this.selectProductDataEdit.id, data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.dataOptionEmit.emit(response.data);
            this.OptionForm.reset();
            this.closeSideBar();
          } else {
            this.toastrService.error(response.message);
          }
          this.submitting = false;
        });
    } else {
      // add
      const data = this.OptionForm.value;
      console.log(data);
      if (!this.OptionForm.valid) {
        this.markFormGroupTouched(this.OptionForm);
        return;
      }
      this.submitting = true;

      this.deliveryService.createDeliverer(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.OptionForm.reset();
          this.dataOptionEmit.emit(response.data);
          this.OptionForm.reset();
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

  selectCity(city_id) {
    this.districts = [];
    let index = this.cities.findIndex((item) => item.id == city_id);
    console.log(index);
    if (index !== -1) {
      this.areas = this.cities[index].areas;
      console.log(this.areas);
    }
  }
  selectArea(area_id) {
    console.log(area_id);
    let index = this.areas.findIndex((item) => item.id == area_id);
    console.log(index);

    this.districts = this.areas[index].districts;
    console.log(this.districts);
  }
}
