import { animate, AnimationBuilder, style } from '@angular/animations';
import { Directive, ElementRef, HostListener, inject, OnChanges, Input, SimpleChanges, } from '@angular/core';

@Directive({
  selector: '[appAnimacionError]',
  standalone: true
})
export class AnimacionErrorDirective implements OnChanges {

  @Input("appAnimacionError") activar = false;

  constructor() { }

  elementRef: ElementRef = inject(ElementRef);
  builder: AnimationBuilder = inject(AnimationBuilder);

  private jugador = this.builder.build([
    style({ transform: "rotate(0deg)" }),
    animate("100ms", style({ transform: "rotate(-5deg)" })),
    animate("100ms", style({ transform: "rotate(5deg)" })),
    animate("100ms", style({ transform: "rotate(-5deg)" })),
    animate("100ms", style({ transform: "rotate(5deg)" })),
    animate("100ms", style({ transform: "rotate(-5deg)" })),
    animate("100ms", style({ transform: "rotate(5deg)" })),
    animate("100ms", style({ transform: "rotate(0deg)" }))
  ]).create(this.elementRef.nativeElement);


  ngOnChanges(changes: SimpleChanges) {
    if (changes['activar']) {
      changes['activar'].currentValue ? this.iniciarAnimation() : this.pausarAnimacion();
    }
  }

  private iniciarAnimation() {
    this.jugador.play();
    this.jugador.onDone(() => {
      this.jugador.reset();
      this.jugador.play();
    })
  }

  private pausarAnimacion() {
    if (this.jugador) {
      this.jugador.pause();
      this.jugador.reset();
    }
  }
}
