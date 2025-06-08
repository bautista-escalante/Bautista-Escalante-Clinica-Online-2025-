import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../servicios/turno.service';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { EspecialistaService } from '../servicios/especialista.service';
import { HorariosService } from '../servicios/horarios.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css'
})
export class PacienteComponent implements OnInit {
  turnos: any[] = [];
  mostrarTurnos: boolean = true;
  especialidad: string = "";
  fechaHora: Date = new Date();
  especialidades: string[] = [];
  horarios: any[] = [];
  especialistas: any = "";
  doctor: any = "";
  input: string = ""
  datosUsuario: any = "";
  error: string = ""

  constructor(
    private especialistaService: EspecialistaService,
    private horariosService: HorariosService,
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

  verFormulario() {
    this.mostrarTurnos = !this.mostrarTurnos;
  }

  async definirEspecialidad(especialidad: string) {
    this.especialidad = especialidad;
    this.especialistas = await this.especialistaService.traerEspecialistas(especialidad);
  }

  cambiarFoto(evento: any) {
    (evento.target as HTMLImageElement).src = 'especialidades/default.png';
  }

  async definirDoctor(id: string) {
    this.especialistas.length = 0;
    this.doctor = await this.especialistaService.traerEspecialistaPorId(id);
    this.horarios = await this.horariosService.traerHorarioisDisponibles(id);
  }

  async definirHorario(fechaHora: Date) {
    /* 
    # marcar el horario como ocupado 
    # agregar el turno vinculando el especialista con el cliente (idActual)
    # informar al paciente que se realizo con exito
    */
    await this.horariosService.tomarHorario(this.datosUsuario.id);
    await this.turnoservice.agregarTurno(this.datosUsuario.id, this.doctor.id, fechaHora);
    Swal.fire({
      title: "turno solicitado con exito",
      icon: "success",
      draggable: true
    });

    this.turnos = await this.turnoservice.traerTurnos(this.datosUsuario.id);
    this.doctor = "";
    this.mostrarTurnos = true;
    this.especialistas.length = 0;
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
      this.error = `no se encontraron turnos relacionado a ${this.input}`
    }
  }
}
