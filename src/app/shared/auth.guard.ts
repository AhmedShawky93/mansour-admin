import { CanActivate, Router } from "@angular/router";
import {Injectable} from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }


    canActivate() {
        
        if(this.auth.isAuthenticated()){
            return true;
        }

        this.router.navigate(["/login"])
        return false
    }


}