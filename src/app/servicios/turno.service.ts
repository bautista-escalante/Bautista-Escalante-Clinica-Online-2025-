import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  constructor(private supabase: SupabaseService) { }

  async traerTurnos(id: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`
      calificacion,
      cancelado,
      estado,
      fecha,
      id_especialista(apellido, especialidades)`)
      .eq("id_paciente", id);

    if (error) throw error;
    return data;
  }

  async traerTurnosEspecialista(id: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`
      calificacion,
      cancelado,
      estado,
      fecha,
      id_especialista(especialidades),
      id_paciente(nombre, apellido)`)
      .eq("id_especialista", id);

    if (error) throw error;
    return data;
  }


  async agregarTurno(paciente: number, especialista: number, fecha: Date) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .insert({ id_paciente: paciente, id_especialista: especialista, fecha, estado: "a confirmar", cancelado: false })
      .select();

    if (error) throw error;
    return data;
  }

  async filtrarTurnosPorEspecialista(apellido: string) {
    const { data } = await this.supabase.client
      .from("turnos")
      .select("*, id_especialista(*)")
      .eq("id_especialista.apellido", apellido);

    return data;
  }

  async filtrarTurnosPorEspecialidad(especialidad: string) {
    const { data } = await this.supabase.client
      .from("turnos")
      .select("*, id_especialista(*)")
      .eq("id_especialista.especialidades", especialidad)

    return data;
  }
}