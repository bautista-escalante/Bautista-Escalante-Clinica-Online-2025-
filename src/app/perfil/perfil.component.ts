import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { CommonModule } from '@angular/common';
import { PdfService } from '../servicios/pdf.service';
import { TurnoService } from '../servicios/turno.service';
import Swal from 'sweetalert2';
import { HistoriaService } from '../servicios/historia.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { EspecialistaService } from '../servicios/especialista.service';
@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
  animations: [

    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PerfilComponent implements OnInit {
  usuario: any = [];
  especialidades: any = [];

  constructor(private especialidadService:EspecialistaService,private historiaService: HistoriaService, private router: Router, private usuarioService: UsuarioService, private turnoService: TurnoService, private acceso: AccesoService) { }

  async ngOnInit() {
    console.log(this.usuario.length)
    let correo = await this.acceso.verificarAcceso();
    this.usuario = await this.usuarioService.getUserByEmail(correo!);
    this.especialidades = await this.especialidadService.traerEspecialidades(correo!);
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
