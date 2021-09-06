// import { environmentVariables } from './../../../../environments/enviromentalVariables';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SettingService } from '@app/pages/services/setting.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  environmentVariables;
  errorMessage: any = false;
  password;
  password_confirm;
  token;

  constructor(private auth: AuthService, private router: Router, private activeRoute: ActivatedRoute,private settingService:SettingService) {
    this.getConfig();
   }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      let token = params['token'];
      this.token = token;
    });
  }
  getConfig(){
    this.settingService.getenvConfig().subscribe(res=>{
     this.environmentVariables=res;
    })
  }

  resetPassword() {
    if(this.password !== this.password_confirm ) {
      this.errorMessage = "Password confirmation does not match";
      return;
    }
    this.auth.resetPassword({
      password: this.password,
      password_confirm: this.password_confirm,
      token: this.token
    })
      .subscribe((response: any) => {
        if(response.code != 200) {
          this.errorMessage = response.message;
        }else{
          this.auth.setToken(response.data.token);
          this.auth.setUser(response.data);

          this.router.navigate(["/pages/home"]);
        }
      })
  }

}
