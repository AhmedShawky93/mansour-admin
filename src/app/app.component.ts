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


declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-root",
  template: ` <router-outlet *ngIf="ConfigLoaded"></router-outlet> `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  systemConfig={
    themeType: 1,
    showLoyality: true,
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
    brand_color:'#da1e42'
  };
  ConfigLoaded=false;
  constructor(
    private router: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private permissionsService: NgxPermissionsService,
    private http: HttpClient,
    private settingsServ:SettingService
  ) {

    this.getConfigration();
   }

 ngOnInit() {

  } // end oninit
  getConfigration(){
    // console.log("config");
    
    this.settingsServ.getEnv_variables().subscribe((res:any)=>{
       if(res.code===200){
          this.systemConfig.themeType=res.data.theme_type;
          this.systemConfig.showLoyality=res.data.show_loyality;
          this.systemConfig.envApi.env.checkoutUrl=res.data.checkout_url;
          this.systemConfig.brandRelatedVariables.brand=res.data.brand_related_variables_brand;
          this.systemConfig.brandRelatedVariables.brandArabic=res.data.brand_related_variables_brandarabic;
          this.systemConfig.brandRelatedVariables.branchType=res.data.brand_related_variables_branchtype;
          this.systemConfig.brandRelatedVariables.email=res.data.brand_related_variables_email;
          this.systemConfig.brandRelatedVariables.hotline=res.data.brand_related_variables_hotline;
          this.systemConfig.brandRelatedVariables.loginApi=res.data.brand_related_variables_loginApi;
          this.systemConfig.brands.logo=res.data.brands_logo;
          this.systemConfig.brands.logoBlack=res.data.brands_logoBlack;
          this.systemConfig.brands.favIcon=res.data.brands_favIcon;
          this.systemConfig.brands.logoWhite=res.data.brands_logoWhite;
          if(this.systemConfig.brand_color){
             document.documentElement.style.setProperty('--brand-color', this.systemConfig.brand_color)
          }
          localStorage.setItem('systemConfig',JSON.stringify(this.systemConfig));
          this.setConfig(this.systemConfig);
          this.setLink(this.systemConfig);
          this.ConfigLoaded=true;
       }
    })
  }
  setLink(environmentVariables){
    var link = document.createElement('link');
    // var environmentVariables=JSON.parse(localStorage.getItem("systemConfig"));
    link.rel = 'icon';
    link.href = `${environmentVariables.brands.favIcon}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  setConfig(environmentVariables){
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

  let link = document.querySelector("link[rel~='icon']");
  console.log(link)
  if (!link) {
    link = document.createElement('link');
    link['rel'] = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link['href'] = environmentVariables.brands.favIcon;
  }
}
