import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(private supabase: SupabaseService) { }

  async traerHorarioisDisponibles(id: string) {
    const { data, error } = await this.supabase.client
      .from("horarios")
      .select("horario")
      .eq("ocupado", false)
      .eq("id_especialista", id);

    if (error) throw error;
    return data;
  }

  async tomarHorario(id: string) {
    const { error: errorUpdate } = await this.supabase.client
      .from('horarios')
      .update({ ocupado: true })
      .eq("id_especialista", id)

    if (errorUpdate) throw errorUpdate;
  }
}
