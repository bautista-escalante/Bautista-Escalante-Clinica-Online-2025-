import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  estalogeado: boolean = true;

  constructor(
    private acceso: AccesoService,
    private router: Router,
    private user: UsuarioService
  ) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    let usuario = await this.user.getUserByEmail(correo!)
    this.estalogeado = !!correo

    this.router.navigate([`/bienvenido/${usuario.perfil}`]);
  }

  async cerrarSesion() {
    try {
      await this.acceso.salir();
      this.estalogeado = !!(await this.acceso.verificarAcceso());
      console.log(this.estalogeado)
      return;

    } catch (error: any) {
      this.mensajeError = error.message
      return { data: null, error: error };
    }
  }


}