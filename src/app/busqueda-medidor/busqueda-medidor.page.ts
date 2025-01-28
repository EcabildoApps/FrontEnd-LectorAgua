import { Component } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service'; // Asegúrate de tener el servicio de IonicStorage importado
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-busqueda-medidor',
  templateUrl: './busqueda-medidor.page.html',
  styleUrls: ['./busqueda-medidor.page.scss'],
  standalone: false,
})
export class BusquedaMedidorPage {
  NRO_MEDIDOR: string = '';  // Variable para el número de medidor
  datosMedidor: any[] = [];  // Datos de los medidores encontrados
  error: string = '';  // Mensaje de error

  constructor(
    private ionicStorageService: IonicstorageService, // Servicio de almacenamiento
    private toastController: ToastController          // Para mostrar notificaciones
  ) { }

  // Método para realizar la búsqueda del medidor mientras se escribe
  async onInputChange() {
    if (this.NRO_MEDIDOR.trim()) {
      try {
        const medidores = await this.ionicStorageService.buscarMedidoresPorNumeroParcial(this.NRO_MEDIDOR);
        if (medidores.length > 0) {
          this.datosMedidor = medidores;
          this.error = '';
        } else {
          this.datosMedidor = [];
          this.error = 'No se encontraron medidores que coincidan con la búsqueda.';
        }
      } catch (error) {
        this.datosMedidor = [];
        this.error = 'Error al acceder a los datos del medidor.';
        await this.presentToast(this.error);
      }
    } else {
      this.datosMedidor = [];  // Limpiar los resultados si no hay texto
      this.error = '';
    }
  }

  // Mostrar un mensaje tipo toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}