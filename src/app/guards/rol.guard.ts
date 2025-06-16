import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../servicios/acceso.service';

export const rolGuard: CanActivateFn = async () => {
  const acceso = inject(AccesoService);
  const router = inject(Router);

  const usuario = await acceso.verificarAcceso();
  const esAdmin    = await acceso.esPefil(usuario!, 'admin');
  const esPaciente = await acceso.esPefil(usuario!, 'paciente');

  if (esAdmin || esPaciente) {
    return true;                    
  }

  router.navigate(['/bienvenido']);
  return false;
};
