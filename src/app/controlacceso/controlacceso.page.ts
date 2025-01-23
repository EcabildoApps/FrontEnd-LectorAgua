import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-controlacceso',
  templateUrl: './controlacceso.page.html',
  styleUrls: ['./controlacceso.page.scss'],
  standalone: false,
})
export class ControlaccesoPage {
  currentDomain: string = ''; // IP/Dominio anterior
  currentPort: string = ''; // Puerto anterior
  newDomain: string = ''; // Para ingresar el nuevo dominio
  newPort: string = ''; // Para ingresar el nuevo puerto

  constructor(private router: Router) { }

  ngOnInit() {
    // Recuperar el dominio y puerto actuales desde localStorage o usar valores predeterminados
    this.currentDomain = localStorage.getItem('domain') || 'localhost';
    this.currentPort = localStorage.getItem('port') || '3000';
  }

  saveConfig() {
    if (this.newDomain.trim() && this.newPort.trim()) {
      // Actualizar los valores "anteriores" y guardar los nuevos valores
      this.currentDomain = this.newDomain;
      this.currentPort = this.newPort;

      // Guardar en localStorage
      localStorage.setItem('domain', this.newDomain);
      localStorage.setItem('port', this.newPort);

      alert('Configuración guardada con éxito.');

      // Limpiar los campos de nuevo dominio y puerto
      this.newDomain = '';
      this.newPort = '';
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}