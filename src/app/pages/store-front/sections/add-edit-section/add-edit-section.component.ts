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
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { SectionsService } from "@app/pages/services/sections.service";
import { ListsService } from "@app/pages/services/lists.service";

@Component({
  selector: "app-add-edit-section",
  templateUrl: "./add-edit-section.component.html",
  styleUrls: ["./add-edit-section.component.css"],
})
export class AddEditSectionComponent implements OnInit, OnChanges {

  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("sectionData") sectionData;
  sectionForm: FormGroup;
  showError: number;
  lists = [];
  values: FormArray;
  imageTypes: any[] = [{ id: 1, name: "No image" }, { id: 2, name: "Single image" }, { id: 3, name: "Multi images" }]

  public zoom: number = 12;
  brands: any;
  imageUrl: any;
  submitting: boolean;
  loading: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private sectionsService: SectionsService,
    private listService: ListsService
  ) { }

  ngOnInit() {
    console.log("initializing")
    this.listService.getLists({})
      .subscribe((response: any) => {
        this.lists = response.data;
      });
    this.getForm(this.sectionData);
  }
  ngOnChanges(): void {
    console.log(this.sectionData);
    this.getForm(this.sectionData);
  }

  getForm(data) {
    this.sectionForm = this.formBuilder.group({
      name_en: new FormControl(data ? data.name_en : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      description_en: new FormControl(data ? data.description_en : "", Validators.required),
      description_ar: new FormControl(data ? data.description_ar : "", Validators.required),
      type: new FormControl(data ? data.type : 0, [Validators.required]),
      list_id: new FormControl(data ? data.list_id : null, [Validators.required]),
      order: new FormControl(data ? data.order : "", Validators.required),
      active: new FormControl(data ? data.active : 1),
      image_type: new FormControl(data ? data.image_type : 1, Validators.required),
      images: new FormArray([])
    });
    if (this.sectionForm.value.image_type == 2){
      (this.sectionForm.get('images') as FormArray).push(new FormGroup({
        image_en: new FormControl(data && data.images.length > 0 ? data.images[0].image_en : '', Validators.required),
        image_ar: new FormControl(data && data.images.length > 0 ? data.images[0].image_ar : ''),
        link_en: new FormControl(data && data.images.length > 0 ? data.images[0].link_en : ''),
        id: new FormControl(data ? data.images[0].id : null)
      }))
    } else if (this.sectionForm.value.image_type == 3){
      for (let index = 0; index < 5; index++) {
        (this.sectionForm.get('images') as FormArray).push(new FormGroup({
          image_en: new FormControl(data && data.images && data.images[index] ? data.images[index].image_en : '', Validators.required),
          image_ar: new FormControl(data && data.images && data.images[index] ? data.images[index].image_ar : ''),
          link_en: new FormControl(data && data.images && data.images[index] ? data.images[index].link_en : ''),
          id: new FormControl(data ? data.images[index].id : null)
        }))
      }
    }
  }
  get imagesList() { return <FormArray>this.sectionForm.get('images') }

  resetForm() {
    this.sectionForm = this.formBuilder.group({
      name_en: new FormControl(this.sectionForm.value ? this.sectionForm.value.name_en : "", Validators.required),
      name_ar: new FormControl(this.sectionForm.value ? this.sectionForm.value.name_ar : "", Validators.required),
      description_en: new FormControl(this.sectionForm.value ? this.sectionForm.value.description_en : "", Validators.required),
      description_ar: new FormControl(this.sectionForm.value ? this.sectionForm.value.description_ar : "", Validators.required),
      type: new FormControl(this.sectionForm.value ? this.sectionForm.value.type : 0, [Validators.required]),
      list_id: new FormControl(this.sectionForm.value ? this.sectionForm.value.list_id : null, [Validators.required]),
      order: new FormControl(this.sectionForm.value ? this.sectionForm.value.order : "", Validators.required),
      active: new FormControl(this.sectionForm.value ? this.sectionForm.value.active : 1),
      image_type: new FormControl(this.sectionForm.value ? this.sectionForm.value.image_type : 1, Validators.required),
      images: new FormArray([])
    });
    if (this.sectionForm.value.image_type == 2) {
      (this.sectionForm.get('images') as FormArray).push(new FormGroup({
        id: new FormControl(this.sectionData && this.sectionData.images.length > 0 ? this.sectionData.images[0].id : null),
        image_en: new FormControl(this.sectionData && this.sectionData.images[0] ? this.sectionData.images[0].image_en : "", Validators.required),
        image_ar: new FormControl(this.sectionData && this.sectionData.images[0] ? this.sectionData.images[0].image_ar : ""),
        link_en: new FormControl(this.sectionData && this.sectionData.images[0] ? this.sectionData.images[0].link_en : "")
      }))
    } else if (this.sectionForm.value.image_type == 3) {
      for (let index = 0; index < 5; index++) {
        (this.sectionForm.get('images') as FormArray).push(new FormGroup({
          id: new FormControl(this.sectionData && this.sectionData.images && this.sectionData.images[index] ? this.sectionData.images[index].id : null),
          image_en: new FormControl(this.sectionData && this.sectionData.images[index] ? this.sectionData.images[index].image_en : "", Validators.required),
          image_ar: new FormControl(this.sectionData && this.sectionData.images[index] ? this.sectionData.images[index].image_ar : ""),
          link_en: new FormControl(this.sectionData && this.sectionData.images[index] ? this.sectionData.images[index].link_en : "")
        }))
      }
    }
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    this.sectionForm.reset();
  }

  submitForm() {

    if (this.sectionData) {
      // edit
      const data = this.sectionForm.value;

      console.log(data);
      if (!this.sectionForm.valid) {
        this.markFormGroupTouched(this.sectionForm);
        return;
      }
      this.submitting = true;

      this.sectionsService
        .editSection(this.sectionData.id, data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.dataOptionEmit.emit(response.data);
            this.imageUrl = "";
            this.sectionForm.reset();
            this.closeSideBar();
          } else {
            this.toastrService.error(response.message);
          }
          this.submitting = false;
        });
    } else {
      // add
      const data = this.sectionForm.value;
      console.log(data);
      if (!this.sectionForm.valid) {
        this.markFormGroupTouched(this.sectionForm);
        return;
      }
      this.submitting = true;

      this.sectionsService.createSection(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.sectionForm.reset();
          this.dataOptionEmit.emit(response.data);
          this.imageUrl = "";
          this.sectionForm.reset();
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
      control.markAsDirty();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  formControlValidator(controlName, err) {
    if (this.sectionForm.controls[controlName].touched && this.sectionForm.controls[controlName].dirty) {
      if (this.sectionForm.controls[controlName].errors) {
        return this.sectionForm.controls[controlName].errors[err];
      }
    }
  }
  formArrayControlValidator(formGroup, controlName, err) {
    if (formGroup.controls[controlName].invalid && (formGroup.controls[controlName].touched || formGroup.controls[controlName].dirty)) {
      if (formGroup.controls[controlName].errors) {
        return formGroup.controls[controlName].errors[err];
      }
    }
  }
}
