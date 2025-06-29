import { Directive, HostListener, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Directive({
  selector: '[appLimiteVolumen]'
})
export class LimiteVolumenDirective {
  @Input('appLimiteVolumen') sizeLimit: string | number = 50; // puede ser 50 o '5kb'

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Parseo de valor
    let maxBytes = 50 * 1024 * 1024; // por defecto: 50 MB
    if (typeof this.sizeLimit === 'string') {
      const match = this.sizeLimit.toLowerCase().match(/^(\d+(?:\.\d+)?)(kb|mb)$/);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2];
        maxBytes = unit === 'kb' ? value * 1024 : value * 1024 * 1024;
      }
    } else if (typeof this.sizeLimit === 'number') {
      maxBytes = this.sizeLimit * 1024 * 1024; // número solo = MB
    }

    // Comparación
    if (file.size > maxBytes) {
      Swal.fire({
        title: `Archivo demasiado grande`,
        text: `Límite: ${this.sizeLimit}`,
        icon: "error"
      });
      input.value = '';
    }
  }
}
