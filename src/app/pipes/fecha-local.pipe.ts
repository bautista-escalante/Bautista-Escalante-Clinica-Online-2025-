import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLocal'
})
export class FechaLocalPipe implements PipeTransform {

  transform(fecha: any,) {
    const f = new Date(fecha);

    const dia = f.getDate().toString().padStart(2, "0");
    const mes = (f.getMonth() + 1).toString().padStart(2, "0");
    const año = f.getFullYear().toString()
    const min = f.getMinutes().toString().padStart(2, "0");

    let hora = f.getHours() - 3;
    if (hora < 0) hora += 24;
    const horaFormateada = hora.toString().padStart(2, "0")

    return `${dia}/${mes}/${año} ${horaFormateada}:${min}`;
  }

}
