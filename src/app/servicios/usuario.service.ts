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
        return data;
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

    async traerEspecialidades(correo: string) {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq('mail', correo);

        const usuariosMap = new Map<number, any>();

        data?.forEach(usuario => {
            if (!usuariosMap.has(usuario.id)) {
                usuariosMap.set(usuario.id, {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.mail,
                    especialidades: [usuario.especialidades]
                });
            } else {
                usuariosMap.get(usuario.id).especialidades.push(usuario.especialidad);
            }
        });
        return Array.from(usuariosMap.values());
    }

    async traerEspecialista(especialidad: string) {
        const { data, error } = await this.supabase.client
            .from("usuarios")
            .select(`apellido, id`)
            .eq("especialidad", especialidad);

        if (error) throw error;
        console.log(data);
        return data;
    }

}
