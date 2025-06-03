import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../servicios/supabase.service';
import { AccesoService } from '../servicios/acceso.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent implements OnInit {

  mensajeError = "";
  estalogeado: boolean = true;
  usuario: any = "";
  correo: any = "";
  fotoPerfil: any = "";
  cantidadNoitificaciones: any = ""

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
  })

  constructor(
    private acceso: AccesoService,
    private supabase: SupabaseService,
    private user: UsuarioService
  ) { }

  async ngOnInit() {
    this.correo = await this.acceso.verificarAcceso();
    this.usuario = await this.user.getUserByEmail(this.correo!)
    this.cantidadNoitificaciones = (await this.user.traerInhabilitados()).length
  }

  async cerrarSesion() {
    try {
      await this.acceso.salir();
      this.estalogeado = !!(await this.acceso.verificarAcceso());
      console.log(this.estalogeado)
      return;

    } catch (error: any) {
      this.mensajeError = error.message
      return { data: null, error: error };
    }
  }

  guardarArchivo(event: any) {
    this.fotoPerfil = (event.target as HTMLInputElement)?.files?.[0];
  }

  async crearCuenta() {
    try {
      const status = this.formulario.status;

      if (status === 'VALID') {

        const nombreArchivo = `admin_${this.formulario.value.nombre}`;
        const { error } = await this.supabase.client.storage
          .from("usuarios")
          .upload(nombreArchivo, this.fotoPerfil);

        if (!error) {
          const URL = this.supabase.client.storage.from('usuarios').getPublicUrl(nombreArchivo).data.publicUrl;

          await this.user.insertarDatos(
            this.formulario.value.nombre!,
            this.formulario.value.apellido!,
            parseInt(this.formulario.value.edad!),
            this.formulario.value.email!,
            URL!, null, null,
            parseInt(this.formulario.value.dni!),
            "admin", true
          )
        }
        const { error: errorSingup } = await this.supabase.client.auth.signUp({
          email: this.formulario.value.email!,
          password: this.formulario.value.clave!
        });
        if (errorSingup) throw errorSingup;
        else {
          Swal.fire({
            title: "cuenta creada con exito",
            text: `${this.formulario.value.nombre} es admin`,
            icon: "success",
            draggable: true
          });
          this.formulario.reset();
        }
      }



    } catch (error: any) {
      if (error.message == "User already registered") {
        this.mensajeError = "el usuario ya esta registrado";
      } else {
        this.mensajeError = error.message;
      }
    }
  }


}