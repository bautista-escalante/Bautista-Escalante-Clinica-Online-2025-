import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { AccesoService } from '../servicios/acceso.service';
import { UsuarioService } from '../servicios/usuario.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2';
import { HistoriaService } from '../servicios/historia.service';
import { TurnoService } from '../servicios/turno.service';
@Component({
  selector: 'app-seccion-paciente',
  imports: [CommonModule, RouterLink],
  templateUrl: './seccion-paciente.component.html',
  styleUrl: './seccion-paciente.component.css'
})
export class SeccionPacienteComponent implements OnInit {

  pacientes: any = [];
  datosUsuario: any = "";
  perfil: string = "";
  estaCargando = false;

  constructor(private turnoService: TurnoService, private historiaService: HistoriaService, private route: Router, private especialistaService: EspecialistaService, private acceso: AccesoService, private usuarioService: UsuarioService) { }

  async ngOnInit() {
    setTimeout(() => { this.estaCargando = true; }, 3000);

    this.perfil = await this.acceso.obtenerPerfil();
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuarioService.getUserByEmail(correo!);

    if (this.perfil === "especialista") {
      this.especialistaService.traerPacientesAtendidos(this.datosUsuario.mail).then(pacientes => {
        this.pacientes = Array.from(new Set(pacientes))
      })
      console.log(this.pacientes)
    }
    if (this.perfil === "admin") {
      this.pacientes = await this.usuarioService.traerPacientes();
    }
  }

  descargarExcel() {
    const data = document.getElementById('data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');

    XLSX.writeFile(wb, 'pacientes.xlsx');
  }


  async irHistoriaClinica(id: number) {
    console.log(id)
    let ultimoTurno = await this.turnoService.traerUltimoTurno(id);

    if (ultimoTurno && ultimoTurno.length > 0) {
      if (await this.historiaService.historiaClinicaExiste(ultimoTurno[0].id)) {
        Swal.fire("no tenes historia clinica aun", "", "error");
        return;
      }
      this.route.navigate([`/pdfHistoria/${id}`])
    } else {
      Swal.fire("esta paciente no historia clinica aun", "", "error");
    }
  }

}
