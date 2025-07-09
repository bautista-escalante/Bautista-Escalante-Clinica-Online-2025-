import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx'
import { TurnoService } from '../servicios/turno.service';
import { FechaLocalPipe } from '../pipes/fecha-local.pipe';

@Component({
  selector: 'app-turnos-especialidad',
  imports: [FormsModule, CommonModule, FechaLocalPipe],
  templateUrl: './turnos-especialidad.component.html',
  styleUrl: './turnos-especialidad.component.css'
})
export class TurnosEspecialidadComponent implements OnInit {

  especialidades: any[] = [];
  especialidad: string = "";
  turnos: any = [];

  constructor(
    private especialistaService: EspecialistaService,
    private turnoService: TurnoService
  ) { }

  async ngOnInit() {
    this.especialidades = await this.especialistaService.traerEspecialidadesExistentes();

    await this.cargarTurnos()
  }

  descargarExcel() {
    const data = document.getElementById('data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'turnos');

    XLSX.writeFile(wb, 'turnos.xlsx');
  }

  async cargarTurnos() {
    if(this.especialidad !== "")
    this.turnos = await this.turnoService.traerTurnosPorEspecialidad(this.especialidad);
  }

}
