import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../../services/category.service";
import { PromosService } from "@app/pages/services/promos.service";
import { environment } from "@env/environment";
import { AuthService } from "@app/shared/auth.service";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-offers",
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.css"],
})
export class OffersComponent implements OnInit {
  exportUrl: string;

  searchTerm: string = "";

  p = 1;
  total;

  newCategory: any = {
    name: "",
    description: "",
    sub_categories: [],
  };
  promos = [];
  promo;
  categories = [];
  viewPromo;

  constructor(
    private catService: CategoryService,
    private promoGet: PromosService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    $(document).ready(function () {
      $(".owls-table").on("click", ".toggle-view-category", function () {
        $("#view-category").toggleClass("open-view-vindor-types");
      });

      $(".owl-btn-list").on("click", ".open-add", function () {
        $("#add-category").toggleClass("open-view-vindor-types");
      });

      $(".head-btn").on("click", ".open-edit", function () {
        $("#edit-category").toggleClass("open-view-vindor-types");
      });

      // close
      $("#close-vindors1").on("click", function () {
        $("#view-category").removeClass("open-view-vindor-types");
      });

      $("#close-vindors2").on("click", function () {
        $("#add-category").removeClass("open-view-vindor-types");
      });

      $("#close-vindors3").on("click", function () {
        $("#edit-category").removeClass("open-view-vindor-types");
      });

      $(".owls-time-alert ").on("click", ".closebtn", function () {
        $(this).parent().hide();
      });

      $(".switch").on("click", ".slider", function () {
        var then = $(this).siblings(".reason-popup").slideToggle(100);
        $(".reason-popup").not(then).slideUp(50);
      });
    });

    this.getCategories();
    this.getpromo();

    let token = this.auth.getToken();

    this.exportUrl = environment.api + "/api" + "/admin/promos/export?token=" + token;
  }

  getpromo() {
    this.promoGet.getPromos().subscribe((dataProme: any) => {
      this.promos = dataProme.data;
      this.promos = this.promos.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
      this.total = this.promos.length;
    });
  }

  getpromoId(promo) {
    this.promoGet.getPromo(promo.id).subscribe((dataProme: any) => {
      this.viewPromo = dataProme.data;
    });
  }

  viewpromo(promo) {
    this.viewPromo = promo;
  }

  getCategories() {
    this.catService.getCategories().subscribe((data: any) => {
      this.categories = data.data;
    });
  }

  changeActive(promo) {
    this.promos
      .filter((promo) => {
        return promo.showReason;
      })
      .map((promo) => {
        if (promo.active == promo.deactivated) {
          promo.active = !promo.active;
        }
        promo.showReason = 0;
        return promo;
      });

    if (promo.active) {
      // currently checked
      promo.showReason = 0;
      promo.notes = "";
      if (promo.deactivated) {
        this.promoGet.activatePromo(promo.id).subscribe((data: any) => {
          promo.active = 1;
          promo.notes = "";
          promo.deactivation_notes = "";
          promo.deactivated = 0;
        });
      }
    } else {
      promo.notes = promo.deactivation_notes;
      promo.showReason = 1;
    }
  }

  cancelDeactivate(promo) {
    promo.active = 1;
    promo.notes = "";
    promo.showReason = 0;
  }

  submitDeactivate(promo) {
    promo.active = 0;
    this.promoGet
      .deactivatePromo(promo.id, { deactivation_notes: promo.notes })
      .subscribe((data: any) => {
        promo.active = 0;
        promo.deactivation_notes = promo.notes;
        promo.showReason = 0;
        promo.deactivated = 1;
      });
  }
}
