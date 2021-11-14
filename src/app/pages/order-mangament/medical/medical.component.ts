import { Component, OnInit } from "@angular/core";
import { MedicalService } from "@app/pages/services/medical.service";
import { AuthService } from "@app/shared/auth.service";
import { environment } from "@env/environment.prod";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-medical",
  templateUrl: "./medical.component.html",
  styleUrls: ["./medical.component.css"],
})
export class MedicalComponent implements OnInit {
  exportUrl: string;
  total: any;

  medical: any;
  viewMedical: any;
  p = 1;
  constructor(
    private MedicalServices: MedicalService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    $(".tb-assign .btn").on("click", function () {
      $("#delevary1").slideToggle();
    });

    $("#delevary1 .close").on("click", function () {
      $("#delevary1").slideUp();
    });
    this.getMedical();

    const token = this.auth.getToken();

    this.exportUrl =
      environment.api + "/api" + "/admin/promos/export?token=" + token;
  }

  getMedical() {
    this.MedicalServices.getMedical().subscribe((response: any) => {
      this.medical = response.data;
      this.total = this.medical.length;
    });
  }

  viewMed(med) {
    this.viewMedical = med;
  }
}
