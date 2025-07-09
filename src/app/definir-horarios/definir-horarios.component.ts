import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { EspecialistaService } from '../servicios/especialista.service';
import { HorariosService } from '../servicios/horarios.service';
import { AccesoService } from '../servicios/acceso.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-definir-horarios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './definir-horarios.component.html',
  styleUrl: './definir-horarios.component.css',
  standalone: true,
  host: { '[@routeAnimation]': '' },
  animations: [
    trigger('routeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(0.68, -0.55, 0.27, 1.55)', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class DefinirHorariosComponent implements OnInit {

  especialidad: string = "";
  duracion: any = "";
  horaInicio: any = "";
  minInicio: any = "";
  horaFin: any = "";
  minFin: any = "";
  especialidades: any = "";
  arrayEspecialidades: Array<string> = []
  id = ""

  constructor(private especialistaService: EspecialistaService,
    private acceso: AccesoService, private horarioService: HorariosService,
  ) { }


  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso()
    this.especialidades = await this.especialistaService.traerEspecialidades(correo!)
    this.arrayEspecialidades.push(...this.especialidades.split(","));
  }

  async verificar() {

    if (!this.especialidad || !(this.especialidades.includes(this.especialidad))) {
      throw new Error("la especialidad ingresada no se encontrada en tu perfil");
    }
    if (this.duracion == "" || this.duracion > 60 || this.duracion < 30) {
      throw new Error("duracion invalida");
    }
    if (!this.horaInicio || this.horaInicio < 8) {
      throw new Error("horario de inicio inválido");
    }
    if (!this.horaFin || this.horaFin > 19) {
      throw new Error("horario de fin inválido");
    }
    if (this.minInicio == "") {
      this.minInicio = 0;
    }
    if (this.minFin == "") {
      this.minFin = 0;
    }

    if (this.minFin > 60 || this.minFin < 0 || this.minInicio > 60 || this.minInicio < 0) {
      throw new Error("minutor invalidos");

    }
    if (this.horaFin < this.horaInicio) {
      throw new Error("rango horario inválido");
    }
  }


  async definirHorario() {
    try {
      let correo = await this.acceso.verificarAcceso();

      await this.verificar();

      let especialista = await this.especialistaService.obtenerEspecialista(correo!, this.especialidad);
      this.id = especialista.id;

      let minTotalesFin = (this.horaFin * 60) + this.minFin;
      let minTotalesInicio = (this.horaInicio * 60) + this.minInicio;
      
      let cantidadTurnos = (minTotalesFin - minTotalesInicio) / this.duracion;

      for (let i = 0; i <= cantidadTurnos; i++) {
        let horario = this.calcularHorario(i)
        
        this.horarioService.agregarHorario(this.id, horario, this.duracion, this.especialidad)
      }

      Swal.fire("datos gurdados", "los horarios fueron agregados", "success");

    } catch (error: any) {
      Swal.fire("ERROR", error.message, 'warning');
    }
  }

  calcularHorario(i: number): string {
    console.log(i)
    let horaInicioEnMinutos = Math.floor(this.horaInicio * 60 + this.minInicio);
    let minutosTotales = horaInicioEnMinutos + (this.duracion * i);

    let hora = Math.floor(minutosTotales / 60);
    let minutos = minutosTotales % 60;
    console.log(hora, minutos)

    let horaStr = hora.toString().padStart(2, '0');
    let minStr = minutos.toString().padStart(2, '0');

    return `${horaStr}:${minStr}`;
  }

}
