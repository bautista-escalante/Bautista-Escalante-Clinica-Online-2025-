import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {

  constructor(private supabase: SupabaseService) { }

  async agregarDatosBasicos(id_turno: string, altura: number, peso: number, temperatura: number, presion: string) {
    const { error } = await this.supabase.client
      .from("historia_clinica")
      .insert({ altura, peso, temperatura, presion, id_turno })

    if (error) throw error;
  }

  async agregarDatosDinamicos(id_turno: string, altura: number, peso: number, temperatura: number, presion: string, campo: string, valor: string) {
    const { error } = await this.supabase.client
      .from("historia_clinica")
      .insert({ altura, peso, temperatura, presion, campo_dinamico: campo, valor_dinamico: valor, id_turno })

    if (error) throw error;
  }

  async historiaClinicaExiste(id_turno: string) {
    const { data } = await this.supabase.client
      .from("historia_clinica")
      .select("id")
      .eq("id_turno", id_turno)

    return data?.length === 0;
  }
}
