import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private supabase: SupabaseService) { }


  async traerEspecialistas(especialidad: string) {
    const { data, error } = await this.supabase.client
      .from("usuarios")
      .select(`apellido, url_perfil, nombre, id`)
      .eq("especialidades", especialidad);

    if (error) throw error;
    return data;
  }

  async traerEspecialistaPorId(id: string) {
    const { data, error } = await this.supabase.client
      .from("usuarios")
      .select(`id, apellido, url_perfil, nombre`)
      .eq("id", id);

    if (error) throw error;
    return data[0];
  }

  async traerEspecialidadesExistentes() {
    const { data, error } = await this.supabase.client
      .from("usuarios")
      .select(`especialidades`)
      .not("especialidades", "is", null);

    if (error) throw error;
    const especialidades = data
      .map((item: any) => item.especialidades?.trim())
      .filter(Boolean);
    return especialidades;
  }

  async traerEspecialidades(correo: string) {
    const { data, error } = await this.supabase.client
      .from("usuarios")
      .select(`apellido, id, especialidades`)
      .eq("mail", correo)

    if (error) throw error;
    const especialidades = data
      .map((item: any) => item.especialidades?.trim())
      .filter(Boolean);

    return especialidades.join(", ");
  }
}
