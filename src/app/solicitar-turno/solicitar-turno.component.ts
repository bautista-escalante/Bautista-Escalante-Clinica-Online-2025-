import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { TurnoService } from '../servicios/turno.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { HorariosService } from '../servicios/horarios.service';
import Swal from 'sweetalert2'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitar-turno',
  imports: [CommonModule, RouterLink],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {

  perfil: string = "";
  pacientes: any[] = [];
  paciente: number = 0;
  turnos: any[] = [];
  mostrarTurnos: boolean = true;
  especialidad: string = "";
  fechaHora: Date = new Date();
  especialidades: any[] = [];
  horarios: any[] = [];
  especialistas: any[] = [];
  doctor: any = "";
  input: string = "";
  datosUsuario: any = "";
  esAdmin: boolean = false;

  constructor(private especialistaService: EspecialistaService,
    private turnoservice: TurnoService,
    private usuario: UsuarioService,
    private acceso: AccesoService,
    private horariosService: HorariosService) { }

  async ngOnInit() {
    this.perfil = await this.acceso.obtenerPerfil();
    if (this.perfil == "admin") {
      this.esAdmin = true;
      this.pacientes = await this.usuario.traerPacientes();
    }
    this.especialistaService.traerEspecialidadesExistentes().then(especialidades => {
      this.especialidades = Array.from(new Set(especialidades))
    });
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

  async definirHorario(fechaHora: Date, id: number) {
    /* 
    # marcar el horario como ocupado 
    # agregar el turno vinculando el especialista con el cliente (idActual)
    # informar al paciente que se realizo con exito
    */

    await this.horariosService.tomarHorario(id);
    if (this.perfil === "paciente") await this.turnoservice.agregarTurno(this.datosUsuario.id, this.doctor.id, fechaHora);
    if (this.perfil === "admin") await this.turnoservice.agregarTurno(this.paciente, this.doctor.id, fechaHora);
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

  async elegirPaciente(idPaciente: number) {
    this.esAdmin = false;
    this.paciente = idPaciente;
  }
}
