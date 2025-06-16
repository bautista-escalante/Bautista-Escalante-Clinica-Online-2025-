import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private supabase: SupabaseService) { }

    async insertarDatos(nombre: string, apellido: string, edad: number, mail: string, url_perfil: string, obra_social: string | null, especialidades: string | null, dni: number, perfil: string, habilitado: boolean = false) {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .insert({
                nombre, apellido, edad, mail, habilitado, url_perfil, obra_social, especialidades, dni, perfil
            })
            .select();

        if (error) throw error;
        return data;
    }

    async getUserByEmail(email: string) {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq('mail', email)
            .limit(1);
        if (error) throw error;
        return data[0];
    }

    async traerInhabilitados() {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq("habilitado", false)
            .eq("cancelada", false)

        if (error) throw error;

        const map = new Map();
        for (const u of data) {
            if (!map.has(u.mail)) {
                map.set(u.mail, u); // usa mail como clave única
            }
        }
        return Array.from(map.values());
    }

    async habilitarCuenta(correo: string) {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq("habilitado", false)
            .eq("mail", correo)

        if (error) throw error;
        if (!data) return null

        const { error: errorUpdate } = await this.supabase.client
            .from('usuarios')
            .update({ habilitado: true })
            .eq("mail", correo)

        if (errorUpdate) throw errorUpdate;
        return data;
    }

    async cancelarCuenta(correo: string) {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq("cancelada", false)
            .eq("mail", correo)

        if (error) throw error;
        if (!data) return null

        const { error: errorUpdate } = await this.supabase.client
            .from('usuarios')
            .update({ cancelada: true })
            .eq("mail", correo)

        if (errorUpdate) throw errorUpdate;
        return data;
    }

    async crearCuenta(nombreArchivo: string, imagen: Blob, nombre: string, apellido: string, edad: number, email: string, obraSocial: string | null = null, especialidad: string | null = null, dni: number, perfilElegido: string) {
        const { data, error } = await this.supabase.client.storage
            .from("usuarios")
            .upload(nombreArchivo, imagen);

        if (!error) {
            const URL = this.supabase.client.storage.from('usuarios').getPublicUrl(nombreArchivo).data.publicUrl;
            await this.insertarDatos(nombre, apellido, edad, email, URL, obraSocial, especialidad, dni, perfilElegido);

        }
    }

    async traerFotos(correo: string) {
        const { data, error } = await this.supabase.client
            .from("usuarios")
            .select(`url_perfil`)
            .eq("mail", correo);

        if (error) throw error;
        const fotos = data.map((item: any) => item.url_perfil)

        return fotos;
    }

    async traerPacientes() {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq("habilitado", true)
            .eq("cancelada", false)
            .eq("perfil", "paciente");

        if (error) throw error;

        const map = new Map();
        for (const u of data) {
            if (!map.has(u.mail)) {
                map.set(u.mail, u); // usa mail como clave única
            }
        }
        return Array.from(map.values());
    }
}