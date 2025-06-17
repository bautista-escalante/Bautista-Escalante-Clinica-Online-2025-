import { inject } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import { CanActivateFn, Router } from '@angular/router';

export const especialistaGuard: CanActivateFn = async(route, state) => {
  const acceso = inject(AccesoService);
  const router = inject(Router);
  
  let usuario = await acceso.verificarAcceso();
  let especialista = await acceso.esPefil(usuario!, "especialista");
  
  if(!(especialista)){
    router.navigate(['/bienvenido']);
    return false;
  }
  return true;
};
