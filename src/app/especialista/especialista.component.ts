import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistaService } from '../servicios/especialista.service';
import { HorariosService } from '../servicios/horarios.service';
import { TurnoService } from '../servicios/turno.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';

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
}
