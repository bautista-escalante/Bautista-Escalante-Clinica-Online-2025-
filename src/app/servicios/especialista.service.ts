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
      .not("especialidades", "is", null)
      .eq("habilitado", true);

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

    return especialidades.join(",");
  }

  async traerPacientesAtendidos(correo: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`fecha, resenia, id_paciente(id, nombre, apellido, edad, obra_social, url_perfil), id_especialista(mail)`)
      .eq("estado", "finalizado");

    if (error) throw error;

    let filtrados = data.filter((turno: any) => (turno.id_especialista?.mail === correo));
    
    let unicos = Array.from(new Map(filtrados.map((turno: any) => [turno.id_paciente.id, turno])).values());

    return unicos;

  }

  async obtenerEspecialista(email: string, especialidad: string) {
    const { data, error } = await this.supabase.client
      .from('usuarios')
      .select('*')
      .eq('mail', email)
      .eq("especialidades", especialidad)
      .limit(1);

    if (error) throw error;
    return data[0];
  }

  async traerCantidadFinalizados(id: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select("*")
      .eq("estado", "finalizado")
      .eq("id_especialista", id);

    if (error) return 0;
    return data?.length;
  }

  async traerEspecialistasExistentes() {
    const { data, error } = await this.supabase.client
      .from("usuarios")
      .select("*")
      .eq("perfil", "especialista")
      .eq("habilitado", true);

    if (error) return;
    return data;
  }

  async traerturnosSolicitados(id: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select("*")
      .eq("estado", "a conrfirmar")
      .eq("id_especialista", id);

    if (error) return 0;
    return data?.length;
  }
}
