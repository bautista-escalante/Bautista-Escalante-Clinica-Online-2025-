import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agregarMayuscula'
})
export class AgregarMayusculaPipe implements PipeTransform {

  transform(value: any): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}