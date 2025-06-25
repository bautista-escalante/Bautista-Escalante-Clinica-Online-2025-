import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  constructor(private supabase: SupabaseService) { }

  async traerResenia(id: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`resenia`)
      .eq("id", id);

    if (error) throw error;
    console.log(data)
    return data[0].resenia;
  }

  async traerTurnosPaciente(id: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`*, id_especialista(apellido, nombre, especialidades)`)
      .eq("id_paciente", id);

    if (error) throw error;
    return data;
  }

  async traerTurnos() {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`*, id_especialista(apellido, nombre, especialidades), id_paciente(nombre, apellido)`)

    if (error) throw error;
    return data;
  }

  async traerTurnosEspecialista(id: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`*, id_especialista(especialidades), id_paciente(nombre, apellido)`)
      .eq("id_especialista", id);

    if (error) throw error;
    return data;
  }


  async agregarTurno(paciente: number, especialista: number, fecha: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .insert({ id_paciente: paciente, id_especialista: especialista, fecha, estado: "a confirmar" })
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

  async cambiarEstado(estado: string, id: number) {
    const { data, error } = await this.supabase.client
      .from('turnos')
      .update({ estado: estado })
      .eq("id", id)
      .select();

    if (error) throw error;
    console.log(data)
  }

  async cambiarEstadoConMensaje(estado: string, mensaje: string, id: number) {
    const { error } = await this.supabase.client
      .from('turnos')
      .update({ estado: estado, resenia: mensaje })
      .eq("id", id)
      .select();

    if (error) throw error;

  }

  async calificar(calificacion: string, id: number, comentario: string) {
    const { error } = await this.supabase.client
      .from('turnos')
      .update({ calificacion: calificacion, razon: comentario })
      .eq("id", id)

    if (error) throw error;
  }

  async esHorarioDisponible(id: string, fecha: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select("id")
      .eq("id_especialista", id)
      .eq("fecha", fecha);

    if (error) throw error;
    return data.length == 0;
  }
}