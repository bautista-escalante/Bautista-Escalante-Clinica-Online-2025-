import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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


}
