import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { HorariosService } from '../servicios/horarios.service';
import { TurnoService } from '../servicios/turno.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HistoriaService } from '../servicios/historia.service';

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
    private route: Router,
    private turnoservice: TurnoService,
    private usuario: UsuarioService,
    private acceso: AccesoService,
    private historiaService: HistoriaService
  ) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuario.getUserByEmail(correo!);
    this.perfil = this.datosUsuario.perfil;
    await this.recargarTurnos();
  }

  async filtrarPaciente() {
    this.error = "";
    await this.recargarTurnos();
    this.turnos = this.turnos.filter(turno =>
      turno.id_especialista?.especialidades?.toLowerCase().includes(this.input.trim().toLowerCase()));

    if (this.turnos.length == 0) {

      await this.recargarTurnos()
      this.turnos = this.turnos.filter(turno =>
        turno.id_paciente?.apellido?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {

      await this.recargarTurnos()
      this.turnos = this.turnos.filter(turno =>
        turno.id_paciente?.nombre?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {
      this.turnos = [];
      let turnosFiltrados = await this.historiaService.filtrarPorDinamicos(this.input);

      for (let turnoFiltrado of turnosFiltrados!) {
        let turno = await this.turnoservice.traerTurnosPorId(turnoFiltrado.id_turno);
        this.turnos.push(...turno);
        console.log(this.turnos)
      }
    }
    if (this.turnos.length == 0) {

      await this.recargarTurnos();
      this.error = `no se encontraron turnos relacionado a ${this.input}`
    }
  }

  async cambiarEstadoConMensaje(id: number, estado: string) {

    const { value: mensaje } = await Swal.fire({
      input: "textarea",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true
    });

    if (mensaje) {
      await this.turnoservice.cambiarEstadoConMensaje(estado, mensaje, id)
      await this.recargarTurnos();

    } else {
      await Swal.fire({ title: "error, se necesita un comentario" });
    }
  }

  async filtrarEspecialista() {

    await this.recargarTurnos()
    this.turnos = this.turnos.filter(turno =>
      turno.id_especialista?.especialidades?.toLowerCase().includes(this.input.trim().toLowerCase()));

    if (this.turnos.length == 0) {

      await this.recargarTurnos()
      this.turnos = this.turnos.filter(turno =>
        turno.id_especialista?.apellido?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {

      await this.recargarTurnos()
      this.turnos = this.turnos.filter(turno =>
        turno.id_especialista?.nombre?.toLowerCase().includes(this.input.trim().toLowerCase()));
    }
    if (this.turnos.length == 0) {
      this.turnos = [];
      let turnosFiltrados = await this.historiaService.filtrarPorDinamicos(this.input);

      for (let turnoFiltrado of turnosFiltrados!) {
        let turno = await this.turnoservice.traerTurnosPorId(turnoFiltrado.id_turno);
        this.turnos.push(...turno);
        console.log(this.turnos)
      }
    }
    if (this.turnos.length == 0) {
      await this.recargarTurnos();
      this.error = `no se encontraron turnos relacionado a ${this.input}`
    }
  }

  async verResenia(id: number) {
    let reseña = await this.turnoservice.traerResenia(id);
    await Swal.fire({ title: reseña });
  }

  async cambiarEstado(estado: string, id: number) {
    await this.turnoservice.cambiarEstado(estado, id);
    await this.recargarTurnos();
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

  private async recargarTurnos() {
    if (this.perfil === 'paciente') {
      this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
    } else if (this.perfil === 'especialista') {
      this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.mail);
    } else {
      this.turnos = await this.turnoservice.traerTurnos();
    }
  }

  crearHistoriaClinica(id_turno: string) {
    this.route.navigate([`/historiaClinica/${id_turno}`]);
  }
}
