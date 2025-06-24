import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agregarFecha'
})
export class AgregarFechaPipe implements PipeTransform {

  transform(hora: any,) {
    console.log(typeof (hora))
    let dosSemanas = new Date();

    dosSemanas.setDate(dosSemanas.getDate() + 15)
    const dia = dosSemanas.getDate().toString().padStart(2, "0");
    const mes = (dosSemanas.getMonth() + 1).toString().padStart(2, "0");
    const año = dosSemanas.getFullYear().toString();

    return `${dia}/${mes}/${año} ${hora}`;
  }

}
