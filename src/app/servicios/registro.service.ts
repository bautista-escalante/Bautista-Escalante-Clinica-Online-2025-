import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private supabase: SupabaseService) { }

  async guardarRegistro(id_usuario: number) {
    console.log(id_usuario)
    const { data, error } = await this.supabase.client
      .from("registro_ingreso")
      .insert({ id_usuario: id_usuario, fecha: new Date().toISOString() })
      .select();

    console.log(data, error)
  }

  async traerRegistro() {
    const { data } = await this.supabase.client
      .from("registro_ingreso")
      .select("*, id_usuario(*)")
      .gte("fecha", new Date().toISOString().split("T")[0]);

    return data;
  }

}
