import { AuthService } from "@app/shared/auth.service";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {
    email: "",
    password: ""
  };
  showError: Boolean;
  errorMessage = "";

  constructor(private router: Router,
    private _auth: AuthService) { }

  ngOnInit() {
    if(this._auth.isAuthenticated()) {
      this.router.navigate(["/pages/home"]);
    }
  }

  login() {
    this.showError = false;
    this._auth.login(this.user.email, this.user.password)
      .subscribe((response: any) => {
        if(response.code == 200) {
          this._auth.setToken(response.data.token);
          this._auth.setUser(response.data);

          this.router.navigate(["/pages/home"])
        }else{
          this.showError = true;
          this.errorMessage = response.message;
        }
      })
  }

}
