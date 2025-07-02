import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { CommonModule } from '@angular/common';
import { PdfService } from '../servicios/pdf.service';
import { TurnoService } from '../servicios/turno.service';
import Swal from 'sweetalert2';
import { HistoriaService } from '../servicios/historia.service';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: any = "";

  constructor(private historiaService: HistoriaService, private router: Router, private usuarioService: UsuarioService, private turnoService: TurnoService, private acceso: AccesoService) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.usuario = await this.usuarioService.getUserByEmail(correo!);
  }

  async descargarHistorial() {
    let ultimoTurno = await this.turnoService.traerUltimoTurno(this.usuario.id);

    if (ultimoTurno && ultimoTurno.length > 0) {
      if (await this.historiaService.historiaClinicaExiste(ultimoTurno[0].id)) {
        Swal.fire("no tenes historia clinica aun", "", "error");
        return;
      }
      this.router.navigate([`/pdfHistoria/${this.usuario.id}`])
    } else {
      Swal.fire("no tenes historia clinica aun", "", "error");
    }
  }

}
