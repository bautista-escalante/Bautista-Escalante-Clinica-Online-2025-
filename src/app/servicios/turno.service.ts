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

  async traerTurnosEspecialista(correo: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`*, id_especialista(mail, especialidades), id_paciente(id, nombre, apellido)`)

    if (error) throw error;
    let filtrados = data.filter((turno: any) => (turno.id_especialista?.mail === correo));

    return filtrados;
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
      .select("id, estado")
      .eq("id_especialista", id)
      .eq("fecha", fecha);

    if (error) throw error;
    if (data.length > 0 && data[0].estado === "cancelado") return true;
    return data.length == 0;
  }

  async traerCantidadPorEspecialidad(especialidad: string) {
    const { data } = await this.supabase.client
      .from("turnos")
      .select("id_especialista(especialidades)")

    let cantidadPorEspecialidad = 0;
    data?.map((especialista: any) => {
      if (especialidad === especialista.id_especialista.especialidades) cantidadPorEspecialidad += 1;
    })
    return cantidadPorEspecialidad;
  }

  async traerTurnosPorDia(fecha: Date) {
    const f = new Date(fecha);

    const { data, error } = await this.supabase.client
      .from("turnos")
      .select("id")
      .gte("created_at", new Date(f.getFullYear(), f.getMonth(), f.getDate()).toISOString())

    if (error) return 0;
    return data?.length;
  }

  async traerUltimoTurno(id_paciente: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select("id, id_paciente")
      .eq("id_paciente", id_paciente)
      .order("id", { ascending: false })
      .limit(3)

    console.log(data)
    if (error) console.log(error)
    return data;
}

async traerTurnosPorId(idturno: number) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select("*, id_paciente(*), id_especialista(*)")
      .eq("id", idturno)
    
    if (error) return []
    return data;
  }

}