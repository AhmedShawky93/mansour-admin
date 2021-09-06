import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ImportsService } from "../services/imports.service";
import "rxjs/Rx";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "@env/environment";
import { AuthService } from "@app/shared/auth.service";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ListsService } from "../services/lists.service";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-imports",
  templateUrl: "./imports.component.html",
  styleUrls: ["./imports.component.scss"],
})
export class ImportsComponent implements OnInit {
  step1: boolean;
  loadingSpinner: boolean;
  buttonSpinner: boolean;
  type: string;
  total: number;
  totalCount: number;
  fileName: any;
  lists = [];
  result: any;
  p = 1;
  filter$ = new Subject();
  filter: any = {
    type: "",
    state: "",
    date_from: "",
    date_to: "",
    page: 1,
  };
  imports: any = [
    // {
    //   id: 1,
    //   type: null,
    //   user: {
    //     name: "test",
    //   },
    //   progressVal: "40",
    // },
  ];
  loading: boolean = false;
  importForm: FormGroup;
  downloadLink = "";
  showMSG: boolean;
  messageError:string = '';
  reports = [];
  constructor(
    private importsService: ImportsService,
    private auth: AuthService,
    private toastrService: ToastrService,
    private listsService: ListsService
  ) {
    this.step1 = false;
    this.type = "2";
    this.showMSG = false;
    this.buttonSpinner = false;
  }

  ngOnInit() {
    this.getData();
    this.getLists();
  }

  getData() {
    this.loadingSpinner = true;
    this.importsService
      .getImports(this.filter.page, this.filter)
      .subscribe((result: any) => {
        this.imports = result.data.items;
        this.total = result.data.total;
        this.loadingSpinner = false;
      });
  }

  getLists() {
    this.listsService.getLists({}).subscribe((response: any) => {
      this.lists = response.data;
    });
  }

  changePage(p) {
    this.p = p;
    this.filter$.next(this.filter);
  }

  openNewImport() {
    this.step1 = true;
    this.type = "0";
    this.showMSG = false;
    $("#newImport").modal("show");

    this.importForm = new FormGroup({
      type: new FormControl("", Validators.required),
      file: new FormControl("", Validators.required),
      fileSource: new FormControl("", Validators.required),
      list_id: new FormControl(""),
    });
  }



  generateLink() {
    this.downloadLink =
      environment.api + "/api" +
      "/admin/files/import/templates?type=" +
      this.importForm.get("type").value +
      "&token=" +
      this.auth.getToken();
    if (this.importForm.get("type").value == "7") {
      this.importForm.get("list_id").setValidators(Validators.required);
      this.importForm.get("list_id").updateValueAndValidity();
    } else {
      this.importForm.get("list_id").clearValidators();
      this.importForm.get("list_id").updateValueAndValidity();
    }
  }

  // downloadTemplate() {
  //   this.importsService.downloadTemplate(this.importForm.get('type').value)
  //     .subscribe((data: Response) => this.downloadFile(data))
  // }

  // downloadFile(data: Response) {
  //   const blob = new Blob([data], { type: 'text/csv' });
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }

  onFileChange(event) {
    this.fileName = event.target.files[0];
    if (event.target.files.length > 0) {
      this.importForm.patchValue({
        fileSource: this.fileName,
      });
    }
  }

  validationForm() {
    if (!this.importForm.valid) {
      this.markFormGroupTouched(this.importForm);
      return;
    }
    this.buttonSpinner = true;
    const formData = new FormData();
    formData.append("file", this.importForm.get("fileSource").value);
    formData.append("type", this.importForm.get("type").value);
    if (this.importForm.get("type").value == "7") {
      formData.append("list_id", this.importForm.get("list_id").value);
    }
    this.importsService.fileValidation(formData).subscribe((response: any) => {
      console.log(response);
      if (response.code === 200) {
        this.step1 = false;
        this.type = this.importForm.get("type").value;
        this.result = response.data.first_row;
        this.totalCount = response.data.total_rows_count;
        this.buttonSpinner = false;
      } else {
        this.showMSG = true;
        this.buttonSpinner = false;
        this.messageError = response.errors.errorMessage.join(' - ')
      }
    });
  }

  submitImport() {
    this.buttonSpinner = true;
    const formData = new FormData();
    formData.append("file", this.importForm.get("fileSource").value);
    formData.append("type", this.importForm.get("type").value);
    if (this.importForm.get("type").value == "7") {
      formData.append("list_id", this.importForm.get("list_id").value);
    }
    
    this.importsService.import(formData).subscribe((response: any) => {
      console.log(response);
      if (response.code === 200) {
        this.closePopup();
        this.p = 1;
        this.filter.page = 1;
        this.getData();
        this.buttonSpinner = false;
      } else {
        this.toastrService.error(response.message);
        this.buttonSpinner = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object)
      .values(formGroup.controls)
      .forEach((control: FormGroup, ind) => {
        control.markAsTouched();
        control.markAsDirty();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
  }

  backStep() {
    this.step1 = true;
    this.type = "0";
  }

  filterImports(e, typeImport) {
    this.getFilterData(e, typeImport);
    this.getData();
  }

  getFilterData(e, typeImport) {
    switch (typeImport) {
      case "type":
        this.filter.type = e;
        break;
      case "type":
        this.filter.state = e;
        break;
      case "dateFrom":
        this.filter.date_from = moment(this.filter.date_from).format(
          "YYYY-MM-DD"
        );
        break;
      case "dateTo":
        this.filter.date_to = moment(this.filter.date_to).format("YYYY-MM-DD");
        break;
      default:
      // code block
    }
  }

  pagination(page) {
    this.p = page;
    this.filter.page = page;
    this.getData();
  }

  showItem(item) {
    console.log(item);
  }

  reportPopup(item) {
    this.reports = [];
    $("#repoort").modal("show");
    for (const property in item.report) {
      this.reports.push({
        name: property.split("_").join(" ").toUpperCase(),
        value: item.report[property],
      });
    }
  }

  retryImport(id) {
    this.importsService.retry(id).subscribe((response: any) => {
      console.log(response);
      if (response.code === 200) {
        this.toastrService.success(response.message);
        this.p = 1;
        this.filter.page = 1;
        this.getData();
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  cancelImport(id) {
    this.importsService
      .cancel({ history_id: id })
      .subscribe((response: any) => {
        console.log(response);
        if (response.code === 200) {
          this.toastrService.success(response.message);
          this.p = 1;
          this.filter.page = 1;
          this.getData();
        } else {
          this.toastrService.error(response.message);
        }
      });
  }



  closePopup() {
    $("#newImport").modal("hide");
  }

  closeReportPopup() {
    $("#repoort").modal("hide");
  }
}
