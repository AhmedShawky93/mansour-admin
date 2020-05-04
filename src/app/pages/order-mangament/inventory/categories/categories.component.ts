import { OptionsService } from "./../../../services/options.service";
import { Component, OnInit } from "@angular/core";
import { CategoryService } from "@app/pages/services/category.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { Validators } from "@angular/forms";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit {
  showSubError: number;

  categories: any;
  newCategory: any = {
    name: "",
    description: "",
    sub_categories: [],
  };

  currentCategory;
  editCat;

  inputScat = ["subCatGroup"];
  sCatnumber: any = 0;

  searchTerm;

  editCatForm: FormGroup;

  p = 1;

  // @ViewChild('categoriesForm') categoriesForm : NgForm;
  categoriesForm;
  options: any;

  constructor(
    private _CategoriesService: CategoryService,
    private uploadService: UploadFilesService,
    private toastrService: ToastrService,
    private optionsService: OptionsService
  ) {}

  ngOnInit() {
    this.getCategories();
    $(".add-category").on("click", function () {
      $("#add-cat").toggleClass("open-view-vindor-types");
    });

    $("#edit-category").on("click", function () {
      $("#edit-cat").toggleClass("open-view-vindor-types");
    });

    $(".table").on("click", ".view-c", function () {
      $("#view-category").toggleClass("open-view-vindor-types");
    });
    //   $(".btn-big add-category").on("click", function () {
    //     $("#add-cat").removeClass("open-view-vindor-types")
    //   })

    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    //      // manage-charges
    //  $(".owls-table").on("click", ".edit-manage-charges", function () {
    //   $("#manage-charges").toggleClass("open-view-vindor-types")
    //   // $(".left-sidebar").toggleClass("toggle-left-sidebar")
    //   // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    // })

    $("#close-vindors1").on("click", function () {
      $("#add-cat").removeClass("open-view-vindor-types");
    });

    $("#close-vindors2").on("click", function () {
      $("#edit-cat").removeClass("open-view-vindor-types");
    });

    $("#close-vindors3").on("click", function () {
      $("#view-category").removeClass("open-view-vindor-types");
    });

    this.categoriesForm = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.pattern(/[A-Za-z0-9\-\&\s]+$/),
      ]),
      name_ar: new FormControl("", [Validators.required]),
      image: new FormControl("", [Validators.required]),
      description: new FormControl("", Validators.required),
      description_ar: new FormControl("", Validators.required),
      order: new FormControl("", Validators.required),
      sub_categories: new FormArray(
        [],
        [Validators.minLength(1), Validators.required]
      ),
    });
    this.getOptions();
  }

  getOptions() {
    this.optionsService.getOptions({ page: 0 }).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.options = response.data;
        }
      },
    });
  }
  get sub_categories() {
    return this.categoriesForm.get("sub_categories") as FormArray;
  }

  get edit_sub_categories() {
    return this.editCatForm.get("sub_categories") as FormArray;
  }

  getCategories() {
    this._CategoriesService.getCategories().subscribe((response: any) => {
      this.categories = response.data;
      this.categories = this.categories.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
    });
  }

  createCategory(category) {
    if (!this.categoriesForm.valid) {
      this.markFormGroupTouched(this.categoriesForm);
      return;
    }

    category = this.categoriesForm.value;

    this._CategoriesService
      .createCategory(category)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.categories.push(response.data);
          $("#add-cat").toggleClass("open-view-vindor-types");
          this.showSubError = 0;
          this.categoriesForm.reset();
        } else {
          this.toastrService.error(response.message);
        }
      });
  }
  viewCategory(category) {
    this.currentCategory = JSON.parse(JSON.stringify(category));
    this.currentCategory.sub_categories.map((cat) => {
      cat.deactivated = !cat.active;
      return cat;
    });
  }

  editCategory(category) {
    this.editCat = JSON.parse(JSON.stringify(category));

    // this.editCat.sub_categories.map(cat => {
    //   cat.imageUrl = cat.image;
    //   return cat;
    // })

    // this.editCat.deleted_ids = [];

    this.editCatForm = new FormGroup({
      id: new FormControl(category.id),
      image: new FormControl(category.image, [Validators.required]),
      name: new FormControl(category.name, [
        Validators.required,
        Validators.pattern(/[A-Za-z0-9\-\&\s]+$/),
      ]),
      name_ar: new FormControl(category.name_ar, [Validators.required]),
      description: new FormControl(category.description, Validators.required),
      description_ar: new FormControl(
        category.description_ar,
        Validators.required
      ),
      order: new FormControl(category.order, Validators.required),

      sub_categories: new FormArray(
        [],
        [Validators.minLength(1), Validators.required]
      ),
    });

    this.editCat.sub_categories.forEach((item) => {
      this.edit_sub_categories.push(
        new FormGroup({
          id: new FormControl(item.id),
          name: new FormControl(item.name, Validators.required),
          name_ar: new FormControl(item.name_ar, Validators.required),
          image: new FormControl(item.image, Validators.required),
          options: new FormControl(
            item.options.map((p) => p.id)),
        })
      );
    });
  }

  updateCategory(category) {
    console.log(this.editCatForm.value);
    console.log(this.editCatForm.valid);
    if (!this.editCatForm.valid) {
      this.markFormGroupTouched(this.editCatForm);
      return;
    }

    category = this.editCatForm.value;

    this._CategoriesService
      .updateCategory(category.id, category)
      .subscribe((response: any) => {
        if (response.code) {
          $("#edit-cat").toggleClass("open-view-vindor-types");
          let category = response.data;
          category.deactivated = !category.active;

          category.sub_categories.map((cat) => {
            cat.deactivated = !cat.active;
            return cat;
          });

          this.currentCategory = category;
          let ind = this.categories.findIndex((item) => item.id == category.id);
          if (ind !== -1) {
            this.categories[ind] = category;
          }
          (this.newCategory.name = ""), (this.newCategory.description = "");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  addSubCategory(category) {
    this.sub_categories.push(
      new FormGroup({
        name: new FormControl("", Validators.required),
        name_ar: new FormControl("", Validators.required),
        image: new FormControl("", Validators.required),
        options: new FormControl([]),
      })
    );

    this.showSubError = 0;

    category.sub_categories.push({
      name: "",
      image: "",
    });
  }

  addSubCategoryEdit(category) {
    category.get("sub_categories").push(
      new FormGroup({
        name: new FormControl("", Validators.required),
        name_ar: new FormControl("", Validators.required),
        image: new FormControl("", Validators.required),
      })
    );
  }

  removeSubCategory(category, index) {
    this.sub_categories.removeAt(index);
    // if(category.id) {
    //   category.deleted_ids.push(category.sub_categories[index].id);
    // }

    // category.sub_categories.splice(index, 1);
  }

  uploadImage(image, e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      // if(file.size > 3000000) {
      //   this.showVendorSizeError = true;
      //   return
      // }else{
      //   this.showVendorSizeError = false;
      // }

      // var reader = new FileReader();

      // reader.onload = (e: any) => {
      //   category.imageUrl = e.target.result;
      // }

      // reader.readAsDataURL(e.target.files[0]);

      this.uploadService.uploadFile(file).subscribe((response: any) => {
        // this.isUploadingVendor = false;
        if (response.body) {
          image.setValue(response.body.data.filePath);
          // category.image = response.body.data.name;
          // category.imageUrl = response.body.data.filePath;
          // category.showError = 0;
        }
      });
    }
  }

  uploadImageEdit(category, e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      // if(file.size > 3000000) {
      //   this.showVendorSizeError = true;
      //   return
      // }else{
      //   this.showVendorSizeError = false;
      // }

      // var reader = new FileReader();

      // reader.onload = (e: any) => {
      //   category.imageUrl = e.target.result;
      // }

      // reader.readAsDataURL(e.target.files[0]);

      this.uploadService.uploadFile(file).subscribe((response: any) => {
        // this.isUploadingVendor = false;
        if (response.body) {
          category.image = response.body.data.name;
          category.imageUrl = response.body.data.filePath;
          category.showError = 0;
        }
      });
    }
  }

  removeImage(category) {
    category.image = "";
    category.imageUrl = "";
  }

  changeActive(category) {
    this.categories
      .filter((category) => {
        return category.showReason;
      })
      .map((category) => {
        if (category.active == category.deactivated) {
          category.active = !category.active;
        }
        category.showReason = 0;
        return category;
      });
      console.log(this.categories)
      console.log(category)
    if (category.active) {
      // currently checked
      category.showReason = 0;
      category.notes = "";
      if (category.deactivated) {
        this._CategoriesService
          .activateCategory(category.id)
          .subscribe((data: any) => {
            category.active = 1;
            category.notes = "";
            category.deactivation_notes = "";
            category.deactivated = 0;
          });
      }
    } else {
      category.notes = category.deactivation_notes;
      category.showReason = 1;
    }
  }

  cancelDeactivate(category) {
    category.active = 1;
    category.notes = "";
    category.showReason = 0;
  }

  submitDeactivate(category) {
    category.active = 0;
    this._CategoriesService
      .deactivateCategory(category.id, { deactivation_notes: category.notes })
      .subscribe((data: any) => {
        category.active = 0;
        category.deactivation_notes = category.notes;
        category.showReason = 0;
        category.deactivated = 1;
      });
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
