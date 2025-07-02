import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HistoriaService } from '../servicios/historia.service';
import { AgregarMayusculaPipe } from '../pipes/agragar-mayuscula.pipe';
import { FechaLocalPipe } from '../pipes/fecha-local.pipe'
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pdf-historia-clinica',
  imports: [AgregarMayusculaPipe, CommonModule, FechaLocalPipe],
  templateUrl: './pdf-historia-clinica.component.html',
  styleUrl: './pdf-historia-clinica.component.css'
})
export class PdfHistoriaClinicaComponent implements OnInit {

  mostrarBoton = true;
  datos: any = []
  datosPaciente: any = []
  datosEspecialista: any = []
  fechaEmision: Date = new Date();
  id: any = ""

  constructor(private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, private historiaService: HistoriaService, private router: Router) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id_paciente")
  }

  async ngOnInit() {

    this.datos = await this.historiaService.traerHistoriaClinica(this.id);

    this.datosPaciente = this.datos![0].id_turno.id_paciente;
    this.datosEspecialista = this.datos![0].id_turno.id_especialista;
  }

  exportarPDF() {
    this.mostrarBoton = false;
    this.cdr.detectChanges();

    const data = document.getElementById('historia_clinica');
    if (!data) return;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('historia_clinica.pdf');

      this.router.navigate(['/bienvenido']);
    });
  }

}

