import "rxjs/Rx";

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  Component,
  OnInit,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
} from "@angular/forms";

import { ToastrService } from "ngx-toastr";

import { PromotionsService } from "@app/pages/services/promotions.service";

declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-promotions",
  templateUrl: "./promotions.component.html",
  styleUrls: ["./promotions.component.css"],
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
export class PromotionsComponent implements OnInit {
  statedeleting: boolean = false;
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
  promotions = [];
  currentPromotion: any;
  constructor(
    private promotionsService: PromotionsService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.getPromotions();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });
  }

  getPromotions() {
    this.loading = true;
    this.productIsEmpty = false;

    this.promotionsService
      .getRangePromotions(this.searchObj)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.promotions = response.data;
          this.loading = false;
          this.promotions.map((section) => {
            section.deactivated = !section.active;
            return section;
          });
        }

        // if (response.data.length == 0) {
        //   this.productIsEmpty = true;
        // }
      });
  }

  changeActive(promotion) {
    this.promotions
      .filter((promotions) => {
        return promotions.showReason;
      })
      .map((promotions) => {
        if (promotions.active == promotions.deactivated) {
          promotions.active = !promotions.active;
        }
        promotions.showReason = 0;
        return promotions;
      });

    if (promotion.active) {
      // currently checked
      promotion.showReason = 0;
      promotion.notes = "";
      if (promotion.deactivated) {
        this.promotionsService.activate(promotion.id).subscribe((data: any) => {
          promotion.active = 1;
          promotion.notes = "";
          promotion.deactivation_notes = "";
          promotion.deactivated = 0;
        });
      }
    } else {
      promotion.notes = promotion.deactivation_notes;
      promotion.showReason = 1;
    }
  }

  cancelDeactivate(promotion) {
    promotion.active = 1;
    promotion.notes = "";
    promotion.showReason = 0;
  }
  submitDeactivate(promotion) {
    promotion.active = 0;
    this.promotionsService
      .deactivate(promotion.id, { deactivation_notes: promotion.notes })
      .subscribe((data: any) => {
        promotion.active = 0;
        promotion.deactivation_notes = promotion.notes;
        promotion.showReason = 0;
        promotion.deactivated = 1;
      });
  }

  toggleMenu(data?) {
    console.log(data);
    this.currentPromotion = data;
    this.toggleAddOption = "in";
    this.viewOptionSidebar = "out";
  }

  closeSideBar() {
    this.currentPromotion = null;
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "in";
  }

  showPopupDeletePromotion(promotion) {
    this.currentProduct = promotion;
    $("#deletePromotion").modal("show");
  }

  confirmDelete() {
    this.statedeleting = true;
    this.promotionsService
      .deleteRangePromotion(this.currentProduct.id)
      .subscribe(async (res: any) => {
        if (res.code == 200) {
          this.promotions = await this.promotions.filter(
            (promotion) => promotion.id !== this.currentProduct.id
          );
          this.statedeleting = false;
          $("#deletePromotion").modal("hide");
          this.toasterService.success("Deleted Successfully");
        } else {
          this.statedeleting = false;
          $("#deletePromotion").modal("hide");
          this.toasterService.error("Deleted Not Successfully");
        }
      });
  }

  addOrUpdateOption(data) {
    const index = this.promotions.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.promotions[index] = data;
    } else {
      this.promotions.unshift(data);
    }
  }
}
