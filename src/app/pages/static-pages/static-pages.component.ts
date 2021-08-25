import { animate, state, style, transition, trigger, } from '@angular/animations';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { PagesService } from '../services/pages.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0px, 0, 0)',
          background: "#000000cf",
          width: '100%'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(-100%, 0, 0)',
          background: "#000000cf",
          width: '100%'

        })
      ),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class StaticPagesComponent implements OnInit {
  @ViewChild('elViewPage', { read: false }) elViewPage: any;
  pages: any[] = [];
  website_url = environment.website_url;
  p = 1;
  total;
  currentPage: any;
  toggleAddPage = 'out';
  statedeleting: boolean = false;

  constructor(private pagesService: PagesService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.pagesService.getPages().subscribe((res) => {
      this.pages = res.data;
      this.total = res.data.length;
    })
  }
  changeActive(section) {
    this.pages
      .filter((sections) => {
        return sections.showReason;
      })
      .map((sections) => {
        if (sections.active == sections.deactivated) {
          sections.active = !sections.active;
        }
        sections.showReason = 0;
        return sections;
      });

    if (section.active) {
      // currently checked
      section.showReason = 0;
      section.notes = "";
      if (section.deactivated) {
        this.pagesService.activate(section.id).subscribe((data: any) => {
          section.active = 1;
          section.notes = "";
          section.deactivation_notes = "";
          section.deactivated = 0;
        });
      }
    } else {
      section.notes = section.deactivation_notes;
      section.showReason = 1;
    }
  }
  cancelDeactivate(section) {
    section.active = 1;
    section.notes = "";
    section.showReason = 0;
  }
  submitDeactivate(section) {
    section.active = 0;
    this.pagesService
      .deactivate(section.id, { deactivation_notes: section.notes })
      .subscribe((data: any) => {
        section.active = 0;
        section.deactivation_notes = section.notes;
        section.showReason = 0;
        section.deactivated = 1;
      });
  }
  viewPage(page) {
    this.currentPage = page;
    this.elViewPage.nativeElement.classList.add('open-view-vindor-types')
  }

  closeViewPage() {
    this.elViewPage.nativeElement.classList.remove('open-view-vindor-types');
  }

  editCurrentPage(page = null) {
    this.currentPage = page;
    document.getElementById('add-page').classList.add('open-view-vindor-types');
    this.toggleAddPage = 'in';
  }

  closeSideBar() {
    this.toggleAddPage = 'out';
    document.getElementById('add-page').classList.remove('open-view-vindor-types');
    document.body.style.overflow = 'auto';
  }

  addOrUpdatePage(page) {
    this.pagesService.getPages().subscribe((res) => {
      this.toggleAddPage = 'out';
      document.getElementById('add-page').classList.remove('open-view-vindor-types');
      this.pages = res.data;
      this.total = res.data.length;
    })
  }

  deleteCurrentPage(page) {
    this.currentPage = page;
    $('#deletePage').modal('show');
  }

  confirmDelete() {
    this.statedeleting = true;
    this.pagesService.deletePage(this.currentPage.id).subscribe(res => {
      if (res.code === 200) {
        this.pages = this.pages.filter(page => page.id !== this.currentPage.id);
        this.statedeleting = false;
        $('#deletePage').modal('hide');
      } else {
        this.statedeleting = false;
        this.toastrService.error(res.message);
      }
    })
  }
}