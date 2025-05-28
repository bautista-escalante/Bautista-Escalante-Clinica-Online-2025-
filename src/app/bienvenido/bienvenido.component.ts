import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../servicios/supabase.service';
import { AccesoService } from '../servicios/acceso.service';

@Component({
  selector: 'app-bienvenido',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent implements OnInit {
  mensajeError = "";
  estalogeado: any = false;

  constructor(
    private acceso: AccesoService,
    private supabase: SupabaseService,
  ) { }

  async ngOnInit() {
   
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