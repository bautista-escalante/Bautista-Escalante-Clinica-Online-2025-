import { Component, OnInit } from '@angular/core';
import { EspecialistaService } from '../servicios/especialista.service';
import { AccesoService } from '../servicios/acceso.service';
import { UsuarioService } from '../servicios/usuario.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seccion-paciente',
  imports: [CommonModule, RouterLink],
  templateUrl: './seccion-paciente.component.html',
  styleUrl: './seccion-paciente.component.css'
})
export class SeccionPacienteComponent implements OnInit {

  pacientes: any[] = [];
  datosUsuario: any = "";

  constructor(private especialistaService: EspecialistaService, private acceso: AccesoService, private usuarioService: UsuarioService) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.datosUsuario = await this.usuarioService.getUserByEmail(correo!);
    this.pacientes = await this.especialistaService.traerPacientesAtendidos(this.datosUsuario.id);
    console.log(this.pacientes)
  }

}
