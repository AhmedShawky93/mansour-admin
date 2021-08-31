import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ImportsService } from "../services/imports.service";
import "rxjs/Rx";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "@env/environment";
import { AuthService } from "@app/shared/auth.service";
import * as moment from "moment";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-imports",
  templateUrl: "./imports.component.html",
  styleUrls: ["./imports.component.scss"],
})
export class ImportsComponent implements OnInit {
  step1: boolean;
  type: string;
  total: number;
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

  constructor(
    private importsService: ImportsService,
    private auth: AuthService
  ) {
    this.step1 = false;
    this.type = "2";
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.importsService
      .getImports(this.filter.page, this.filter)
      .subscribe((result: any) => {
        this.imports = result.data.items;
        this.total = result.data.total;
        this.loading = false;
      });
  }

 

  changePage(p) {
    this.p = p;
    this.filter$.next(this.filter);
  }

  openNewImport() {
    this.step1 = true;
    this.type = "0";
    $("#newImport").modal("show");

    this.importForm = new FormGroup({
      type: new FormControl("", Validators.required),
      file: new FormControl("", [Validators.required]),
      fileSource: new FormControl("", [Validators.required]),
    });
  }

  closePopup() {
    $("#newImport").modal("hide");
  }

  generateLink() {
    this.downloadLink =
      environment.api +
      "/admin/files/import/templates?type=" +
      this.importForm.get("type").value +
      "&token=" +
      this.auth.getToken();
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
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.importForm.patchValue({
        fileSource: file,
      });
    }
  }

  importFile() {
    if (!this.importForm.valid) {
      this.markFormGroupTouched(this.importForm);
      return;
    }

    const formData = new FormData();
    formData.append("file", this.importForm.get("fileSource").value);
    formData.append("type", this.importForm.get("type").value);

    this.importsService.import(formData).subscribe((response: any) => {
      console.log(response);
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
}
