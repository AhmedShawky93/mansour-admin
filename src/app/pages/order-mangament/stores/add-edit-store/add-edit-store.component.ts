import { BracnhesStoreService } from './../../../services/stores.service';
import { AreasService } from './../../../services/areas.service';
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
import { SettingService } from '@app/pages/services/setting.service';
// import { environmentVariables } from '../../../../../environments/enviromentalVariables';

@Component({
  selector: "app-add-edit-store",
  templateUrl: "./add-edit-store.component.html",
  styleUrls: ["./add-edit-store.component.scss"],
})
export class AddEditStoreComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("selectProductDataEdit") selectProductDataEdit;
  addSubImages: FormArray;
  OptionForm: FormGroup;
  showError: number;
  cities: any;
  areas: any;
  submitting: boolean;
  loading: boolean;
  districts: any;
  lat = 29.9745037;
  lng = 31.279899;
  marker_lat;
  marker_lng;
  phones: FormArray
  public zoom: number = 12;
  // environmentVariables;
  branchTypes=[];
  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private formbuilder: FormBuilder,
    private bracnhesStoreService: BracnhesStoreService,
    private settingService:SettingService
  ) { 
    this.getTypes();
    // this.getConfig();
  }
  // getConfig(){
  //   this.settingService.getenvConfig().subscribe(res=>{
  //    this.environmentVariables=res;
  //   })
  // }
  getTypes(){
    this.settingService.get_branch_types().subscribe((res:any)=>{
      this.branchTypes=res.data;
    })
  }
  
  ngOnInit() {
    this.getForm(this.selectProductDataEdit);
  }
  
  ngOnChanges(): void {
    this.getForm(this.selectProductDataEdit);
  }

  getForm(data) {
    this.OptionForm = this.formBuilder.group({
      shop_name: new FormControl(data ? data.shop_name : "", Validators.required),
      shop_name_ar: new FormControl(data ? data.shop_name_ar : "", Validators.required),
      address: new FormControl(data ? data.address : "", Validators.required),
      address_ar: new FormControl(data ? data.address_ar : "", Validators.required),
      area: new FormControl(data ? data.area : "", Validators.required),
      area_ar: new FormControl(data ? data.area_ar : "", Validators.required),
      lat: new FormControl(data ? parseFloat(data.lat) : "", Validators.required),
      lng: new FormControl(data ? parseFloat(data.lng) : "", Validators.required),
      phones: this.formBuilder.array([]),
      direction_link: new FormControl(data ? data.direction_link : "", Validators.required),
      order: new FormControl(data ? data.order : "", Validators.required),
      type: new FormControl(data ? data.type : "", Validators.required),
      images: this.formBuilder.array([]),
    });
    if (!data) {
      this.addPhoneForm(null)
    } else {
      if (data.phone.length) {
        data.phone.forEach(element => {
          this.addPhoneForm(element)
        });
      }
      if (data && data.images.length){
        data.images.forEach(element => {
          this.addImage(element)
        });
      }
      this.lat = parseFloat(data.lat)
      this.lng = parseFloat(data.lng)
    }

  }

  formGroupControlsValidator(formGroup, controlName, err) {
    if (formGroup.touched) {
      if (formGroup["controls"] && formGroup["controls"][controlName] && formGroup["controls"][controlName]["errors"]) {
        return formGroup["controls"][controlName]["errors"][err];
      }
    }
  }

  addImage(data: any = null) {
    this.addSubImages = this.OptionForm.get('images') as FormArray;
    this.addSubImages.push(this.createImageFormControl(data));
  }

  createImageFormControl(data): FormGroup {
    return this.formBuilder.group({
      url: new FormControl(data ? data.url : '', Validators.required),
    });
    
  }

  removeImage(index) {
    this.addSubImages = this.OptionForm.get('images') as FormArray;
    this.addSubImages.removeAt(index);
    this.OptionForm.updateValueAndValidity();
  }


  addPhoneForm(data?): void {
    this.phones = this.OptionForm.get("phones") as FormArray;
    this.phones.push(this.createItem(data));
  }
  createItem(data): FormGroup {
    return this.formbuilder.group({
      phone: new FormControl(data ? data : ""),
    });
  }
  reomvePhoneForm(index) {
    this.phones.removeAt(index)
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    if (!this.selectProductDataEdit) {
      this.OptionForm.reset();
    }
  }
  submitForm() {
    const data = this.OptionForm.value;
    data.phones = data.phones.map(item => {
      return item.phone
    });
    delete data.phones
    if (this.selectProductDataEdit) {  // edit

      delete data.phones
      if (!this.OptionForm.valid) {
        this.markFormGroupTouched(this.OptionForm);
        return;
      }
      this.submitting = true;
      data.email = '.'
      this.bracnhesStoreService
        .updateBranch(this.selectProductDataEdit.id, data)
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
    } else {   // add

      if (!this.OptionForm.valid) {
        this.markFormGroupTouched(this.OptionForm);
        return;
      }
      this.submitting = true;
      data.email = '.'

      this.bracnhesStoreService.createBranch(data).subscribe((response: any) => {
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

  public markerDragEnd(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;

    this.OptionForm.get('lng').setValue(this.lng)
    this.OptionForm.get('lat').setValue(this.lat)
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  setOnMap() {
    if (this.OptionForm.get('lat').invalid && this.OptionForm.get('lng').invalid) {
      this.OptionForm.get('lat').markAsTouched()
      this.OptionForm.get('lng').markAsTouched()
    } else {
      this.lat = parseFloat(this.OptionForm.get('lat').value);
      this.lng = parseFloat(this.OptionForm.get('lng').value);
    }
  }


}
