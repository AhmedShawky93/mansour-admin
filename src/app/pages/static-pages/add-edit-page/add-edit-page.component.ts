import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PagesService } from '@app/pages/services/pages.service';
import { environment } from '@env/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-page',
  templateUrl: './add-edit-page.component.html',
  styleUrls: ['./add-edit-page.component.css']
})
export class AddEditPageComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input('selectProductDataEdit') selectProductDataEdit;
  @Input() curentAction;
  addEditPageForm: any;
  submitting = false;
  website_url = environment.website_url;
  editorConfig: AngularEditorConfig;
  currentslug='';
  loading=false;
  constructor(private formBuilder: FormBuilder, private pagesService: PagesService, private toastrService: ToastrService) {
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: '175px',
      minHeight: '5rem',
      maxHeight: 'auto',
      width: '100%',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      sanitize: false,
      toolbarPosition: 'top',
    };
  }

  ngOnInit() {
    if(this.selectProductDataEdit && this.selectProductDataEdit.id && this.curentAction=='in'){
           this.getcurrentPage(this.selectProductDataEdit.id);
    }
    else{
         this.getForm(this.selectProductDataEdit);
    }
 
  }

  ngOnChanges() {
    if(this.selectProductDataEdit && this.selectProductDataEdit.id  && this.curentAction=='in'){
      this.getcurrentPage(this.selectProductDataEdit.id);
}
else{
    this.getForm(this.selectProductDataEdit);
}
  }

  getForm(data) {
    this.addEditPageForm = this.formBuilder.group({
      slug: new FormControl(data ? data.slug : '', Validators.required),
      title_en: new FormControl(data ? data.title_en : '', Validators.required),
      title_ar: new FormControl(data ? data.title_ar : '', Validators.required),
      content_en: new FormControl(data ? data.content_en : '', Validators.required),
      content_ar: new FormControl(data ? data.content_ar : '', Validators.required),
      order: new FormControl(data ? data.order : '', Validators.required),
      in_footer: new FormControl(data ? data.in_footer : false),
    })
  }
  getcurrentPage(pageId){
    this.loading=true;
    this.pagesService.getSinglePage(pageId).subscribe(res=>{
      this.getForm(res.data);
      this.loading=false;
    })
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
    // this.addEditPageForm.reset();
  }

  addEditPages() {
    if (this.addEditPageForm.valid) {
      this.submitting = true;
      if (this.selectProductDataEdit) {
        this.pagesService.editPage(this.selectProductDataEdit.id, this.addEditPageForm.value).subscribe(res => {
          if (res.code === 200) {
            this.submitting = false;
            this.dataProductEmit.emit(res.data);
          } else {
            this.submitting = false;
            this.toastrService.error(res.message);
          }
        })
      } else {
        this.pagesService.addPage(this.addEditPageForm.value).subscribe(res => {
          if (res.code === 200) {
            this.submitting = false;
            this.dataProductEmit.emit(res.data);
          } else {
            this.submitting = false;
            this.toastrService.error(res.message);
          }
        })
      }
    }
    else{
      this.submitting=true;
    }
  }
  detectpageChange(){
    this.currentslug=this.addEditPageForm.value.title_en.replace(/\s+/g,'-');
    // console.log("value : ",this.addEditPageForm.value.title_en);
    
  }
}
