import { Component, OnInit } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-informacion-p',
  templateUrl: './informacion-p.page.html',
  styleUrls: ['./informacion-p.page.scss'],
  standalone: false,
})
export class InformacionPPage implements OnInit {

  predios: any[] = [];
  PUR01CODI: number = 0;
  registros: any[] = [];

  constructor(private toastController: ToastController,
    private router: Router,
    private ionicStorageService: IonicstorageService,
    private alertController: AlertController) { }

  async ngOnInit() {
    try {
      const currentUrl = this.router.url;
      const urlSegments = currentUrl.split('/');
      const idFromUrl = urlSegments[urlSegments.length - 1];
      this.PUR01CODI = parseInt(idFromUrl, 10);

      if (isNaN(this.PUR01CODI)) {
        await this.presentToast('Error: El ID de cuenta no es válido.');
        return;
      }

      await this.cargarRegistros();
    } catch (error) {
      await this.presentToast('Ocurrió un error al cargar la página.');
    }


  }
  async cargarRegistros() {
    try {
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosPredios(); // Usamos el nuevo método
      console.log('Registros de predioS:', registrosLecturas);

      // Filtrar registros por ID de cuenta
      const registrosFiltrados = registrosLecturas.filter(registro => registro.PUR01CODI === this.PUR01CODI);

      if (registrosFiltrados.length > 0) {
        this.registros = registrosFiltrados;
        console.log('Registros filtrados:', this.registros);
      } else {
        this.registros = [];
        await this.presentToast('No se encontraron registros para el ID de cuenta proporcionado.');
      }
    } catch (error) {
      console.error('Error al cargar los registros:', error);
      await this.presentToast('Ocurrió un error al cargar los registros.');
    }
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    toast.present();
  }

  async mostrarMensaje() {
    const alert = await this.alertController.create({
      header: 'Construcción',
      message: 'Se va a abrir el módulo de construcción.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/contruccion-u']);
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}