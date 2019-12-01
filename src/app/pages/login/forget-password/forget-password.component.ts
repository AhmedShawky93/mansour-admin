import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  email;
  errorMessage;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  forgetPassword() {
    this.auth.forgetPassword({email: this.email})
      .subscribe((response: any) => {
        if(response.code != 200) {
          this.errorMessage = response.message;
        } else{
          this.router.navigate(["/login"]);
        }
      })
  }

}
