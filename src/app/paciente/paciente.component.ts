import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../servicios/turno.service';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { EspecialistaService } from '../servicios/especialista.service';
import Swal from 'sweetalert2'
import { Route, RouterLink } from '@angular/router';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent implements OnInit {

  turnos: any[] = [];
  especialidades: string[] = [];
  input: string = ""
  datosUsuario: any = "";
  error: string = ""

  constructor(
    private especialistaService: EspecialistaService,
    private turnoservice: TurnoService,
    private usuario: UsuarioService,
    private acceso: AccesoService
  ) {
  }
  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuario.getUserByEmail(correo!);
    this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
    this.especialidades = await this.especialistaService.traerEspecialidadesExistentes();
  }


 

  async filtar() {
    this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
    this.turnos = this.turnos.filter(turno =>
      turno.id_especialista?.especialidades?.toLowerCase().includes(this.input.trim().toLowerCase()));

    if (this.turnos.length == 0) {

      this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
      this.turnos = this.turnos.filter(turno =>
        turno.id_especialista?.apellido?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {

      this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
      this.turnos = this.turnos.filter(turno =>
        turno.id_especialista?.nombre?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {
      this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
      this.error = `no se encontraron turnos relacionado a ${this.input}`
    }
  }

  async verResenia(id: number) {
    let reseña = await this.turnoservice.traerResenia(id);
    await Swal.fire({ title: reseña });
  }

  async cambiarEstado(estado: string, id: number) {
    await this.turnoservice.cambiarEstado(estado, id)
    this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
  }

  async cancelarTurno(id: number) {
    const { value: mensaje } = await Swal.fire({
      input: "textarea",
      inputPlaceholder: "escribe la razon",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });

    if (mensaje) {
      await this.turnoservice.cambiarEstadoConRazon(mensaje, id)
      this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
    } else {
      await Swal.fire({ title: "error, se necesita un comentario" });
    }
  }

  async Calificar(id: number) {
    let { value: calificacion } = await Swal.fire({
      input: "number",
      inputPlaceholder: "ingrese un numero del 1 al 5 indicando tu nivel de conformidad",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });

    try {
      if (calificacion) {
        calificacion = parseInt(calificacion)
        if (calificacion >= 1 && calificacion <= 5) {
          let { value: comentario } = await Swal.fire({
            input: "text",
            inputPlaceholder: "ingrese un comentario sobre su consulta (opcional)",
            inputAttributes: {
              "aria-label": "Type your message here"
            },
            showCancelButton: true
          });

          await this.turnoservice.calificar(calificacion, id, comentario)
          await Swal.fire({ title: "calirficacion guardada con exito", icon: "success" });
        } else {
          throw new Error("La calificación debe estar entre 1 y 5");
        }
      } else {
        throw new Error("se necesita una calificacion");
      }
    } catch (error: any) {
      await Swal.fire({ title: error.message, icon: "warning" });
    }
  }
}
