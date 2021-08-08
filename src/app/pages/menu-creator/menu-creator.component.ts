import { Component, OnInit, AfterViewInit } from '@angular/core';

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
        "menu_padding":"2rem",
        "level1_image_dimentions": "300px",
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

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('formattedJsonString')) {
      this.formattedJson = JSON.parse(localStorage.getItem('formattedJsonString'));
      this.formattedJsonString = `${localStorage.getItem('formattedJsonString')}`;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.prettyPrint()
    }, 1000);
  }

  navigateToLink(link) {

  }

  prettyPrint() {
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
    localStorage.setItem('formattedJsonString', JSON.stringify(this.formattedJson))
  }

  updateColorsTest() {
    this.formattedJson['menu_background_color'] ? document.documentElement.style.setProperty('--dynamic-menu-background-color', this.formattedJson['menu_background_color']) : document.documentElement.style.setProperty('--dynamic-menu-background-color', '--second-color')
    this.formattedJson['drop_menu_background_color'] ? document.documentElement.style.setProperty('--dynamic-drob-down-menu-background-color', this.formattedJson['drop_menu_background_color']) : document.documentElement.style.setProperty('--dynamic-drob-down-menu-background-color', 'white')
    this.formattedJson['level1_text_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-1-color', this.formattedJson['level1_text_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-1-color', 'white')
    this.formattedJson['level1_hover_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-1-hover-color', this.formattedJson['level1_hover_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-1-hover-color', '--menu-font-hover-color')
    this.formattedJson['level2_text_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-2-color', this.formattedJson['level2_text_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-2-color', '--menu-font-hover-color')
    this.formattedJson['level2_hover_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-2-hover-color', this.formattedJson['level2_hover_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-2-hover-color', 'black')
    this.formattedJson['level3_text_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-3-color', this.formattedJson['level3_text_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-3-color', 'black')
    this.formattedJson['level3_hover_color'] ? document.documentElement.style.setProperty('--dynamic-menu-level-3-hover-color', this.formattedJson['level3_hover_color']) : document.documentElement.style.setProperty('--dynamic-menu-level-3-hover-color', '--menu-font-hover-color')
  }
}
