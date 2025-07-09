import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { AccesoService } from '../servicios/acceso.service';
import { UsuarioService } from '../servicios/usuario.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2';
import { HistoriaService } from '../servicios/historia.service';
import { TurnoService } from '../servicios/turno.service';
import { FechaLocalPipe } from '../pipes/fecha-local.pipe'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seccion-paciente',
  imports: [CommonModule, FechaLocalPipe, FormsModule, RouterLink],
  templateUrl: './seccion-paciente.component.html',
  styleUrl: './seccion-paciente.component.css'
})
export class SeccionPacienteComponent implements OnInit {

  pacientes: any = [];
  datosUsuario: any = "";
  perfil: string = "";
  estaCargando = false;
  turnosAnteriores: any = [];
  turnosPorPaciente: any = [];
  @ViewChild('tablaTurnos', { static: false }) tablaTurnosElem!: ElementRef<HTMLTableElement>;
  
  constructor(private turnoService: TurnoService, private historiaService: HistoriaService, private route: Router, private especialistaService: EspecialistaService, private acceso: AccesoService, private usuarioService: UsuarioService) { }

  async ngOnInit() {

    this.perfil = await this.acceso.obtenerPerfil();
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuarioService.getUserByEmail(correo!);

    if (this.perfil === "especialista") {
      this.especialistaService.traerPacientesAtendidos(this.datosUsuario.mail).then((paciente: any) => {
        this.pacientes = Array.from(new Set(paciente));
        paciente.forEach((p: any) => {

          this.turnoService.traerUltimosTresTurnos(p.id_paciente.id).then((turno: any) => {
            this.turnosAnteriores = turno;
          });
        });
      })
    }

    if (this.perfil === "admin") {
      this.pacientes = await this.usuarioService.traerPacientes();
    }
    this.estaCargando = true;
  }

  descargarExcel() {
    const data = document.getElementById('data') as HTMLTableElement;
    const rows = Array.from(data.rows);

    const newTable = document.createElement('table');

    rows.forEach(row => {
      const newRow = document.createElement('tr');
      Array.from(row.cells).forEach((cell, index) => {

        if (index !== 5 && index !== 4) {
          const newCell = cell.cloneNode(true);
          newRow.appendChild(newCell);
        }
      });
      newTable.appendChild(newRow);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(newTable);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
    XLSX.writeFile(wb, 'pacientes.xlsx');
  }


  async irHistoriaClinica(id: number) {
    let ultimoTurno = await this.turnoService.traerUltimoTurno(id);

    if (ultimoTurno && ultimoTurno.length > 0) {
      if (await this.historiaService.historiaClinicaExiste(ultimoTurno[0].id)) {
        Swal.fire("no tenes historia clinica aun", "", "error");
        return;
      }
      this.route.navigate([`/pdfHistoria/${id}`]);
    } else {
      Swal.fire("esta paciente no historia clinica aun", "", "error");
    }
  }

  async descargarDatos(id: number) {
    this.turnosPorPaciente = await this.turnoService.traerTurnosPaciente(id)
    if (this.turnosPorPaciente.length == 0) {
      Swal.fire("este paciente no tiene turno aun");
      return;
    }

    this.estaCargando = false;

    setTimeout(() => {

      const tabla = this.tablaTurnosElem.nativeElement;
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'turnos');

      XLSX.writeFile(wb, 'turnos.xlsx');

      this.turnosPorPaciente = [];
      this.estaCargando = true;
    }, 3000);
  }

}