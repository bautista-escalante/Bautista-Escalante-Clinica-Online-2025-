import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { TurnoService } from '../servicios/turno.service';
import { EspecialistaService } from '../servicios/especialista.service';
import { RegistroService } from '../servicios/registro.service';
import { FechaLocalPipe } from '../pipes/fecha-local.pipe';
import * as XLSX from 'xlsx'
import { RouterLink } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, FechaLocalPipe, RouterLink],
  standalone: true,
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {

  colores = ['#007acc', '#36A2EB', '#4BC0C0', '#9966FF', '#8BC34A', '#00BCD4', '#9C27B0'];
  registros: any = [];
  estaCargando = true;
  turnosDia: any = [];
  cantidadesPorEspecialidad: any = [];
  especialidades: string[] = [];
  apellidosEspecialistas: string[] = [];
  cantFinalizados: number[] = [];
  cantsolicitados: number[] = [];

  constructor(
    private turno: TurnoService,
    private especialistaService: EspecialistaService,
    private registroService: RegistroService
  ) { }

  async ngOnInit() {
    this.registros = await this.registroService.traerRegistro();
    await this.cargarDatos();
    this.estaCargando = false;

    setTimeout(() => this.graficar(), 0);
  }

  descargarExcel() {
    const data = document.getElementById('data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');

    XLSX.writeFile(wb, 'registro_ingreso.xlsx');
  }

  graficar() {
    this.ChartBarOrLine(this.turnosDia, "cantTurnosDia", ["ayer", "hoy", "mañana"], "cantTurnosDia", "bar");

    this.ChartPie(this.cantidadesPorEspecialidad, this.especialidades, "cantEspecialidad", "cantidad de turnos popr especialidad")

    this.ChartPie(this.cantFinalizados, this.apellidosEspecialistas, "cantfinalizados", " Cantidad de turnos finalizados por médico")

    this.ChartBarOrLine(this.turnosDia, "cantSolicitados", this.apellidosEspecialistas, "cantTurnosDia", "line");
  }

  async cargarDatos() {

    this.especialidades = await this.especialistaService.traerEspecialidadesExistentes();
    for (const especialidad of this.especialidades) {
      const cantidad = await this.turno.traerCantidadPorEspecialidad(especialidad);
      this.cantidadesPorEspecialidad.push(cantidad);
    }


    const hoy = new Date();
    let fechas = [
      new Date(hoy.getFullYear(), hoy.getMonth(), (hoy.getDate() - 1)),
      new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
      new Date(hoy.getFullYear(), hoy.getMonth(), (hoy.getDate() + 1))
    ]
    for (const f of fechas) {
      const turnoDia = await this.turno.traerTurnosPorDia(f);
      this.turnosDia.push(turnoDia);
    }


    let especialistas = await this.especialistaService.traerEspecialistasExistentes();
    for (const esp of especialistas!) {
      const cant = await this.especialistaService.traerCantidadFinalizados(esp.id);
      this.cantFinalizados.push(cant);
      this.apellidosEspecialistas.push(`${esp.apellido}, ${esp.especialidades}`);
    }


    for (const esp of especialistas!) {
      const cant = await this.especialistaService.traerturnosSolicitados(esp.id);
      this.cantsolicitados.push(cant);
      this.apellidosEspecialistas.push(`${esp.apellido}, ${esp.especialidades}`);
    }
  }

  ChartPie(data: any[], labels: string[], canvasId: string, titulo: string) {

    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: titulo,
          data,
          backgroundColor: this.colores,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#000000', // texto negro para fondo claro
              font: {
                size: 14,
                weight: 'bold',
              }
            }
          }
        }
      }
    });
  }

  ChartBarOrLine(data: number[], canvasId: string, labels: string[], titulo: string, tipo: 'bar' | 'line' = 'bar') {

    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: tipo,
      data: {
        labels,
        datasets: [{
          label: titulo,
          data,
          backgroundColor: tipo === 'bar'
            ? labels.map((_, i) => this.colores[i % this.colores.length])
            : 'transparent',
          borderColor: tipo === 'line' ? this.colores[0] : undefined,
          borderWidth: 3,
          fill: false,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff', // leyenda
              font: {
                size: 14,
                weight: 'bold',
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff', // eje x
              font: {
                size: 12,
              }
            }
          },
          y: {
            ticks: {
              color: '#ffffff', // eje y
              font: {
                size: 12,
              }
            },
            beginAtZero: true,
            max: data.length > 0 ? data.length : 1
          }
        }
      }
    });
  }


  exportarPDF() {
    const data = document.getElementById('graficos');
    if (!data) return;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('reporte-turnos.pdf');
    });
  }

}