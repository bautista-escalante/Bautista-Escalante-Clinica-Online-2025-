import { Injectable } from '@angular/core';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { HistoriaService } from './historia.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private historiaClinicaService: HistoriaService) { }

  async generarPdfHistoria() {
    let historial = await this.historiaClinicaService.traerHistoriaClinica();

    const turnosUnicos = historial!.reduce((acc: any[], item: any) => {
      if (!acc.find(t => t.id_turno.id === item.id_turno.id)) {
        acc.push(item);
      }
      return acc;
    }, []);

    const doc = new jsPDF();

    this.convertirImagenABase64('iconos/logo.jpg').then((imagenBase64: string) => {

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(40);
      doc.text('Clinica Online', 50, 35, { align: 'center' });
      doc.addImage(imagenBase64, 'JPEG', 165, 10, 40, 40);
      // nombre, apellido, edad,
      // temp, presion, fecha, especialidad,
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(20);

      // datos del paciente
      doc.text(`${historial![0].id_turno.id_paciente.nombre} ${historial![0].id_turno.id_paciente.apellido}`, 5, 70);
      doc.text(`${historial![0].id_turno.id_paciente.edad} años`, 5, 78);
      doc.text(`${historial![0].id_turno.id_paciente.obra_social}`, 5, 86);

      // ficha por cada turno
      let y = 100;

      turnosUnicos.forEach(turno => {
        doc.text(new Date(turno.created_at).toLocaleString(), 5, y);
        y += 10;
        doc.text(`Consulta con ${turno.id_turno.id_especialista.especialidades}`, 5, y);
        y += 10;
        doc.text(`Altura: ${turno.altura} cm`, 5, y);
        y += 10;
        doc.text(`Presión: ${turno.presion}`, 5, y);
        y += 10;
        doc.text(`Temperatura: ${turno.temperatura} grados`, 5, y);
        y += 10;

        const dinamicos = historial!.filter(r => r.id_turno.id === turno.id_turno.id && r.campo_dinamico !== null);
        dinamicos.forEach(dato => {
          doc.text(`${dato.campo_dinamico}: ${dato.valor_dinamico}`, 5, y);
          y += 10;
        });

        y += 10;
      });

      doc.text(new Date(historial![0].created_at).toLocaleString(), 5, 100);
      doc.text(`consulta con ${historial![0].id_turno.id_especialista.especialidades}`, 5, 110)
      doc.text(`altura: ${historial![0].altura} cm`, 5, 120);
      doc.text(`presion: ${historial![0].presion}`, 5, 130);
      doc.text(`temperatura: ${historial![0].temperatura} grados`, 5, 140);


      //doc.save(`historia clinica ${historial![0].id_turno.id_paciente.nombre}`);
    });
  }

  convertirImagenABase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg');
          resolve(dataURL);
        } else {
          reject('No se pudo obtener el contexto del canvas');
        }
      };
      img.onerror = (err) => reject(err);
    });
  }
}
