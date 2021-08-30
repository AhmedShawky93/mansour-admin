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
  loading=false;
  website_url = environment.website_url;
  p = 1;
  total;
  currentPage: any;
  toggleAddPage = 'out';
  statedeleting: boolean = false;

  constructor(private pagesService: PagesService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.loading=true;
    this.pagesService.getPages().subscribe((res) => {
      if(res.code===200){
      this.loading=false;
      this.pages = res.data;
      this.total = res.data.length;
      }
    
    })
  }
  changeActive(section) {
      this.pagesService.editPage(section.id,{in_footer:section.in_footer}).subscribe(res => {
        if (res.code != 200) {
          if(section.in_footer){
           section.in_footer=false;
          }
          else{
            section.in_footer=true;
          }
          this.toastrService.error(res.message);
        } 
        
      })
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
  getcurrentPage(pageId){
    // this.loading=true;
    this.pagesService.getSinglePage(pageId).subscribe(res=>{
      this.currentPage = res.data;
      // this.loading=false;
      this.elViewPage.nativeElement.classList.add('open-view-vindor-types')
      // this.viewPage(res.data);
    
    })
  }
  viewPage(page) {
    this.currentPage = page;
    this.elViewPage.nativeElement.classList.add('open-view-vindor-types');
    this.getcurrentPage(page.id);
  }

  closeViewPage() {
    this.elViewPage.nativeElement.classList.remove('open-view-vindor-types');
  }

  editCurrentPage(page = null) {
    this.toggleAddPage = 'in';
    this.currentPage = page;
    document.getElementById('add-page').classList.add('open-view-vindor-types');
    
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