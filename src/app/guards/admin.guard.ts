import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../servicios/acceso.service';

// una promesa que retorna true o false segun la logica de que queremos cuidar
export const adminGuard: CanActivateFn = async (route, state) => {
  const acceso = inject(AccesoService);
  const router = inject(Router);

  let usuario = await acceso.verificarAcceso()
  let admin = await acceso.esAdmin(usuario!)
  
  if(!(admin)){
    router.navigate(['/bienvenido']);
    return false;
  }
  return true;
};
