import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistaService } from '../servicios/especialista.service';
import { HorariosService } from '../servicios/horarios.service';
import { TurnoService } from '../servicios/turno.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialista',
  imports: [FormsModule, CommonModule],
  templateUrl: './especialista.component.html',
  styleUrl: './especialista.component.css'
})
export class EspecialistaComponent implements OnInit {
  input: string = "";
  error: string = "";
  turnos: any[] = [];
  datosUsuario: any = "";

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
    this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
    console.log(this.turnos)
  }

  async filtrar() {
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

  async cambiarEstado(estado: string) {
    await this.turnoservice.cambiarEstado(estado, this.datosUsuario.id)
    this.turnos = await this.turnoservice.traerTurnosEspecialista(this.datosUsuario.id);
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

  async verResenia(id: number) {
    let reseña = await this.turnoservice.traerResenia(id);
    console.log(reseña)
    await Swal.fire({ title: reseña });
  }

}
