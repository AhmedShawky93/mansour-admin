import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private permissionsService: NgxPermissionsService,) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      console.log(data);
      this.permissionsService.flushPermissions();

      let user = data.profile.data;
      if (user.roles.length) {
        const perm = user.roles[0].permissions.map((perm) => perm.name);
        this.permissionsService.loadPermissions(perm);

        if (user.roles[0].name == "Super Admin") {
          this.permissionsService.addPermission(['ADMIN']);
        }
      }
    });
  }
}
