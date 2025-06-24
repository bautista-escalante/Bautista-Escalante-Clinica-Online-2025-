import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { TurnoService } from '../servicios/turno.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { HorariosService } from '../servicios/horarios.service';
import Swal from 'sweetalert2'
import { Router, RouterLink } from '@angular/router';
import { AgregarFechaPipe } from '../pipes/agregar-fecha.pipe';

@Component({
  selector: 'app-solicitar-turno',
  imports: [CommonModule, RouterLink, AgregarFechaPipe],
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
    private horariosService: HorariosService,
    private router: Router) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuario.getUserByEmail(correo!)
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
    this.horarios = [];
    this.especialistas = [];
    this.doctor = await this.especialistaService.traerEspecialistaPorId(id);

    let estaDisponible = false;
    this.horariosService.traerHorariosPorId(id)
      .then(async (horariosTotales) => {
        for (let i = 0; i < horariosTotales.length; i++) {
          estaDisponible = await this.turnoservice.esHorarioDisponible(id, this.calcularDosSemanas(horariosTotales[i].horario))
          console.log(estaDisponible)
          if (estaDisponible) {
            this.horarios.push(horariosTotales[i])
          }
          console.log(horariosTotales[i].horario)
        }
      });
  }

  /*   calcularDosSemanas(hora: Date) {
      let fecha = new Date();
      fecha.setDate(fecha.getDate() + 15);
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getFullYear().toString();
  
      return new Date(`${año}-${mes}-${dia}T${hora}`);
    } */

  calcularDosSemanas(hora: string) {
    const [hh, mm] = hora.split(':').map(n => +n);
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 15);

    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hh, mm);
  }

  async definirHorario(hora: string, id: number) {

    let fechaHora = this.calcularDosSemanas(hora);

    if (this.perfil === "paciente") await this.turnoservice.agregarTurno(this.datosUsuario.id, this.doctor.id, fechaHora);
    if (this.perfil === "admin") await this.turnoservice.agregarTurno(this.paciente, this.doctor.id, fechaHora);

    Swal.fire({
      title: "turno solicitado con exito",
      icon: "success",
      draggable: true
    });

    this.router.navigate(["/bienvenido"])

    this.turnos = await this.turnoservice.traerTurnosPaciente(this.datosUsuario.id);
    this.doctor = "";
    this.mostrarTurnos = true;
    this.especialistas.length = 0;
  }

  async elegirPaciente(idPaciente: number) {
    this.esAdmin = false;
    this.paciente = idPaciente;
  }
}
