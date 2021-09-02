import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment";
import $ from "jquery";
import { Router } from "@angular/router";
import { NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "./shared/auth.service";
import { NgxPermissionsService } from "ngx-permissions";
import { HttpClient } from "@angular/common/http";
// import { environmentVariables as environmentVariables } from '../environments/enviromentalVariables';
import { SettingService } from "./pages/services/setting.service";
import { ShowAffiliateService } from "./pages/services/show-affiliate.service";


declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-root",
  template: ` <router-outlet *ngIf="ConfigLoaded"></router-outlet>
            <div *ngIf="!ConfigLoaded" class="loadingArea">
              <img src="./../assets/img/loading-table.svg" alt="">
            </div>
  `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  systemConfig = {
    themeType: null,
    showLoyality: null,
    envApi: {
      env: {
        apiEndPoint: environment.api,
        checkoutUrl: '',
      },
    },
    brandRelatedVariables: {
      brand: '',
      brandArabic: '',
      branchType: [],
      email: '',
      hotline: '',
      loginApi: ''
    },
    brands: {
      logo: "",
      logoBlack: "",
      favIcon: "",
      logoWhite: "",
    },
    brand_color: '',
    enable_affiliate: false
  };
  ConfigLoaded = false;
  constructor(
    private router: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private permissionsService: NgxPermissionsService,
    private http: HttpClient,
    private settingsServ: SettingService,
    private showAffiliateService: ShowAffiliateService,

  ) {

    this.getConfigration();
  }

  ngOnInit() {

  } // end oninit
  getConfigration() {
    // console.log("config");

    this.settingsServ.getEnv_variables().subscribe((res: any) => {
      if (res.code === 200) {
        this.systemConfig.themeType = res.data.ADMIN_THEME_TYPE?res.data.ADMIN_THEME_TYPE:1;
        this.systemConfig.showLoyality = res.data.showLoyality?res.data.showLoyality:'';
        this.systemConfig.envApi.env.checkoutUrl = res.data.WEBSITE_URL?res.data.WEBSITE_URL:'';
        this.systemConfig.brandRelatedVariables.brand = res.data.APP_NAME ? res.data.APP_NAME : 'Dashboard';
        this.systemConfig.brandRelatedVariables.brandArabic = res.data.APP_NAME_AR ? res.data.APP_NAME_AR : 'Dashboard';
        this.systemConfig.brandRelatedVariables.branchType = res.data.BRANCH_TYPES_ARRAY?JSON.parse(res.data.BRANCH_TYPES_ARRAY):[];
        this.systemConfig.brandRelatedVariables.email = res.data.ONLINE_EMAIL?res.data.ONLINE_EMAIL:'';
        this.systemConfig.brandRelatedVariables.hotline = res.data.HOTPHONE?res.data.HOTPHONE:'';
        this.systemConfig.brandRelatedVariables.loginApi =  res.data.WEBSITE_URL?res.data.WEBSITE_URL:'';
        this.systemConfig.brands.logo = res.data.COLORED_LOGO_EN?res.data.COLORED_LOGO_EN:'';
        this.systemConfig.brands.logoBlack = res.data.BLACK_LOGO?res.data.BLACK_LOGO:'';
        this.systemConfig.brands.favIcon = res.data.FAV_ICON?res.data.FAV_ICON:'';
        this.systemConfig.brands.logoWhite = res.data.WHITE_LOGO_EN?res.data.WHITE_LOGO_EN:'';
        this.systemConfig.enable_affiliate = res.data.enable_affiliate?res.data.enable_affiliate:false;
        this.showAffiliateService.showAffiliate.next(res.data.enable_affiliate)
        if (this.systemConfig.brand_color) {
          document.documentElement.style.setProperty('--brand-color', this.systemConfig.brand_color)
        }
        localStorage.setItem('systemConfig', JSON.stringify(this.systemConfig));
        // this.setLink(this.systemConfig);
        this.setConfig(this.systemConfig);
        this.setFirstFav(this.systemConfig);
        this.ConfigLoaded = true;
      }
    })
  }
  setFirstFav(environmentVariables: any) {
    let link = document.querySelector("link[rel~='icon']");
    // console.log(link)
    // if (!link) {
    //   link = document.createElement('link');
    //   link['rel'] = 'icon';
    //   document.getElementsByTagName('head')[0].appendChild(link);
    // }
    link['href'] = environmentVariables.brands.favIcon;
  }
  setLink(environmentVariables) {
    var link = document.createElement('link');
    var environmentVariables = JSON.parse(localStorage.getItem("systemConfig"));
    link.rel = 'icon';
    link.href = `${environmentVariables.brands.favIcon}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  setConfig(environmentVariables) {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter((route) => route.outlet === "primary")
      .mergeMap((route) => route.data)
      .subscribe((event) =>
        this.title.setTitle(`${environmentVariables.brandRelatedVariables.brand} - ` + event["title"])
      );

    // make bootstrap as material design
    $(document).ready(function () {
      $("body").bootstrapMaterialDesign();
      // $("body").niceScroll({
      //   cursorcolor: "#000"
      // });

      $(".flex-nowrap ").niceScroll({
        horizrailenabled: true,
        cursorcolor: "#e4002c",
      });

      $('[data-toggle="tooltip"]').tooltip();
      // this is JQ only for right sidebar
      $("#toggle-sidebar").on("click", function () {
        $(".main-content").toggleClass("toggle-main-content");
        $(".left-sidebar").toggleClass("toggle-left-sidebar");
        // $("i", this).toggleClass(" icon-Exit fa fa-bars");
        if ($(".main-content").hasClass("toggle-main-content")) {
          $(".view-vindor-types").addClass("open-view-vindor-types2");
          $(".app-logo img").attr("src", `${environmentVariables.brands.logo}`);
        } else {
          $(".view-vindor-types").removeClass("open-view-vindor-types2");
          $(".app-logo img").attr("src", `${environmentVariables.brands.logo}`);
        }
      });

      $("#toggle-form").on("click", function () {
        $(".form-sidebar").toggleClass("open-form-sidebar");
        // $(".left-sidebar").toggleClass("toggle-left-sidebar")
        // $("i", this).toggleClass(" icon-Exit fa fa-bars");
      });
    }); // end document


  }
}
