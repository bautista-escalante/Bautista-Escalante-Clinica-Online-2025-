import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';
import { AccesoService } from '../servicios/acceso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: any = "";

  constructor(private usuarioService: UsuarioService, private acceso: AccesoService) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.usuario = await this.usuarioService.getUserByEmail(correo!)
    console.log(this.usuario)
  }

}
