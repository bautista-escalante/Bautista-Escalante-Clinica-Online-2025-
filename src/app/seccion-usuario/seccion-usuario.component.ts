import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seccion-usuario',
  imports: [CommonModule, RouterLink],
  templateUrl: './seccion-usuario.component.html',
  styleUrl: './seccion-usuario.component.css'
})
export class SeccionUsuarioComponent implements OnInit {
  usuarios: any[] = []
  especialidades: string = ""

  constructor(private user: UsuarioService,
  ) {
  }

  async ngOnInit() {
    this.usuarios = await this.user.traerInhabilitados();
  }
  
  async habilitar(correo: string) {
    this.user.habilitarCuenta(correo);
    this.usuarios = await this.user.traerInhabilitados();
  }
  
  async cancelar(correo: string) {
    this.usuarios = await this.user.traerInhabilitados();
    await this.user.cancelarCuenta(correo);
  }

  traerEspecialidaes(correo: string, perfil: string) {
    if (perfil === "especialista") {
      this.user.traerEspecialidades(correo)
    }

  }
}
