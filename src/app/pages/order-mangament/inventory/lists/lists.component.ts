import "rxjs/Rx";

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

import { ListsService } from "@app/pages/services/lists.service";
declare var $: any;
@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d(0px, 0, 0)",
        })
      ),
      state(
        "out",
        style({
          transform: "translate3d(-100%, 0, 0)",
        })
      ),
      transition("in => out", animate("300ms ease-in-out")),
      transition("out => in", animate("300ms ease-in-out")),
    ]),
  ],
})
export class ListsComponent implements OnInit {
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  searchTerm;
  selectedUserIds: number[];
  clinics = [];
  q = 1;

  categories: any;
  searchForm: FormGroup;
  total = 0;
  p = 1;
  searchObj = {
    page: 1,
    q: "",
  };
  toggleListForm: string = "out";
  viewOptionSidebar: string = "out";
  selectOptionData: any;
  selectOptionDataView: any;
  loading: boolean;
  productIsEmpty: boolean;
  lists = [];
  currentList: any;
  statedeleting: boolean;
  constructor(
    private toastrService: ToastrService,
    private listsService: ListsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getLists();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });
  }

  getLists() {
    this.spinner.show();
    this.productIsEmpty = false;

    this.listsService.getLists(this.searchObj).subscribe((response: any) => {
      if (response.code === 200) {
        this.lists = response.data;
        this.total = this.lists.length;
        this.spinner.hide();
        this.lists.map((list) => {
          list.deactivated = !list.active;
          return list;
        });
      }

      // if (response.data.length == 0) {
      //   this.productIsEmpty = true;
      // }
    });
  }
  removeList(list) {
    this.currentList = list;
    $("#deleteList").modal("show");
  }
  confirmDelete() {
    this.statedeleting = true;
    this.listsService
      .softDeleteList(this.currentList.id)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.statedeleting = false;
          this.toastrService.success("List Deleted Successfully", "Success", {
            enableHtml: true,
            timeOut: 3000,
          });
          this.currentList["delete"] = true;
          this.addOrUpdateList(this.currentList);
          $("#deleteList").modal("hide");
        } else {
          this.statedeleting = false;
          this.toastrService.error(response.message, "Error Occured", {
            enableHtml: true,
            timeOut: 3000,
          });
        }
      });
  }
  changeActive(list) {
    this.lists
      .filter((lists) => {
        return lists.showReason;
      })
      .map((lists) => {
        if (lists.active == lists.deactivated) {
          lists.active = !lists.active;
        }
        lists.showReason = 0;
        return lists;
      });

    if (list.active) {
      // currently checked
      list.showReason = 0;
      list.notes = "";
      if (list.deactivated) {
        this.listsService.activate(list.id).subscribe((data: any) => {
          list.active = 1;
          list.notes = "";
          list.deactivation_notes = "";
          list.deactivated = 0;
        });
      }
    } else {
      list.notes = list.deactivation_notes;
      list.showReason = 1;
    }
  }

  cancelDeactivate(list) {
    list.active = 1;
    list.notes = "";
    list.showReason = 0;
  }

  submitDeactivate(list) {
    list.active = 0;
    this.listsService
      .deactivate(list.id, { deactivation_notes: list.notes })
      .subscribe((data: any) => {
        list.active = 0;
        list.deactivation_notes = list.notes;
        list.showReason = 0;
        list.deactivated = 1;
      });
  }

  viewList(list) {
    this.currentList = list;
    this.toggleListForm = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.selectOptionData = null;
    if (data == null) {
      this.selectOptionData = null;
      this.viewOptionSidebar = "out";
      this.toggleListForm = "in";
    } else {
      this.spinner.show();
      this.listsService.getListById(data.id).subscribe((res) => {
        this.spinner.hide();
        if (res.code === 200) {
          this.selectOptionData = res.data;
          this.viewOptionSidebar = "out";
          this.toggleListForm = "in";
        }
      });
    }
  }

  closeSideBar() {
    this.toggleListForm = "out";
    this.viewOptionSidebar = "out";
  }

  addOrUpdateList(data) {
    const index = this.lists.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.lists[index] = data;
    } else {
      this.lists.unshift(data);
    }
  }
}
