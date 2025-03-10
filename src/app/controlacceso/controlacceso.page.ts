import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

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
  imagenLogin: string = '/assets/img/login2.jpeg';
  constructor(
    private storageService: IonicstorageService,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    // Cargar la configuración de dominio y puerto almacenados
    this.loadConfig();
    this.loadImageFromServer();
  }

  async loadConfig() {
    this.currentDomain = await this.storageService.rescatar('dominio') || '186.46.238.254';
    this.currentPort = await this.storageService.rescatar('port') || '3000';
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

      const novedades = `https://${this.newDomain}:${this.newPort}/api/auth/novedades`;
      await this.showToast(`Carga de novedades: ${novedades}`);

      // Actualizamos la vista para mostrar el nuevo dominio y puerto
      await this.showToast(`Configuración guardada: Dominio: ${this.newDomain}, Puerto: ${this.newPort}`);
      this.loadConfig();
      this.router.navigate(['/home']);
    } else {
      await this.showToast('Por favor, ingrese un dominio y puerto válidos.');
    }
  }


  async loadImageFromServer() {
    const dominio = await this.storageService.rescatar('dominio') || '192.168.69.18';
    const puerto = await this.storageService.rescatar('port') || '3000';
    const serverUrl = `https://${dominio}:${puerto}/api/auth/getimage`;

    this.http.get(serverUrl).subscribe(
      (response: any) => {
        console.log('Imagen obtenida:', response.imageUrl);  // Verifica la URL de la imagen
        this.imagenLogin = response.imageUrl; // Asigna la URL a la variable
      },
      (error) => {
        console.error('Error al cargar la imagen desde el servidor', error);
      }
    );
  }

  async testConnection() {
    const dominio = await this.storageService.rescatar('dominio') || '192.168.69.18';
    const puerto = await this.storageService.rescatar('port') || '3000';
    const serverUrl = `https://${dominio}:${puerto}/api/auth/testconnection`;

    this.http.get(serverUrl).subscribe(
      (response) => {
        // Si la conexión es exitosa
        this.showToast('Conexión exitosa al servidor!');
      },
      (error) => {
        // Si hay un error en la conexión
        console.error('Error de conexión', error);
        this.showToast('Error al conectar con el servidor.');
      }
    );
  }
}