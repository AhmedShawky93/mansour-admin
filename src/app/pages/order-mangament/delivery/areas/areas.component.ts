import { Component, OnInit } from '@angular/core';
import { AreasService } from '@app/pages/services/areas.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/take';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {
  areas : any;
  cities: any;
  searchTerm: any;
  p = 1;
  areas$;
  area : any = {
   name: "",
   city_id: "" 
  };
  id;
  public seclectArea;
  tempArea;
  currentArea : any = {
    id:"",
    name: "",
    city_id: "" 
   };

  //  @ViewChild('newArea') newArea : NgForm;
  newArea;

  constructor(private _areaService : AreasService,
  ) {
  
     
   }
   
  ngOnInit() { 

    $(".open-add").on("click", function () {
      $("#add-area").toggleClass("open-view-vindor-types")
    });

    $(".table").on("click",".open-edit", function () {
      $("#edit-area").toggleClass("open-view-vindor-types")
    })

    $('.switch').on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    
    // for close only
    $("#close-edit-area").on("click", function () {
      $("#edit-area").removeClass("open-view-vindor-types")
    });

    $("#close-add-area").on("click", function () {
      $("#add-area").removeClass("open-view-vindor-types")
    });

    $(".deliverycharge").niceScroll({
      cursorcolor: "#5EA6DB"
    });

    this.getAreas();
    this.getCities();
    
    this.newArea = new FormGroup({
      city_id: new FormControl(this.area.city_id, Validators.required),
      name: new FormControl(this.area.name, Validators.required),
      delivery_fees: new FormControl(0, Validators.required)
    })
    
  }   // ngOnInit
  
  getAreas()
  {
    this._areaService.getAreas()
      .subscribe((response: any) => {
        this.areas = response.data;
        this.areas = this.areas.map(item => {
          item.deactivated = !item.active;
          return item;
        })
      });
  }

  getCities()  {
   this.areas$= this._areaService.getCities()
    .subscribe((response: any) => {
      this.cities = response.data;
    });
  }

 
  addArea(area)
  {
    if(!this.newArea.valid) {
      this.markFormGroupTouched(this.newArea);
      return;
    }
     this._areaService.createAreas(area)
       .subscribe((response: any) => {
          $("#add-area").removeClass("open-view-vindor-types")
          this.areas.push(response.data)
          this.newArea.reset();
       });
  }

  editArea(area) {
    this.currentArea = JSON.parse(JSON.stringify(area));
  }

  updateArea(currentArea) {
    JSON.stringify(this.area)
    this._areaService.updateAreas(currentArea)
      .subscribe((res: any) => {

        let ind = this.areas.findIndex(function (item) {
          
          return item.id == currentArea.id;
          
        });
        $("#edit-area").removeClass("open-view-vindor-types")
        
        this.areas[ind] = res.data;
      })

  }  // updateArea

  // removeArea(area)
  // {
  //   this._areaService.deleteAreas(this.seclectArea.id)
  //      .subscribe(data => {
  //       let index = this.areas.indexOf(this.seclectArea);
  //       this.areas.splice(index, 1);
  //     })
  // }
 

  changeActive(area) {
    this.areas.filter((area) => {
      return area.showReason;
    }).map((area) => {
      if(area.active == area.deactivated) {
        area.active = !area.active;
      }
      area.showReason = 0;
      return area;
    });

    if(area.active) {
      // currently checked
      area.showReason = 0;
      area.notes = "";
      if(area.deactivated) {
        this._areaService.activateArea(area.id)
          .subscribe((data: any) => {
            area.active = 1;
            area.notes = "";
            area.deactivation_notes = "";
            area.deactivated = 0;
          });
      }
      
    }else{
      area.notes = area.deactivation_notes;
      area.showReason = 1;
    }
  }

  cancelDeactivate(area) {
    area.active = 1;
    area.notes = "";
    area.showReason = 0;
  }

  submitDeactivate(area) {
    area.active = 0;
    this._areaService.deactivateArea(area.id, {deactivation_notes: area.notes})
      .subscribe((data: any) => {
        area.active = 0;
        area.deactivation_notes = area.notes;
        area.showReason = 0;
        area.deactivated = 1;
      });
  }

  // validateForm(form) {
  //   Object.keys(form.controls).forEach(field => { // {1}
  //     const control = form.get(field);            // {2}
  //     control.markAsTouched({ onlySelf: true });       // {3}
  //   });
  // }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
