import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../servicios/acceso.service';

// una promesa que retorna true o false segun la logica de que queremos cuidar
export const accesoGuard: CanActivateFn = async (route, state) => {
  const acceso = inject(AccesoService);
  const router = inject(Router);

  let usuario = await acceso.verificarAcceso()
  if(usuario === undefined){
    router.navigate(['/login']);
    return false;
  }
  return true;
};
