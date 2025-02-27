import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-controlacceso',
  templateUrl: './controlacceso.page.html',
  styleUrls: ['./controlacceso.page.scss'],
  standalone: false,
})
export class ControlaccesoPage {
  currentDomain: string = '';  // Para mostrar el dominio actual
  currentPort: string = '';  // Para mostrar el puerto actual
  newDomain: string = '';  // Para nuevo dominio ingresado
  newPort: string = '';  // Para nuevo puerto ingresado

  constructor(
    private storageService: IonicstorageService,
    private router: Router,
    private toastController: ToastController // Usamos ToastController
  ) {}

  ngOnInit() {
    // Cargar la configuración de dominio y puerto almacenados
    this.loadConfig();
  }

  async loadConfig() {
    this.currentDomain = await this.storageService.rescatar('dominio') || '';
    this.currentPort = await this.storageService.rescatar('port') || '';
  }

  // Método para mostrar el toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom', // Puedes cambiar la posición (top, middle, bottom)
      color: 'primary', // Puedes cambiar el color (primary, success, danger, etc.)
    });
    toast.present();
  }

  async saveConfig() {
    if (this.newDomain && this.newPort) {
      // Guardamos el nuevo dominio y puerto
      await this.storageService.agregarConKey('dominio', this.newDomain);
      await this.storageService.agregarConKey('port', this.newPort);

      const novedades = `http://${this.newDomain}:${this.newPort}/api/auth/novedades`;
      await this.showToast(`Carga de novedades: ${novedades}`);
      
      // Actualizamos la vista para mostrar el nuevo dominio y puerto
      await this.showToast(`Configuración guardada: Dominio: ${this.newDomain}, Puerto: ${this.newPort}`);
      this.loadConfig();
      this.router.navigate(['/home']);
    } else {
      await this.showToast('Por favor, ingrese un dominio y puerto válidos.');
    }
  }
}