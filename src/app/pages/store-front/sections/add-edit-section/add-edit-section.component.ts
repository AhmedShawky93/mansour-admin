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
  ) {}

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
    });
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

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
