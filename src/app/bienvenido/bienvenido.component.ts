import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../servicios/supabase.service';
import { AccesoService } from '../servicios/acceso.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-bienvenido',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent implements OnInit {
  mensajeError = "";
  estalogeado: any = false;
  usuario: any = "";

  constructor(
    private acceso: AccesoService,
    private supabase: SupabaseService,
    private user: UsuarioService
  ) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    this.usuario = await this.user.getUserByEmail(correo!)
    console.log(this.usuario.perfil!)
  }

  async cerrarSesion() {
    try {
      await this.acceso.salir();
      this.estalogeado = await this.acceso.verificarAcceso();
      return;

    } catch (error: any) {
      this.mensajeError = error.message
      return { data: null, error: error };
    }
  }

}