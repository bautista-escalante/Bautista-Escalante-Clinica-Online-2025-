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
      validators: [Validators.required]
    }),
    tipoSeleccionado: new FormControl('paciente', { validators: [Validators.required] }),
    obraSocial: new FormControl(''),
    especialidad: new FormControl('') 
  });
mensajeError: any;
imagen1: File | null = null;
imagen2: File | null = null;
imagenEspecialista: File | null = null;

constructor(
  private acceso: AccesoService,
  private supabase: SupabaseService,
  private router: Router
) { }

get tipoSeleccionado() {
  return this.formulario.get('tipoSeleccionado')?.value;
}

ngOnInit(): void {}

onFileSelected(event: Event, tipo: string): void {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    if (tipo === 'imagen1') this.imagen1 = file;
    if (tipo === 'imagen2') this.imagen2 = file;
    if (tipo === 'imagenEspecialista') this.imagenEspecialista = file;
  }
}

validar() {
  try {
    const controls = this.formulario.controls;

    if (controls['nombre'].touched && controls['nombre'].hasError('required')) {
      throw new Error('Nombre es obligatorio');
    }
    if (controls['apellido'].touched && controls['apellido'].hasError('required')) {
      throw new Error('Apellido es obligatorio');
    }
    if (controls['edad'].touched && controls['edad'].hasError('required')) {
      throw new Error('Edad es obligatoria');
    }
    if (
      controls['edad'].touched &&
      (controls['edad'].hasError('min') || controls['edad'].hasError('max'))
    ) {
      throw new Error('Edad debe estar entre 1 y 100');
    }
    if (
      controls['edad'].touched &&
      controls['edad'].value &&
      !Number.isInteger(Number(controls['edad'].value))
    ) {
      throw new Error('La edad debe ser un número entero');
    }
    if (controls['email'].touched && controls['email'].hasError('required')) {
      throw new Error('Email es obligatorio');
    }
    if (controls['email'].touched && controls['email'].hasError('email')) {
      throw new Error('El correo no es correcto');
    }
    if (controls['clave'].touched && controls['clave'].hasError('required')) {
      throw new Error('Clave es obligatoria');
    }
    if (controls['clave'].touched && controls['clave'].hasError('minlength')) {
      throw new Error('La clave debe tener al menos 6 caracteres');
    }
    if (controls['dni'].touched && controls['dni'].hasError('required')) {
      throw new Error('DNI es obligatorio');
    }
    if (controls['obraSocial'].touched && controls['obraSocial'].hasError('required')) {
      throw new Error('Obra social es obligatoria');
    }
  } catch (error: any) {
    this.mensajeError = error.message
  }
}


  async crearCuenta() {
  try {
 this.formulario.statusChanges.subscribe((status) => {
    if (status === 'INVALID') {
      /* await this.acceso.registrarse(this.email, this.clave);
      //await this.supabase.insertarDatosUsuario(correo, nombre, apellido, parseInt(edad));
      await this.supabase.client.auth.signInWithPassword({ email: this.email, password: this.clave });
  
      this.router.navigate(['/bienvenido']);
      return; */
    
    }
  })

  } catch (error: any) {
    this.mensajeError = error.message
  }
}
}
