import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '@app/shared/auth.service';
import { Router } from '@angular/router';
import { SettingService } from '@app/pages/services/setting.service';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ActivationEnd } from '@angular/router';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/pairwise';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  pollingData: any;
  unread: any;
  notifToggle = false;
  @ViewChild('notificationAudio') audioPlayerRef: ElementRef;
  notificationGroups = [];

  title;
  user: any;
  userUpdate: any;
  initialRequest = true;
  loading: Boolean = true;

  constructor(private auth: AuthService, private router: Router,
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute) {
    settingService.imagesEmitter.subscribe(item => {
      this.user = item;

    });

  }

  ngOnInit() {
    this.pollingData = interval(15000)
      .pipe(startWith(0), switchMap(() => this.settingService.getNotifications()))
      .subscribe((response: any) => {
        this.loading = false;
        this.notificationGroups = response.data.notifications;
        if (!this.initialRequest && this.unread < response.data.unread) {
          this.audioPlayerRef.nativeElement.play();
        }
        this.initialRequest = false;
        this.unread = response.data.unread;
      });

    // this.title = this.activatedRoute.snapshot.data["title"];

    this.router.events
      .startWith(new NavigationEnd(0, '/', '/'))
      .filter((event) => event instanceof NavigationEnd)
      // .pairwise()
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        this.title = event['title'];
      });

    this.user = this.auth.getUser();
    this.getUser();
  }

  clickEvent() {
    this.settingService.markRead()
      .subscribe(resonse => {
        this.unread = 0;
      });
    this.notifToggle = !this.notifToggle;
  }

  logout() {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }
  getUser() {
    this.settingService.getNotification()
      .subscribe((response: any) => {
        this.user = response.data;
        this.user.imageUrl = this.user.image;
      });
  }

}
