import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[appLoading]",
})
export class ButtonSpinnerDirective implements OnChanges {
  @Input() appLoading: any;
  image;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.createImage();
    this.hideImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.appLoading) {
      this.el.nativeElement.disabled = true;
      this.showImage();
    } else {
      this.el.nativeElement.disabled = false;
      this.hideImage();
    }
  }

  createImage() {
    this.image = document.createElement("img");
    this.image.src = "./assets/img/Spinner-loading.svg";
    this.image.width = 40;
    this.image.style =
      "position: absolute; top: calc(50% - 20px); left: calc(50% - 20px);";
    this.renderer.appendChild(this.el.nativeElement, this.image);
  }

  hideImage() {
    this.image.hidden = true;
  }

  showImage() {
    this.image.hidden = false;
  }
}
