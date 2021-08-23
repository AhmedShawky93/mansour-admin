import { animate, state, style, transition, trigger, } from '@angular/animations';
import { Component, OnInit, ViewChild, } from '@angular/core';
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