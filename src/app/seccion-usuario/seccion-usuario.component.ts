import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { RouterLink } from '@angular/router';
import { distinct, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { EspecialistaService } from '../servicios/especialista.service';

@Component({
  selector: 'app-seccion-usuario',
  imports: [CommonModule, RouterLink],
  templateUrl: './seccion-usuario.component.html',
  styleUrl: './seccion-usuario.component.css'
})
export class SeccionUsuarioComponent implements OnInit {
  usuarios: any[] = []
  especialidades: string = ""
  rutas: string[] = [];

  constructor(private user: UsuarioService, private especialistaService: EspecialistaService) {
  }

  async ngOnInit() {
    this.usuarios = await this.user.traerInhabilitados();

    for (let usuario of this.usuarios) {
      if (usuario.perfil === 'especialista') {
        this.especialistaService.traerEspecialidades(usuario.mail).then(especialidades => {
          usuario.especialidades = especialidades;
        });
      } else {
        this.user.traerFotos(usuario.mail).then(ruta => {
          this.rutas = ruta;
        })
      }
    }
  }

  async habilitar(correo: string) {
    this.user.habilitarCuenta(correo);
    this.usuarios = await this.user.traerInhabilitados();
  }

  async cancelar(correo: string) {
    await this.user.cancelarCuenta(correo);
    this.usuarios = await this.user.traerInhabilitados();
  }

}
