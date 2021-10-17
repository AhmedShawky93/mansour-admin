// import { environmentVariables } from './../../../environments/enviromentalVariables';
import { AuthService } from "@app/shared/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SettingService } from "../services/setting.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  environmentVariables;
  user: any = {
    email: "",
    password: "",
  };
  showError: Boolean;
  errorMessage = "";
  loggingin: Boolean = false;

  constructor(
    private router: Router,
    private settingService: SettingService,
    private _auth: AuthService
  ) {
    this.getConfig();
  }

  ngOnInit() {
    if (this._auth.isAuthenticated()) {
      this.router.navigate(["/pages/home"]);
    }
  }
  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }
  login() {
    this.showError = false;
    this.loggingin = true;
    this._auth
      .login(this.user.email, this.user.password)
      .subscribe((response: any) => {
        this.loggingin = false;
        if (response.code == 200) {
          this._auth.setToken(response.data.token);
          this._auth.setUser(response.data);
          this._auth.setPermissions();
          this.router.navigate(["/pages/home"]);
        } else {
          this.showError = true;
          this.errorMessage = response.message;
        }
      });
  }
}
