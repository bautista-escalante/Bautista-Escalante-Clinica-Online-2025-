import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private supabase: SupabaseService) { }

    async insertarDatos(nombre: string, apellido: string, edad: number, mail: string, url_perfil: string, obra_social: string | null, especialidades: string | null, dni: number, perfil: string) {
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .insert({
                nombre, apellido, edad, mail, url_perfil, obra_social, especialidades, dni, perfil
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
    
   /*  async traerInhabilitado(mail:string){
        const { data, error } = await this.supabase.client
            .from('usuarios')
            .select('*')
            .eq('mail', mail)
            .maybeSingle();

        if (error) throw error;
        return data;
    } */

}
