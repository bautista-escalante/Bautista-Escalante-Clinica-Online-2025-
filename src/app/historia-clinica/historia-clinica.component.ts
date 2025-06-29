import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HistoriaService } from '../servicios/historia.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historia-clinica',
  imports: [CommonModule, FormsModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {

  peso: string = "";
  temperatura: string = "";
  presion: string = "";
  altura: string = "";
  campo: string = "";
  valor: string = "";
  mostrar: boolean = false;
  jsonDinamico: any[] = [];
  contador = 0;
  id_turno = "";

  constructor(private historiaService: HistoriaService, private route: ActivatedRoute,
    private router: Router
  ) {
    this.id_turno = this.route.snapshot.paramMap.get("turno")!;
  }

  async mostrarCampoDinamico() {
    if (this.contador > 3) {
      await Swal.fire("Error", "cantidad de valores dinamicos exedida", "error");
      return;
    }
    this.mostrar = !this.mostrar;
  }

  generarJson() {
    try {

      if (this.campo.trim() === "") {
        throw new Error("campo requerido");
      }
      if (this.valor.trim() === "") {
        throw new Error("valor requerido");
      }

      this.jsonDinamico.push({ campo: this.campo, valor: this.valor });
      this.mostrar = false;
      this.contador += 1;
      this.campo = "";
      this.valor = "";

    } catch (error: any) {
      Swal.fire("Error", error.message, "warning");
    }
  }

  async guardar() {
    try {
      await this.verificar();

      if (this.jsonDinamico.length !== 0) {

        this.jsonDinamico.forEach((registro) => {
          this.historiaService.agregarDatosDinamicos(this.id_turno, parseFloat(this.altura), parseFloat(this.peso), parseFloat(this.temperatura), this.presion, registro.campo, registro.valor);
        })
      } else {
        this.historiaService.agregarDatosBasicos(this.id_turno, parseFloat(this.altura), parseFloat(this.peso), parseFloat(this.temperatura), this.presion);
      }
      this.peso = "";
      this.altura = "";
      this.presion = "";
      this.temperatura = "";

      Swal.fire("exito", "historia clinica guardada", "success");
      this.router.navigate(["/misTurnos"])

    } catch (error: any) {
      Swal.fire("ERROR", error.message, "error");
    }
  }

  validarFloat(valor: string) {
    const num = parseFloat(valor);
    return !isNaN(num) && isFinite(num);
  }

  async verificar() { 
    try {
      if (!this.validarFloat(this.altura)) {
        throw new Error("alturta invalida");
      }
      if (!this.validarFloat(this.peso)) {
        throw new Error("Presion invalida");
      }
      if (!this.validarFloat(this.temperatura)) {
        throw new Error("temperatura invalida");
      }
      if (!await this.historiaService.historiaClinicaExiste(this.id_turno)) {
        throw new Error("ya existe una historia clinica de este paciente");
      }

      const presionRegex = /^(\d+(\.\d+)?)[\/\\](\d+(\.\d+)?)$/;
      if (!this.presion.match(presionRegex)) {
        throw new Error("Presión inválida. Debe tener el formato número/número (por ejemplo, 120/80)");
      }
    } catch (error: any) {
      throw error;
    }
  }
}