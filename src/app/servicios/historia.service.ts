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
      .select("id, id_turno")
      .eq("id_turno", id_turno)

    console.log(data)
    return data?.length === 0;
  }

  async traerHistoriaClinica(id: number) {
    const { data, error } = await this.supabase.client
      .from("historia_clinica")
      .select("*, id_turno(*, id_paciente(*), id_especialista(*))")

    let filtrados = data?.filter((historia: any) => { return historia.id_turno.id_paciente.id == id })
    console.log(data, filtrados)
    return filtrados;
  }

  async filtrarPorDinamicos(valor: string | number) {

    const { data } = await this.supabase.client
      .from('historia_clinica')
      .select('*, id_turno')
      .eq("valor_dinamico", valor);

    if (data?.length !== 0) return data;

    const { data: campo } = await this.supabase.client
      .from('historia_clinica')
      .select('*, id_turno')
      .eq("campo_dinamico", valor);

    if (campo?.length !== 0) return campo;

    const { data: altura } = await this.supabase.client
      .from('historia_clinica')
      .select('*, id_turno')
      .eq("altura", valor);

    if (altura?.length !== 0) return altura;

    const { data: peso } = await this.supabase.client
      .from('historia_clinica')
      .select('*, id_turno')
      .eq("peso", valor);

    if (peso?.length !== 0) return peso;

    const { data: temperatura } = await this.supabase.client
      .from('historia_clinica')
      .select('*, id_turno')
      .eq("temperatura", valor);

    if (temperatura?.length !== 0) return temperatura;

    const { data: presion } = await this.supabase.client
      .from('historia_clinica')
      .select('*, id_turno')
      .eq("temperatura", valor);

    if (presion?.length !== 0) return presion;

    return [];
  }

}
