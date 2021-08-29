import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../services/menu.service';
import { UploadFilesService } from '../services/upload-files.service';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-menu-creator',
  templateUrl: './menu-creator.component.html',
  styleUrls: ['./menu-creator.component.css']
})
export class MenuCreatorComponent implements OnInit, AfterViewInit {
  formattedJson: any = {
    "menu_background_color": "#050708",
    "drop_menu_background_color": "#ffffff",
    "level1_text_color": "#ffffff",
    "level1_hover_color": "#da1e42",
    "level2_text_color": "#da1e42",
    "level2_hover_color": "#050708",
    "level3_text_color": "#050708",
    "level3_hover_color": "#da1e42",
    "level1": [
      {
        "link": "https://www.mobilaty.com/",
        "name": "Home",
        "name_ar": "الصفحة الرئيسية",
        "image": "",
        "levels_length": 1,
        "level1_image": false,
        "level2_image": false,
        "level3_image": false,
        "level2": []
      },
      {
        "link": "https://www.mobilaty.com/products?category_id=687",
        "name": "Mobiles",
        "name_ar": "هواتف",
        "image": "https://mobilatyapi.el-dokan.com/storage/uploads/qJpEpk-1609759077.jpg",
        "levels_length": 3,
        "level1_image": true,
        "level2_image": false,
        "level3_image": false,
        "level3_items_spacing": "20px",
        "menu_padding": "2rem",
        "level1_image_dimentions": "300px",
        "fixed_width": "30%",
        "level2": [
          {
            "link": "",
            "name": "Operating System",
            "name_ar": "نظام التشغيل",
            "image": "",
            "level3": [{
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Android",
              "name_ar": "اندرويد",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "IOS",
              "name_ar": "IOS",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Classic",
              "name_ar": "كلاسيكى",
              "image": ""
            }]
          },
          {
            "link": "",
            "name": "Shop By Price",
            "name_ar": "تسوق حسب السعر",
            "image": "",
            "level3": [{
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "less than 1000 pounds",
              "name_ar": "أقل من 1000 جنيه",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "from 1000 to 2900",
              "name_ar": "من 1000 إلى 2999 جنيه",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "from 3000 to 5999",
              "name_ar": "من 3000 إلى 5999 جنيه",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "from 6000 to 10000",
              "name_ar": "من 6000 إلى 10000",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "more than 10000",
              "name_ar": "أكثر من 10000",
              "image": ""
            }]
          },
          {
            "link": "",
            "name": "shop by brand",
            "name_ar": "تسوق حسب الماركة",
            "image": "",
            "level3": [{
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Apple",
              "name_ar": "ابل",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Samsung",
              "name_ar": "سامسونج",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Xiaomi",
              "name_ar": "شاومى",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "oppo",
              "name_ar": "اوبو",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "realmi",
              "name_ar": "ريلمى",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "huawei",
              "name_ar": "هواوى",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "honor",
              "name_ar": "هونر",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "vivo",
              "name_ar": "فيفو",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "nokia",
              "name_ar": "نوكيا",
              "image": ""
            }]
          }
        ]
      }]
  }
  formattedJsonString = `{
    "menu_background_color": "#050708",
    "drop_menu_background_color": "#ffffff",
    "level1_text_color": "#ffffff",
    "level1_hover_color": "#da1e42",
    "level2_text_color": "#da1e42",
    "level2_hover_color": "#050708",
    "level3_text_color": "#050708",
    "level3_hover_color": "#da1e42",
    "level1": [
      {
        "link": "https://www.mobilaty.com/",
        "name": "Home",
        "name_ar": "الصفحة الرئيسية",
        "image": "",
        "levels_length": 1,
        "level1_image": false,
        "level2_image": false,
        "level3_image": false,
        "level2": []
      },
      {
        "link": "https://www.mobilaty.com/products?category_id=687",
        "name": "Mobiles",
        "name_ar": "هواتف",
        "image": "https://mobilatyapi.el-dokan.com/storage/uploads/qJpEpk-1609759077.jpg",
        "levels_length": 3,
        "level1_image": true,
        "level2_image": false,
        "level3_image": false,
        "level3_items_spacing": "20px",
        "menu_padding":"2rem",
        "level1_image_dimentions" : "300px",
        "fixed_width":"30%",
        "level2": [
          {
            "link": "",
            "name": "Operating System",
            "name_ar": "نظام التشغيل",
            "image": "",
            "level3": [{
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Android",
              "name_ar": "اندرويد",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "IOS",
              "name_ar": "IOS",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Classic",
              "name_ar": "كلاسيكى",
              "image": ""
            }]
          },
          {
            "link": "",
            "name": "Shop By Price",
            "name_ar": "تسوق حسب السعر",
            "image": "",
            "level3": [{
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "less than 1000 pounds",
              "name_ar": "أقل من 1000 جنيه",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "from 1000 to 2900",
              "name_ar": "من 1000 إلى 2999 جنيه",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "from 3000 to 5999",
              "name_ar": "من 3000 إلى 5999 جنيه",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "from 6000 to 10000",
              "name_ar": "من 6000 إلى 10000",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "more than 10000",
              "name_ar": "أكثر من 10000",
              "image": ""
            }]
          },
          {
            "link": "",
            "name": "shop by brand",
            "name_ar": "تسوق حسب الماركة",
            "image": "",
            "level3": [{
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Apple",
              "name_ar": "ابل",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Samsung",
              "name_ar": "سامسونج",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "Xiaomi",
              "name_ar": "شاومى",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "oppo",
              "name_ar": "اوبو",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "realmi",
              "name_ar": "ريلمى",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "huawei",
              "name_ar": "هواوى",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "honor",
              "name_ar": "هونر",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "vivo",
              "name_ar": "فيفو",
              "image": ""
            },
            {
              "link": "https://www.mobilaty.com/products?category_id=687",
              "name": "nokia",
              "name_ar": "نوكيا",
              "image": ""
            }]
          }
        ]
      }]
  }`
  clickedItem: boolean = false;
  headerForm: FormGroup;
  groupForm: FormGroup;
  subCategoryForm: FormGroup;
  selectedHeader: any = null;
  selectedGroup: any = null;
  selectedSubcategory: any = null;
  editorType: number;
  updateIndexHeader: any;
  updateIndexGroup: any;
  updateIndexSubCategory: any;
  deleteItemIndex: number = 0;
  deleteItemType: number = 0;
  deleteItemName: any;
  statedeleting: boolean = false;
  updating: boolean = false;


  constructor(private uploadService: UploadFilesService, private menuService: MenuService, private toastrService: ToastrService) {
    this.setHeaderForm();
    this.setGroupForm();
    this.setSubCategoryForm();
  }

  setHeaderForm(data = null) {
    this.headerForm = new FormGroup({
      link: new FormControl(data ? data.link : ''),
      name: new FormControl(data ? data.name : '', Validators.required),
      name_ar: new FormControl(data ? data.name_ar : '', Validators.required),
      image: new FormControl(data ? data.image : ''),
      levels_length: new FormControl(data ? data.levels_length : 1, Validators.required),
      level1_image: new FormControl(data ? data.level1_image : false),
      level2_image: new FormControl(data ? data.level2_image : false),
      level3_image: new FormControl(data ? data.level3_image : false),
      level3_items_spacing: new FormControl(data ? data.level3_items_spacing : '20px'),
      menu_padding: new FormControl(data ? data.menu_padding : '2rem'),
      level1_image_dimentions: new FormControl(data ? data.level1_image_dimentions : '300px'),
      fixed_width: new FormControl(data ? data.fixed_width : '30%'),
    })
  }

  selectHeader(data = null, index = null) {
    this.selectedHeader = data;
    this.selectedGroup = null;
    this.selectedSubcategory = null;
    this.editorType = 1;
    this.updateIndexHeader = index;
    this.updateIndexGroup = null;
    this.updateIndexSubCategory = null;
    this.setHeaderForm(data);
  }

  setGroupForm(data = null) {
    this.groupForm = new FormGroup({
      link: new FormControl(data ? data.link : ''),
      name: new FormControl(data ? data.name : '', Validators.required),
      name_ar: new FormControl(data ? data.name_ar : '', Validators.required),
      image: new FormControl(data ? data.image : ''),
    })
  }

  selectGroup(data = null, index = null) {
    this.selectedGroup = data;
    this.selectedSubcategory = null;
    this.editorType = 2;
    this.updateIndexGroup = index;
    this.updateIndexSubCategory = null;
    this.setGroupForm(data);
  }

  setSubCategoryForm(data = null) {
    this.subCategoryForm = new FormGroup({
      link: new FormControl(data ? data.link : ''),
      name: new FormControl(data ? data.name : '', Validators.required),
      name_ar: new FormControl(data ? data.name_ar : '', Validators.required),
      image: new FormControl(data ? data.image : ''),
    })
  }

  selectSubCategory(data = null, index = null) {
    this.selectedSubcategory = data;
    this.editorType = 3;
    this.updateIndexSubCategory = index;
    this.setSubCategoryForm(data);
  }

  ngOnInit() {
    this.menuService.getMenu().subscribe(res => {
      if (res.code === 200) {
        this.formattedJson = JSON.parse(res.data);
        localStorage.setItem('formattedJsonString', JSON.stringify(this.formattedJson));
        this.formattedJsonString = `${localStorage.getItem('formattedJsonString')}`;
        this.updateColorsTest();
      } else {
        if (localStorage.getItem('formattedJsonString')) {
          this.formattedJson = JSON.parse(localStorage.getItem('formattedJsonString'));
          this.formattedJsonString = `${localStorage.getItem('formattedJsonString')}`;
          this.updateColorsTest();
        }
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.prettyPrint()
    }, 1000);
  }

  navigateToLink(url) {
    window.open(url, '_blank')
  }

  prettyPrint(save = null) {
    var element = <HTMLTextAreaElement>document.getElementById('formattedJsonString')
    var ugly = element.value;
    if (ugly) {
      var obj = JSON.parse(ugly);
      if (obj) {
        this.formattedJson = obj;
      } else {
        this.formattedJson = {}
      }
      var pretty = JSON.stringify(obj, undefined, 4);
      element.value = pretty;
    }
    if (save) {
      this.updating = true;
      this.menuService.updateMenu({ menu: this.formattedJsonString }).subscribe((res => {
        if (res.code === 200) {
          this.toastrService.success('menu updated successfuly');
        } else {
          this.toastrService.error(res.message);
        }
        this.statedeleting = false;
        this.updating = false;
      }))
    }
    this.saveChanges();
  }

  updateColorsTest() {
    this.formattedJson['menu_background_color'] ? document.documentElement.style.setProperty('--dynamic-menu-background-color', this.formattedJson['menu_background_color']) : document.documentElement.style.setProperty('--dynamic-menu-background-color', '--second-color');
    this.formattedJson['drop_menu_background_color'] ? document.documentElement.style.setProperty('--dynamic-drob-down-menu-background-color', this.formattedJson['drop_menu_background_color']) : document.documentElement.style.setProperty('--dynamic-drob-down-menu-background-color', 'white');
    this.formattedJson['level1_text_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-1-color', this.formattedJson['level1_text_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-1-color', 'white');
    this.formattedJson['level1_hover_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-1-hover-color', this.formattedJson['level1_hover_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-1-hover-color', '--menu-font-hover-color');
    this.formattedJson['level2_text_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-2-color', this.formattedJson['level2_text_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-2-color', '--menu-font-hover-color');
    this.formattedJson['level2_hover_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-2-hover-color', this.formattedJson['level2_hover_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-2-hover-color', 'black');
    this.formattedJson['level3_text_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-3-color', this.formattedJson['level3_text_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-3-color', 'black');
    this.formattedJson['level3_hover_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-3-hover-color', this.formattedJson['level3_hover_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-3-hover-color', '--menu-font-hover-color');

    this.saveChanges();
  }

  checkColorValidity(color, colorName) {
    if (color.substring(0, 1) == '#') {
      this.updateColorsTest()
    } else {
      color = `#${color}`;
      this.formattedJson[colorName] = color;
      this.updateColorsTest();
    }
  }

  uploadImage(image, e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.uploadService.uploadFile(file).subscribe((response: any) => {
        if (response.body) {
          image.setValue(response.body.data.filePath);
        }
      });
    }
  }

  saveChanges() {
    localStorage.setItem('formattedJsonString', JSON.stringify(this.formattedJson));
    this.formattedJsonString = `${localStorage.getItem('formattedJsonString')}`;
    this.statedeleting = false;
    this.updating = false;
  }

  saveHeader() {
    if (this.headerForm.valid) {
      this.updating = true;
      this.selectedHeader = this.headerForm.value;
      if (this.updateIndexHeader != null) {
        let dumbLevel2 = this.formattedJson.level1[this.updateIndexHeader].level2;
        this.formattedJson.level1[this.updateIndexHeader] = this.selectedHeader;
        this.formattedJson.level1[this.updateIndexHeader].level2 = dumbLevel2;
      } else {
        this.formattedJson.level1.push(this.selectedHeader);
        this.formattedJson.level1[this.formattedJson.level1.length - 1].level2 = [];
        this.updateIndexHeader = this.formattedJson.level1.length - 1;
      }
      this.saveChanges();
    }
  }

  saveGroup() {
    if (this.groupForm.valid) {
      this.updating = true;
      this.selectedGroup = this.groupForm.value;
      if (this.updateIndexHeader != null && this.updateIndexGroup != null) {
        let dumbLevel3 = this.formattedJson.level1[this.updateIndexHeader].level2[this.updateIndexGroup].level3;
        this.formattedJson.level1[this.updateIndexHeader].level2[this.updateIndexGroup] = this.selectedGroup;
        this.formattedJson.level1[this.updateIndexHeader].level2[this.updateIndexGroup].level3 = dumbLevel3;
      } else {
        this.formattedJson.level1[this.updateIndexHeader].level2.push(this.selectedGroup);
        this.formattedJson.level1[this.updateIndexHeader].level2[this.formattedJson.level1[this.updateIndexHeader].level2.length - 1].level3 = [];
        this.updateIndexGroup = this.formattedJson.level1[this.formattedJson.level1.length - 1].level2.length - 1;
      }
      this.saveChanges();
    }
  }

  saveSubCategory() {
    if (this.subCategoryForm.valid) {
      this.updating = true;
      this.selectedSubcategory = this.subCategoryForm.value;
      if (this.updateIndexHeader != null && this.updateIndexGroup != null && this.updateIndexSubCategory != null) {
        this.formattedJson.level1[this.updateIndexHeader].level2[this.updateIndexGroup].level3[this.updateIndexSubCategory] = this.selectedSubcategory;
      } else {
        this.formattedJson.level1[this.updateIndexHeader].level2[this.updateIndexGroup].level3.push(this.selectedSubcategory)
      }
      this.saveChanges();
    }
  }

  deleteItem(index, event, item, type) {
    $('#deleteMenuItem').modal('show');
    this.statedeleting = false;
    event.preventDefault();
    this.deleteItemIndex = index;
    this.deleteItemName = item.name;
    this.deleteItemType = type;
  }

  confirmDelete() {
    this.statedeleting = true;
    if (this.deleteItemType == 1) {
      this.deleteHeader();
    } else if (this.deleteItemType == 2) {
      this.deleteGroup();
    } else {
      this.deleteSubCategory();
    }
    $('#deleteMenuItem').modal('hide');
  }

  deleteHeader() {
    if (this.deleteItemIndex == this.updateIndexHeader) {
      this.selectedHeader = null;
    }
    this.formattedJson.level1.splice(this.deleteItemIndex, 1);
    this.saveChanges();
  }

  deleteGroup() {
    if (this.deleteItemIndex == this.updateIndexGroup) {
      this.selectedGroup = null;
    }
    this.formattedJson.level1[this.updateIndexHeader].level2.splice(this.deleteItemIndex, 1);
    this.saveChanges();
  }

  deleteSubCategory() {
    if (this.deleteItemIndex == this.updateIndexSubCategory) {
      this.selectedSubcategory = null;
    }
    this.formattedJson.level1[this.updateIndexHeader].level2[this.updateIndexGroup].level3.splice(this.deleteItemIndex, 1);
    this.saveChanges();
  }
}
