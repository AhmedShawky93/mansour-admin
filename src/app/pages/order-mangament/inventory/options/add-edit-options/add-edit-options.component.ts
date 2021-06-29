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

@Component({
  selector: "app-add-edit-options",
  templateUrl: "./add-edit-options.component.html",
  styleUrls: ["./add-edit-options.component.css"],
})
export class AddEditoOptionsComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("selectProductDataEdit") selectProductDataEdit;
  OptionForm: FormGroup;
  showError: number;
  cities: any;
  areas: any;
  cite_id: "";
  lat = 29.9745037;
  lng = 31.279899;
  marker_lat;
  marker_lng;
  values: FormArray;

  public zoom: number = 12;
  brands: any;
  imageUrl: any;
  submitting: boolean;
  loading: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private formbuilder: FormBuilder,
    private uploadService: UploadFilesService,
    private optionsService: OptionsService
  ) { }

  ngOnInit() {
    this.getForm(this.selectProductDataEdit);
  }
  ngOnChanges(): void {
    this.getForm(this.selectProductDataEdit);
  }

  getForm(data) {
    this.OptionForm = this.formBuilder.group({
      name_en: new FormControl(data ? data.name_en : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      description_en: new FormControl(data ? data.description_en : "", []),
      description_ar: new FormControl(data ? data.description_ar : "", []),
      appear_in_search: new FormControl(data ? data.appear_in_search : false),
      type: new FormControl(data ? data.type : "1", [Validators.required]),
      values: this.formBuilder.array([],[Validators.minLength(1)]),
    });
    if (data) {
      data.values.forEach((element) => {
        this.addValueForm(element);
      });
    }
  }

  addValueForm(data): void {
    this.values = this.OptionForm.get("values") as FormArray;
    this.values.push(this.createItem(data));
  }
  createItem(data): FormGroup {
    return this.formbuilder.group({
      id: new FormControl(data ? data.id : ""),
      name_en: new FormControl(data ? data.name_en : ""),
      name_ar: new FormControl(data ? data.name_ar : ""),
      color_code: new FormControl(data ? data.color_code : ""),
      image: new FormControl(data ? data.image : ""),

    });
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
    if (!this.selectProductDataEdit) {
      this.OptionForm.reset();

    }
  }
  submitForm() {

    if (this.selectProductDataEdit) {
      // edit
      const data = this.OptionForm.value;
      if (this.imageUrl) {
        this.OptionForm.get("image").clearValidators();
        this.OptionForm.get("image").updateValueAndValidity();
      }
      if (!this.OptionForm.valid) {
        this.markFormGroupTouched(this.OptionForm);
        return;
      }
      this.submitting = true;

      this.optionsService
        .editOptions(this.selectProductDataEdit.id, data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.dataOptionEmit.emit(response.data);
            this.imageUrl = "";
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
      if (!this.OptionForm.valid) {
        this.markFormGroupTouched(this.OptionForm);
        return;
      }
      this.submitting = true;

      this.optionsService.createOption(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.OptionForm.reset();
          this.dataOptionEmit.emit(response.data);
          this.imageUrl = "";
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

  onimgeSelected(event) {
    if (event.target.value) {
      this.loading = true;
      const selectFile = <File>event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.imageUrl = reader.result;
      };
      this.uploadFile.uploadFile(selectFile).subscribe((response: any) => {
        if (response.body) {
          this.imageUrl = response.body.data.filePath;
          // this.addProductForm.get("image").setValue(this.imageUrl);
          this.showError = 0;
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    }
  }

  removeValueForm(index) {
    this.values.removeAt(index);
  }

  uploadImage(e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.uploadService.uploadFile(file).subscribe((response: any) => {
        // this.isUploadingVendor = false;
        if (response.body) {
          // image.setValue(response.body.data.filePath);
          // category.image = response.body.data.name;
          // category.imageUrl = response.body.data.filePath;
          // category.showError = 0;
        }
      });
    }
  }
}
