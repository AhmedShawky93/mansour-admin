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
import { Observable, Subject, concat, of } from "rxjs";
import {
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";
import { ProductsService } from "@app/pages/services/products.service";
import { ListsService } from "@app/pages/services/lists.service";

@Component({
  selector: "app-add-edit-list",
  templateUrl: "./add-edit-list.component.html",
  styleUrls: ["./add-edit-list.component.css"],
})
export class AddEditListComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("listData") listData;
  listForm: FormGroup;
  showError: number;
  values: FormArray;

  brands: any;
  imageUrl: any;
  submitting: boolean;
  loading: boolean;

  products: any = [];
  products$: Observable<any>;
  productsInput$ = new Subject<String>();
  productsLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private formbuilder: FormBuilder,
    private uploadService: UploadFilesService,
    private listsService: ListsService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.getForm(this.listData);
  }
  ngOnChanges(): void {
    this.getForm(this.listData);
  }

  getForm(data) {
    this.listForm = this.formBuilder.group({
      name_en: new FormControl(data ? data.name_en : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      description_en: new FormControl(
        data ? data.description_en : "",
        Validators.required
      ),
      description_ar: new FormControl(
        data ? data.description_ar : "",
        Validators.required
      ),
      image_en: new FormControl(data ? data.image_en : ""),
      image_ar: new FormControl(data ? data.image_ar : ""),
      type: new FormControl(data ? data.type : "1", [Validators.required]),
      list_method: new FormControl(0, [Validators.required]),
      status: new FormControl(1),
      items: new FormControl([]),
    });
    let products = [];
    if (data && data.id) {
      let items = data.products.map((p) => p.id);
      this.listForm.get("items").setValue(items);
      products = data.products;
    }else{
      let items = []
      this.listForm.get("items").setValue(items);
    }

    this.products$ = concat(
      of(products), // default items
      this.productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.productsLoading = true)),
        switchMap((term) =>
          this.productService.searchProducts({ q: term }, 1).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.productsLoading = false)),
            map((response: any) => {
              return response.data.products.map((p) => {
                return {
                  id: p.id,
                  name: p.sku + ": " + p.name,
                };
              });
            })
          )
        )
      )
    );
  }

  addValueForm(data): void {
    this.values = this.listForm.get("values") as FormArray;
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
    if (!this.listData) {
      this.listForm.reset();
    }
  }
  submitForm() {
    if (this.listData) {
      const data = this.listForm.value;

      if (!this.listForm.valid) {
        this.markFormGroupTouched(this.listForm);
        return;
      }
      this.submitting = true;
      data.items = [
        {
          type: 4,
          items: data.items,
        },
      ];

      this.listsService
        .editList(this.listData.id, data)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.dataOptionEmit.emit(response.data);
            this.imageUrl = "";
            this.listForm.reset();
            this.closeSideBar();
          } else {
            this.toastrService.error(response.message);
          }
          this.submitting = false;
        });
    } else {
      // add
      const data = this.listForm.value;

      if (!this.listForm.valid) {
        this.markFormGroupTouched(this.listForm);
        return;
      }
      this.submitting = true;

      data.items = [
        {
          type: 4,
          items: data.items,
        },
      ];
      this.listsService.createList(data).subscribe((response: any) => {
        if (response.code == 200) {
          this.listForm.reset();
          this.dataOptionEmit.emit(response.data);
          this.imageUrl = "";
          this.listForm.reset();
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
