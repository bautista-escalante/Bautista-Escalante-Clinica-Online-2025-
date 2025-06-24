import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(private supabase: SupabaseService) { }

  async traerHorariosPorId(id: string) {
    const { data, error } = await this.supabase.client
      .from("horarios")
      .select("*")
      .eq("id_especialista", id);

    if (error) throw error;
    return data;
  }

  async agregarHorario(id_especialista: string, horario: string, duracion_turno: number, especialidad: string) {
    await this.supabase.client
      .from("horarios")
      .insert({ id_especialista, horario, duracion_turno, especialidad });

  }
}
