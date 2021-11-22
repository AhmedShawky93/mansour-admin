// import { environmentVariables } from './../../../../environments/enviromentalVariables';
import { Component, OnInit } from "@angular/core";
import { AuthService } from "@app/shared/auth.service";
import { Router } from "@angular/router";
import { SettingService } from "@app/pages/services/setting.service";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.css"],
})
export class ForgetPasswordComponent implements OnInit {
  environmentVariables;
  email;
  errorMessage;

  constructor(
    private auth: AuthService,
    private router: Router,
    private settingService: SettingService
  ) {
    this.getConfig();
  }

  ngOnInit() {}
  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }

  forgetPassword() {
    this.auth
      .forgetPassword({ email: this.email })
      .subscribe((response: any) => {
        if (response.code != 200) {
          this.errorMessage = response.message;
        } else {
          this.router.navigate(["/login"]);
        }
      });
  }
}
