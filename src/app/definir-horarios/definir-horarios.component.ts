import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EspecialistaService } from '../servicios/especialista.service';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { HorariosService } from '../servicios/horarios.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-definir-horarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './definir-horarios.component.html',
  styleUrl: './definir-horarios.component.css',
  standalone: true
})
export class DefinirHorariosComponent implements OnInit {

  especialidad: string = "";
  duracion: any = 30;
  horaInicio: any = "";
  horaFin: any = "";
  especialidades: any = "";
  id = ""

  constructor(private especialistaService: EspecialistaService,
    private acceso: AccesoService, private horarioService: HorariosService,
    private usuarioService: UsuarioService
  ) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.especialidades = await this.especialistaService.traerEspecialidades(correo!);
    let usuario = await this.usuarioService.getUserByEmail(correo!);
    this.id = usuario.id;
  }

  async verificar() {

    if (!this.especialidad || !(this.especialidades.includes(this.especialidad))) {
      throw new Error("la especialidad ingresada no se encontrada en tu perfil");
    }
    if (this.duracion > 60 || this.duracion < 5) {
      throw new Error("duracion invalida");
    }
    if (!this.horaInicio || this.horaInicio < 800) {
      throw new Error("horario de inicio inválido");
    }
    if (!this.horaFin || this.horaFin > 1900) {
      throw new Error("horario de fin inválido");
    }
    if (this.horaFin < this.horaInicio) {
      throw new Error("rango horario inválido");
    }
  }


  async definirHorario() {
    try {
      await this.verificar();
      let cantidadTurnos = this.calcularTurnos((this.horaFin - this.horaInicio));

      for (let i = 0; i <= cantidadTurnos; i++) {
        let horario = this.calcularHorario(i)
        console.log(horario)
        this.horarioService.agregarHorario(this.id, horario, this.duracion, this.especialidad)
      }
    } catch (error: any) {
      Swal.fire("ERROR", error.message, 'warning');
    }
  }

  calcularHorario(i: number): string {
    let horaInicioEnMinutos = Math.floor(this.horaInicio / 100) * 60 + (this.horaInicio % 100);
    let minutosTotales = horaInicioEnMinutos + (this.duracion * i);

    let hora = Math.floor(minutosTotales / 60);
    let minutos = minutosTotales % 60;
    console.log(hora, minutos)

    let horaStr = hora.toString().padStart(2, '0');
    let minStr = minutos.toString().padStart(2, '0');

    return `${horaStr}:${minStr}`;
  }

  calcularTurnos(hora: number) {
    let h = Math.floor(hora / 100);
    let m = hora % 100;
    return ((h * 60 + m) / this.duracion);
  }

}
