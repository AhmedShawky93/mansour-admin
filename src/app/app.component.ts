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
import { environmentVariables as environmentVariables } from '../environments/enviromentalVariables';


declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-root",
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private permissionsService: NgxPermissionsService,
    private http: HttpClient
  ) { }

  async ngOnInit() {

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

  } // end oninit
}
