import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../servicios/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, RouterModule]
})
export class LoginComponent implements OnInit {
  mensajeError: any;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async login(email: string, password: string) {
    try {
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