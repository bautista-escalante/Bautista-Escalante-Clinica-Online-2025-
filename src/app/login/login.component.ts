import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../servicios/supabase.service';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class LoginComponent implements OnInit {
  mensajeError: any;
  email: string = ""
  clave: string = ""

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private usuario: UsuarioService
  ) { }

  rellenarCampos(email: string) {
    this.email = email;
    this.clave = "123456";
  }

  async login(email: string, password: string) {
    try {
      let usuario = await this.usuario.getUserByEmail(email)
      if (usuario && !(usuario.habilitado)) {
        throw new Error("tu cuenta no esta habilitada aun");
      }
      if (email.trim() == "" || password.trim() == "") {
        throw new Error("no puede haber campos vacios");
      }
      if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new Error("el correo no es correcto");
      }
      if (password.length < 6) {
        throw new Error("la clave debe tener al menos 6 caracteres");
      }

      const { data, error } = await this.supabase.client.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error?.message == "Invalid login credentials") {
        throw new Error("esta cuenta no esta registrada");
      }
      if (error) {
        throw error;
      }

      this.router.navigate(['/bienvenido']);
      return { data, error: null };

    } catch (error: any) {
      this.mensajeError = error.message
      return { data: null, error: error };
    }
  }

  ngOnInit() { }


}