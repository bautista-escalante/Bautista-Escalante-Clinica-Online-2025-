import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImgDefault]'
})
export class ImgDefaultDirective {

  constructor(private img: ElementRef) { }
  @HostListener("error")

  onError(){
    this.img.nativeElement.src = "especialidades/default.png"
  }

}
