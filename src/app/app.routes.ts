import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import("./login/login.component").then(c => c.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import("./registro/registro.component").then(c => c.RegistroComponent)
  },
  {
    path: 'bienvenido',
    loadComponent: () => import("./bienvenido/bienvenido.component").then(c => c.BienvenidoComponent),
  },
  {
    path: 'seleccionUsuario',
    loadComponent: () => import("./seccion-usuario/seccion-usuario.component").then(c => c.SeccionUsuarioComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
