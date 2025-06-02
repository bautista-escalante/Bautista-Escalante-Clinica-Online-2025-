import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-seccion-usuario',
  imports: [CommonModule],
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

  async habilitar(correo:string){
    this.user.habilitarCuenta(correo);
  }

  async cancelar(correo:string){
    await this.user.cancelarCuenta(correo);
  }

  traerEspecialidaes(){
    
  }
}
