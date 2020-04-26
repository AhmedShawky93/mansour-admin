import { Component, OnInit } from "@angular/core";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-reporting-center",
  templateUrl: "./reporting-center.component.html",
  styleUrls: ["./reporting-center.component.css"],
})
export class ReportingCenterComponent implements OnInit {
  constructor() {}

  /************************************************************************** *
  Staff item charts Ghraph
  *********************************************************************** */
  // lineChart
  public lineChartData3: Array<any> = [
    { data: [1560, 59, 580, 81, 56, 55, 40] },
  ];
  public lineChartLabels3: Array<any> = [];
  public lineChartOptions3: any = {
    responsive: true,
  };
  public lineChartColors3: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(56,160,205,0.1)",
      borderColor: "#39384d",
      pointBackgroundColor: "rgba(0,158,250,1)",
      pointBorderColor: "rgba(83,127,223,1)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend3: boolean = false;
  public lineChartType3: string = "line";

  /************************************************************************** *
  Side bar charts Ghraph
  *********************************************************************** */
  // lineChart
  public lineChartData: Array<any> = [
    { data: [658, 500, 98, 456, 36, 100], label: "Legend 1 " },
    { data: [1000, 500, 1500, 1500, 1000, 2500], label: "Legend 2" },
    { data: [625, 500, 200, 654, 2500, 1000], label: "Legend 3" },
  ];
  public lineChartLabels: Array<any> = [
    "Jan",
    "feb",
    "mar",
    "apr",
    "may",
    "Jun",
    "jul",
  ];
  public lineChartOptions: any = {
    responsive: true,
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(83,127,223,0.7)",
      borderColor: "rgba(83,127,223,0.7)",
      pointBackgroundColor: "rgba(83,127,223,1)",
      pointBorderColor: "rgba(83,127,223,1)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // dark grey
      backgroundColor: "rgba(197,136,189,0.7)",
      borderColor: "rgba(197,136,189,0.7)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      // grey
      backgroundColor: "rgba(132,230,200,0.7)",
      borderColor: "rgba(132,230,200,0.7)",
      pointBackgroundColor: "rgba(94,227,174,1)",
      pointBorderColor: "rgba(94,227,174,1)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = "line";
  // events
  public chartClicked(e: any): void {}

  public chartHovered(e: any): void {}

  // the second chart 2
  // lineChart
  public lineChartData1: Array<any> = [
    { data: [658, 200, 567, 635, 33, 251], label: "Legend 1 " },
    { data: [150, 489, 319, 326, 160, 365], label: "Legend 2" },
    { data: [100, 459, 200, 123, 428, 157], label: "Legend 3" },
  ];
  public lineChartLabels1: Array<any> = [
    "Jan",
    "feb",
    "mar",
    "apr",
    "may",
    "Jun",
    "jul",
  ];
  public lineChartOptions1: any = {
    responsive: true,
  };
  public lineChartColors1: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(83,127,223,0.7)",
      borderColor: "rgba(83,127,223,0.7)",
      pointBackgroundColor: "rgba(83,127,223,1)",
      pointBorderColor: "rgba(83,127,223,1)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // dark grey
      backgroundColor: "rgba(197,136,189,0.7)",
      borderColor: "rgba(197,136,189,0.7)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      // grey
      backgroundColor: "rgba(132,230,200,0.7)",
      borderColor: "rgba(132,230,200,0.7)",
      pointBackgroundColor: "rgba(94,227,174,1)",
      pointBorderColor: "rgba(94,227,174,1)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend1: boolean = true;
  public lineChartType1: string = "line";

  ngOnInit() {
    $("body").on("click", ".toggle-view-details-sidebar", function () {
      $("#view-details-sidebar").toggleClass("open-view-vindor-types");
    });

    // colse sidebar
    $("#close-1").on("click", function () {
      $("#view-details-sidebar").removeClass("open-view-vindor-types");
    });
  }
}
