import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { ListsService } from "@app/pages/services/lists.service";
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
    private toastrService: ToastrService
  ) { }

  ngOnInit() { }
  ngOnChanges(): void { }
  closeSideBar() {
    this.closeSideBarEmit.emit();
  }

  uploadList(event) {
    const selectFile = <File>event.target.files[0];
    this.listsService
      .uploadFile(this.list.id, selectFile)
      .subscribe((response: any) => {
      });

    this.toastrService.success("File uploaded successfully");
    this.importFile.nativeElement.value = "";
  }

  export(id) {

    this.listsService
      .export(id)
      .subscribe((response: any) => {

      });

    this.toastrService.success("You’ll receive a notification when the export is ready for download.", ' Your export is now being generated ', {
      enableHtml: true,
      timeOut: 3000
    });
  }
}
