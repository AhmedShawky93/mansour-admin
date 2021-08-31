import { CanActivate, Router, CanActivateChild } from "@angular/router";
import {Injectable} from "@angular/core";
import { AuthService } from "./auth.service";
import { NgxPermissionsService } from "ngx-permissions";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private auth: AuthService, private permissionsService: NgxPermissionsService) {
    }


    canActivate(): Promise<boolean> {
        return new Promise((resolve) => {
            this.auth.getProfile().toPromise()
              .then(async (data: any) => {
                
                await this.permissionsService.flushPermissions();

                let user = data.data;
                if (user.roles.length) {
                    const perm = user.roles[0].permissions.map((perm) => perm.name);
                    await this.permissionsService.loadPermissions(perm);

                    if (user.roles[0].name == "Super Admin") {
                    await this.permissionsService.addPermission(['ADMIN']);
                    }
                }
                
                resolve(true);
              })
              .catch(function () {
                resolve(false);
              });
            });
    }

    canActivateChild() {
        if(this.auth.isAuthenticated()){
            return true;
        }

        this.router.navigate(["/login"])
        return false
    }


}