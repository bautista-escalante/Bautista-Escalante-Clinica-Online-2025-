import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  constructor(private supabase: SupabaseService, private router:Router) { }


  async registrarse(usuario: string, clave: string) {
    const { data, error } = await this.supabase.client.auth.signUp({ email: usuario, password: clave });

    if (error) throw error;

    return data;
  }

  async verificarAcceso() {
    const { data, error } = await this.supabase.client.auth.getUser();
    if(error){
      this.router.navigate(["/login"])
    }
    
    return data.user?.email;
  }

  async obtenerPerfil() {
    return this.verificarAcceso().then(async email => {
      const { data, error } = await this.supabase.client
        .from('usuarios')
        .select('*')
        .eq('mail', email)

      if (error) return error
      return data[0].perfil;
    });
  }

  async salir() {
    const { error } = await this.supabase.client.auth.signOut();

    if (error) throw error;
    return !(!!error);
  }

  async esPefil(correo: string, perfil: string) {
    const { data } = await this.supabase.client
      .from('usuarios')
      .select('*')
      .eq('mail', correo)
      .eq("perfil", perfil);

    return !!data;
  }
}
