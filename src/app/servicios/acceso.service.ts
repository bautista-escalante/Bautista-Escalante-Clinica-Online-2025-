import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  constructor(private supabase: SupabaseService) { }

  
  async registrarse(usuario: string, clave: string) {
    const { data, error } = await this.supabase.client.auth.signUp({email: usuario, password: clave});
    
    if (error) throw error;
    
    return data;
  }
  
  async verificarAcceso() {
    const { data } = await this.supabase.client.auth.getUser();
    
    return data.user?.email;
  }

  async salir() {
    const { error } = await this.supabase.client.auth.signOut();
    
    if (error) throw  error;
    return !(!!error);
  }
}
