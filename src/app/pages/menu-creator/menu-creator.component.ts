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
    "level1": [{
      "link": "https://www.mobilaty.com/products?category_id=687",
      "name": "Mobiles",
      "name_ar": "هواتف",
      "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
      "levels_length": 3,
      "level1_image": true,
      "level2_image": true,
      "level3_image": true,
      "level2": [
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "highlighted": true,
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "View more",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
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
    "level1": [{
      "link": "https://www.mobilaty.com/products?category_id=687",
      "name": "Mobiles",
      "name_ar": "هواتف",
      "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
      "levels_length": 3,
      "level1_image": true,
      "level2_image": true,
      "level3_image": true,
      "level2": [
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        },
        {
          "link": "",
          "name": "Operating System",
          "name_ar": "نظام التشغيل",
          "image": "https://mobilatyapi.el-dokan.com/storage/uploads/Ld3YM1-1610147705.jpg",
          "level3": [{
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "Android",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          },
          {
            "highlighted": true,
            "link": "https://www.mobilaty.com/products?category_id=687",
            "name": "View more",
            "name_ar": "اندرويد",
            "image": "https://mobilatyapi.el-dokan.com/storage/uploads/xQIRlC-1610109767.png"
          }]
        }
      ]
    }]
  }`
  clickedItem: boolean = false;

  constructor() { }

  ngOnInit() {
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
