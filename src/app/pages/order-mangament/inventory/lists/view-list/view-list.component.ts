import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { ListsService } from "@app/pages/services/lists.service";
import { ProductsService } from "@app/pages/services/products.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-view-list",
  templateUrl: "./view-list.component.html",
  styleUrls: ["./view-list.component.css"],
})
export class ViewListComponent implements OnInit {
  @ViewChild("myInput") importFile: ElementRef;

  @Output() closeSideBarEmit = new EventEmitter();
  @Input("listData") list;
  constructor(
    private listsService: ListsService,
    private toastrService: ToastrService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {}
  ngOnChanges(): void {}
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }

  // uploadList(event) {
  //   const selectFile = <File>event.target.files[0];
  //   this.listsService
  //     .uploadFile(this.list.id, selectFile)
  //     .subscribe((response: any) => {});

  //   this.toastrService.success("File uploaded successfully");
  //   this.importFile.nativeElement.value = "";
  // }

  uploadList(event) {
    let fileName = <File>event.target.files[0];
    this.productsService
      .importList(fileName, "7", this.list.id)
      .subscribe((response: any) => {
        console.log(response);
        if (response.code == 200) {
          this.toastrService.success("File uploaded successfully");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  export(id) {
    this.listsService.export(id).subscribe((response: any) => {});

    this.toastrService.success(
      "You’ll receive a notification when the export is ready for download.",
      " Your export is now being generated ",
      {
        enableHtml: true,
        timeOut: 3000,
      }
    );
  }
}
