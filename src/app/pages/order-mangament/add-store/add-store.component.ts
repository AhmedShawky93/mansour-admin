import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var jquery: any;
var close = document.getElementsByClassName("closebtn");
var i;


@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css']
})
export class AddStoreComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    $("input:checkbox").on('click', function () {
      // in the handler, 'this' refers to the box clicked on
      var $box = $(this);
      if ($box.is(":checked")) {
        // the name of the box is retrieved using the .attr() method
        // as it is assumed and expected to be immutable
        var group = "input:checkbox[name='" + $box.attr("name") + "']";
        // the checked state of the group/box on the other hand will change
        // and the current value is retrieved using .prop() method
        $(group).prop("checked", false);
        $box.prop("checked", true);
      } else {
        $box.prop("checked", false);
      }
    });



    $(".owls-time-alert ").on("click", ".closebtn", function () {
      $(this).parent().hide();

    });

    $(".edit-out").hide();
    $("#toggle-edit-out").on("click", function () {
      $(".edit-out").slideToggle(200);
    });

    $(".edit-out .close").on("click", function () {
      $(".edit-out").slideUp(50);
    });


  }

}
