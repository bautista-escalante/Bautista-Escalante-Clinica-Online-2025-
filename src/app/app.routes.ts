import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { RegistroComponent } from './registro/registro.component';
import { accesoGuard } from './guards/acceso.guard';
import { adminGuard } from './guards/admin.guard';
import { rolGuard } from './guards/rol.guard';

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
    path: 'perfil',
    loadComponent: () => import("./perfil/perfil.component").then(c => c.PerfilComponent),
    canActivate: [accesoGuard],
  },
  {
    path: 'bienvenido',
    loadComponent: () => import("./bienvenido/bienvenido.component").then(c => c.BienvenidoComponent),
    canActivate: [accesoGuard],
    children: [
      {
        path: 'admin',
        loadComponent: () => import("./admin/admin.component").then(c => c.AdminComponent),
      },
      {
        path: 'paciente',
        loadComponent: () => import("./paciente/paciente.component").then(c => c.PacienteComponent),
      },
      {
        path: 'especialista',
        loadComponent: () => import("./especialista/especialista.component").then(c => c.EspecialistaComponent),
        children:[
          
        ]
      },
    ]
  },
  {
    path: 'seleccionUsuario',
    loadComponent: () => import("./seccion-usuario/seccion-usuario.component").then(c => c.SeccionUsuarioComponent),
    canActivate: [accesoGuard, adminGuard]
  },
  {
    path: 'solicitarTurno',
    loadComponent: () => import("./solicitar-turno/solicitar-turno.component").then(c => c.SolicitarTurnoComponent)
    ,canActivate: [accesoGuard, rolGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
