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
import { SectionsService } from "@app/pages/services/sections.service";

@Component({
  selector: "app-sections",
  templateUrl: "./sections.component.html",
  styleUrls: ["./sections.component.css"],
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
export class SectionsComponent implements OnInit {
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
  toggleAddOption: string = "out";
  viewOptionSidebar: string = "out";
  selectOptionData: any;
  selectOptionDataView: any;
  loading: boolean;
  productIsEmpty: boolean;
  sections = [];
  currentSection: any;
  constructor(
    private toastrService: ToastrService,
    private sectionsService: SectionsService
  ) { }

  ngOnInit() {
    this.getSections();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });
  }
  openViewProduct(data) { }

  getSections() {
    this.loading = true;
    this.productIsEmpty = false;

    this.sectionsService
      .getSections(this.searchObj)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.sections = response.data;
          this.loading = false;
          this.sections.map((section) => {
            section.deactivated = !section.active;
            return section;
          });
        }

        // if (response.data.length == 0) {
        //   this.productIsEmpty = true;
        // }
      });
  }

  changeActive(section) {
    this.sections
      .filter((sections) => {
        return sections.showReason;
      })
      .map((sections) => {
        if (sections.active == sections.deactivated) {
          sections.active = !sections.active;
        }
        sections.showReason = 0;
        return sections;
      });

    if (section.active) {
      // currently checked
      section.showReason = 0;
      section.notes = "";
      if (section.deactivated) {
        this.sectionsService.activate(section.id).subscribe((data: any) => {
          section.active = 1;
          section.notes = "";
          section.deactivation_notes = "";
          section.deactivated = 0;
        });
      }
    } else {
      section.notes = section.deactivation_notes;
      section.showReason = 1;
    }
  }

  cancelDeactivate(section) {
    section.active = 1;
    section.notes = "";
    section.showReason = 0;
  }
  submitDeactivate(section) {
    section.active = 0;
    this.sectionsService
      .deactivate(section.id, { deactivation_notes: section.notes })
      .subscribe((data: any) => {
        section.active = 0;
        section.deactivation_notes = section.notes;
        section.showReason = 0;
        section.deactivated = 1;
      });
  }

  viewSection(section) {
    this.currentSection = section;
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.currentSection = data;
    this.viewOptionSidebar = "out";
    this.toggleAddOption = "in";
  }

  deleteSection(data) {
    this.sectionsService.deleteSection(data.id).subscribe(res => {
      if (res.code === 200) {
        this.sections = this.sections.filter(item => item.id !== data.id)
      } else {
        this.toastrService.error(res.message);
      }
    })
  }

  closeSideBar() {
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "out";
    this.currentSection = null;
  }

  addOrUpdateOption(data) {
    const index = this.sections.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.sections[index] = data;
    } else {
      this.sections.unshift(data);
    }
  }
}
