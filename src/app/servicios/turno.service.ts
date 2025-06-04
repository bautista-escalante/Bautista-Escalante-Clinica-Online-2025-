import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Time } from '@angular/common';
import { Timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  constructor(private supabase: SupabaseService) { }

  async traerTurnos() {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .select(`
      calificacion,
      cancelado,
      estado,
      fecha,
      hora,
      id_especialista(apellido, especialidades)`);

    if (error) throw error;
    console.log(data);
    return data;
  }


  async agregarTurno(paciente: number, especialista: number, fecha: Date, hora: string) {
    const { data, error } = await this.supabase.client
      .from("turnos")
      .insert({ id_paciente: paciente, id_especialista: especialista, fecha, hora, estado: "a confirmar", cancelado: false })
      .select();

    if (error) throw error;
    return data;
  }
  
}
