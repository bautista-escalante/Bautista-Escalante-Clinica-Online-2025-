import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../servicios/turno.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private turnoservice: TurnoService) {

  }
  async ngOnInit() {
    this.turnos = await this.turnoservice.traerTurnos();
  }

  verFormulario() {
    this.mostrarTurnos = !this.mostrarTurnos;
  }



}
