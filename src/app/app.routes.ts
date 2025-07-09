import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { RegistroComponent } from './registro/registro.component';
import { accesoGuard } from './guards/acceso.guard';
import { adminGuard } from './guards/admin.guard';
import { rolGuard } from './guards/rol.guard';
import { especialistaGuard } from './guards/especialista.guard';
import { animation } from '@angular/animations';

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
        data: { animation: "admin" }
      },
      {
        path: 'paciente',
        loadComponent: () => import("./paciente/paciente.component").then(c => c.PacienteComponent),
        data: { animation: "paciente" }
      },
      {
        path: 'especialista',
        loadComponent: () => import("./especialista/especialista.component").then(c => c.EspecialistaComponent),
        data: { animation: "especialista" }
      },
    ],
  },
  {
    path: 'seccionPaciente',
    loadComponent: () => import("./seccion-paciente/seccion-paciente.component").then(c => c.SeccionPacienteComponent),
    canActivate: [especialistaGuard, accesoGuard]
  },
  {
    path: 'seleccionUsuario',
    loadComponent: () => import("./seccion-usuario/seccion-usuario.component").then(c => c.SeccionUsuarioComponent),
    canActivate: [adminGuard, accesoGuard]
  },
  {
    path: 'estadistica',
    loadComponent: () => import("./estadisticas/estadisticas.component").then(c => c.EstadisticasComponent),
    canActivate: [adminGuard, accesoGuard]
  },
  {
    path: 'solicitarTurno',
    loadComponent: () => import("./solicitar-turno/solicitar-turno.component").then(c => c.SolicitarTurnoComponent)
    , canActivate: [accesoGuard, rolGuard]
  },
  {
    path: 'historiaClinica/:turno',
    loadComponent: () => import("./historia-clinica/historia-clinica.component").then(c => c.HistoriaClinicaComponent)
    , canActivate: [accesoGuard]
  },
  {
    path: 'misTurnos',
    loadComponent: () => import("./turnos/turnos.component").then(c => c.TurnosComponent)
    , canActivate: [accesoGuard]
  },
  {
    path: 'definirHorarios',
    loadComponent: () => import("./definir-horarios/definir-horarios.component").then(c => c.DefinirHorariosComponent)
    , canActivate: [accesoGuard]
  },
  {
    path: 'pdfHistoria/:id_paciente',
    loadComponent: () => import("./pdf-historia-clinica/pdf-historia-clinica.component").then(c => c.PdfHistoriaClinicaComponent)
    , canActivate: [accesoGuard]
  },
  {
    path: 'turnosEspecialidad',
    loadComponent: () => import("./turnos-especialidad/turnos-especialidad.component").then(c => c.TurnosEspecialidadComponent)
    , canActivate: [accesoGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
