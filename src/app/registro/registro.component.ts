import { SupabaseService } from '../servicios/supabase.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccesoService } from '../servicios/acceso.service';
import { ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-registro',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  formulario = new FormGroup({
    nombre: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required]
    }),
    apellido: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required]
    }),
    edad: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(100)]
    }),
    clave: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    dni: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(8), Validators.minLength(7),
      Validators.pattern('^[0-9]+$')]
    }),
    imagenes: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required]
    }),
    obraSocial: new FormControl("", {
      nonNullable: true
    }),
    especialidad: new FormControl("", {
      nonNullable: true
    })

  });
  mensajeError: any;
  imagen1: File | null = null;
  imagen2: File | null = null;
  imagenEspecialista: File | null = null;
  perfilElegido: string | null = null

  constructor(
    private acceso: AccesoService,
    private supabase: SupabaseService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  asignarArchivo(event: Event, tipo: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      if (tipo === 'imagen1') this.imagen1 = file;
      if (tipo === 'imagen2') this.imagen2 = file;
      if (tipo === 'imagenEspecialista') this.imagenEspecialista = file;
    }
  }

  async crearCuenta() {
    try {
      const status = this.formulario.status;
      console.log(status); // ← Esto siempre se ejecuta

      if (status !== 'INVALID') {
        // Lógica para crear cuenta aquí
      }

    } catch (error: any) {
      this.mensajeError = error.message;
    }
  }


  definirRegistro(perfil: string) {
    this.perfilElegido = perfil;

    if (perfil === 'paciente') {

      this.formulario.get('obraSocial')?.setValidators([Validators.required]);
      this.formulario.get('especialidad')?.clearValidators();
      this.formulario.get('especialidad')?.reset();
    } else if (perfil === 'especialista') {

      this.formulario.get('especialidad')?.setValidators([Validators.required]);
      this.formulario.get('obraSocial')?.clearValidators();
      this.formulario.get('obraSocial')?.reset();
    }


    this.formulario.get('obraSocial')?.updateValueAndValidity();
    this.formulario.get('especialidad')?.updateValueAndValidity();
  }


}
