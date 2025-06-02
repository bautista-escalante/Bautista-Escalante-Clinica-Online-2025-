import { SupabaseService } from '../servicios/supabase.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccesoService } from '../servicios/acceso.service';
import { ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import Swal from 'sweetalert2'


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
    obraSocial: new FormControl("", {}),
    especialidad: new FormControl("", {})

  });
  mensajeError: any;
  imagen1: File | null = null;
  imagen2: File | null = null;
  imagenEspecialista: File | null = null;
  perfilElegido: string | null = null
  imagenesPaciente: Blob[] = [];

  constructor(
    private acceso: AccesoService,
    private supabase: SupabaseService,
    private router: Router,
    private usuarios: UsuarioService
  ) { }

  ngOnInit(): void { }

  asignarArchivo(event: Event, tipo: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      if (tipo === 'imagen1') {
        this.imagen1 = file;
        this.imagenesPaciente.push(file);
      }
      if (tipo === 'imagen2') {
        this.imagen2 = file;
        this.imagenesPaciente.push(file);
      }
      if (tipo === 'imagenEspecialista') {
        this.imagenEspecialista = file;
      }
    }
  }

  validarFormulario(): void {
    if (this.formulario.invalid) {
      // Marca todos los controles como tocados para mostrar los mensajes de error
      this.marcarCamposComoTocados(this.formulario);

      // Obtiene los errores de cada campo
      const errores = Object.entries(this.formulario.controls)
        .filter(([_, control]) => control.invalid)
        .map(([nombre, control]) => {
          const erroresControl = control.errors;
          return `${nombre}: ${Object.keys(erroresControl || {}).join(', ')}`;
        });

      // Lanza un error con un mensaje detallado
      throw new Error('Errores de validación:\n' + errores.join('\n'));
    }
  }

  private marcarCamposComoTocados(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async crearCuenta() {
    try {
      const status = this.formulario.status;
      this.validarFormulario();

      if (status === 'VALID') {

        if (this.perfilElegido == "paciente") {

          for (let i = 0; i < this.imagenesPaciente.length; i++) {

            const nombreArchivo = `${this.perfilElegido}_${this.formulario.value.nombre}_(${i + 1})`;
            const { data, error } = await this.supabase.client.storage
              .from("usuarios")
              .upload(nombreArchivo, this.imagenesPaciente[i]!);

            if (!error) {
              const URL = this.supabase.client.storage.from('usuarios').getPublicUrl(nombreArchivo).data.publicUrl;

              await this.usuarios.insertarDatos(
                this.formulario.value.nombre!,
                this.formulario.value.apellido!,
                parseInt(this.formulario.value.edad!),
                this.formulario.value.email!,
                URL!,
                this.formulario.value.obraSocial!,
                null,
                parseInt(this.formulario.value.dni!),
                this.perfilElegido
              )
            }
          }
        }

        if (this.perfilElegido == "especialista") {

          let especialidades = this.formulario.value.especialidad!.split(',');
          console.log(especialidades)

          const nombreArchivo = `${this.perfilElegido}_${this.formulario.value.nombre}`;
          const { data, error } = await this.supabase.client.storage
            .from("usuarios")
            .upload(nombreArchivo, this.imagenEspecialista!);

          if (!error) {
            const URL = this.supabase.client.storage.from('usuarios').getPublicUrl(nombreArchivo).data.publicUrl;
            for (let i = 0; i < especialidades.length; i++) {

              await this.usuarios.insertarDatos(
                this.formulario.value.nombre!,
                this.formulario.value.apellido!,
                parseInt(this.formulario.value.edad!),
                this.formulario.value.email!,
                URL!, null,
                especialidades[i],
                parseInt(this.formulario.value.dni!),
                this.perfilElegido
              )
            }
          }
        }
        const { data, error } = await this.supabase.client.auth.signUp({
          email: this.formulario.value.email!,
          password: this.formulario.value.clave!
        });
        if (error) throw error;

        this.acceso.salir();

        Swal.fire({
          title: "cuenta creada con exito",
          text: "solo queda esperar a que sea habilitada",
          icon: "success",
          draggable: true
        });

        this.router.navigate(['/login']);
      }

    } catch (error: any) {
      if (error.message == "User already registered") {
        this.mensajeError = "el usuario ya esta registrado";
      } else {
        this.mensajeError = error.message;
      }
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
