import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import "rxjs/Rx";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { ListsService } from "@app/pages/services/lists.service";

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
  constructor(
    private toastrService: ToastrService,
    private listsService: ListsService
  ) {}

  ngOnInit() {
    this.getLists();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });
  }
  
  getLists() {
    this.loading = true;
    this.productIsEmpty = false;

    this.listsService
      .getLists(this.searchObj)
      .subscribe((response: any) => {
        if (response.code === 200) {
          console.log(response.data.data);
          this.lists = response.data;
          this.total = this.lists.length;
          this.loading = false;
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
    console.log(list);
    this.currentList = list;
    this.toggleListForm = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.listsService.getListById(data.id).subscribe((res) => {
      this.selectOptionData = res.data;
      this.viewOptionSidebar = "out";
      this.toggleListForm = "in";
    })
    console.log(this.selectOptionData);
  }

  closeSideBar() {
    this.toggleListForm = "out";
    this.viewOptionSidebar = "out";
  }

  addOrUpdateOption(data) {
    const index = this.lists.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.lists[index] = data;
    } else {
      this.lists.unshift(data);
    }
  }
}
