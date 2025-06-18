import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { HorariosService } from '../servicios/horarios.service';
import { TurnoService } from '../servicios/turno.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit {
  input: string = "";
  error: string = "";
  turnos: any[] = [];
  datosUsuario: any = "";
  perfil: string = "";

  constructor(
    private especialistaService: EspecialistaService,
    private horariosService: HorariosService,
    private turnoservice: TurnoService,
    private usuario: UsuarioService,
    private acceso: AccesoService
  ) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuario.getUserByEmail(correo!);
    this.perfil = this.datosUsuario.perfil;
    if(this.perfil === "paciente"){
      this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
    }
    if(this.perfil === "especialista"){
      this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
    }
    if(this.perfil === "admin"){
      this.turnos = await this.turnoservice.traerTurnos();
    }
  }

  async filtrarPaciente() {
    this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
    this.turnos = this.turnos.filter(turno =>
      turno.id_especialista?.especialidades?.toLowerCase().includes(this.input.trim().toLowerCase()));

    if (this.turnos.length == 0) {

      this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
      this.turnos = this.turnos.filter(turno =>
        turno.id_paciente?.apellido?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {

      this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
      this.turnos = this.turnos.filter(turno =>
        turno.id_paciente?.nombre?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {
      this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
      this.error = `no se encontraron turnos relacionado a ${this.input}`
    }
  }

  async cambiarEstadoConResenia(id: number) {

    const { value: mensaje } = await Swal.fire({
      input: "textarea",
      inputPlaceholder: "escribe una reseña",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });

    if (mensaje) {
      await this.turnoservice.cambiarEstadoConResenia(mensaje, this.datosUsuario.id)
      this.turnos = await this.turnoservice.traerTurnosEspecialista(id);
      console.log(this.turnos)
    } else {
      await Swal.fire({ title: "error, se necesita un comentario" });
    }
  }

  async cambiarEstadoConRazon(estado: string, id: number) {

    const { value: mensaje } = await Swal.fire({
      input: "textarea",
      inputPlaceholder: "escribe la razon",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });

    if (mensaje) {
      await this.turnoservice.cambiarEstadoConRazon(mensaje, this.datosUsuario.id)
      this.turnos = await this.turnoservice.traerTurnosEspecialista(id);
      console.log(this.turnos)
    } else {
      await Swal.fire({ title: "error, se necesita un comentario" });
    }
  }

  async filtrarEspecialista() {
    this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
    this.turnos = this.turnos.filter(turno =>
      turno.id_especialista?.especialidades?.toLowerCase().includes(this.input.trim().toLowerCase()));

    if (this.turnos.length == 0) {

      this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
      this.turnos = this.turnos.filter(turno =>
        turno.id_especialista?.apellido?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {

      this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
      this.turnos = this.turnos.filter(turno =>
        turno.id_especialista?.nombre?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {
      this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
      this.error = `no se encontraron turnos relacionado a ${this.input}`
    }
  }

  async verResenia(id: number) {
    let reseña = await this.turnoservice.traerResenia(id);
    await Swal.fire({ title: reseña });
  }

  async cambiarEstado(estado: string, id: number) {
    await this.turnoservice.cambiarEstado(estado, id)
    this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
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
      this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
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
