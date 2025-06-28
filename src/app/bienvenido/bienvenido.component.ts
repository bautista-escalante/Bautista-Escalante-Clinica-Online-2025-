import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccesoService } from '../servicios/acceso.service';
import { UsuarioService } from '../servicios/usuario.service';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-bienvenido',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css'],
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
        ])
      ])
    ])
  ],
})
export class BienvenidoComponent implements OnInit {

  mensajeError = "";
  estalogeado: boolean = true;

  getRouteAnimationState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || '';
  }

  constructor(
    private acceso: AccesoService,
    private router: Router,
    private user: UsuarioService
  ) { }

  async ngOnInit() {
    let correo = await this.acceso.verificarAcceso();
    let usuario = await this.user.getUserByEmail(correo!);
    this.estalogeado = !!correo;

    this.router.navigate([`/bienvenido/${usuario.perfil}`]);
  }

  async cerrarSesion() {
    try {
      await this.acceso.salir();
      this.estalogeado = !!(await this.acceso.verificarAcceso());
      this.router.navigate(["/login"])
      return;

    } catch (error: any) {
      this.mensajeError = error.message
      return { data: null, error: error };
    }
  }


}