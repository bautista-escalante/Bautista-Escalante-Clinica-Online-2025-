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

  async traerHistoriaClinica(id: number) {
    const { data, error } = await this.supabase.client
      .from("historia_clinica")
      .select("*, id_turno(*, id_paciente(*), id_especialista(*))")

    const historiasFiltradas = data?.filter(historia => { return historia.id_turno?.id_paciente.id == id; });

    return historiasFiltradas;
  }

  async filtrarPorDinamicos(valor: string): Promise<any[]> {
    const { data } = await this.supabase.client
      .from("historia_clinica")
      .select("*, id_turno(*, id_paciente(*), id_especialista(*))")
      .eq("valor_dinamico", valor)

    if (data && data.length > 0) {
      return data;
    } else {

      const { data: data2 } = await this.supabase.client
        .from("historia_clinica")
        .select("*, id_turno(*, id_paciente(*), id_especialista(*))")
        .eq("campo_dinamico", valor)

      if (data2 && data2.length > 0) {
        return data2;
      } else {
        return []
      }
    }
  }

}
