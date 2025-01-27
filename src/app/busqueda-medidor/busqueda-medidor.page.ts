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
  NRO_MEDIDOR: string = '';   // Variable para el número de medidor
  datosMedidor: any = [];     // Variable para los datos del medidor
  error: string = '';         // Mensaje de error

  constructor(
    private ionicStorageService: IonicstorageService, // Usamos el servicio de almacenamiento
    private toastController: ToastController          // Para mostrar notificaciones
  ) { }

  // Método para realizar la búsqueda del medidor mientras se escribe
  async onInputChange() {
    if (this.NRO_MEDIDOR.trim()) {
      try {
        // Buscar medidores que coincidan con el número ingresado
        const medidores = await this.ionicStorageService.buscarMedidoresPorNumeroParcial(this.NRO_MEDIDOR);

        if (medidores && medidores.length > 0) {
          this.datosMedidor = medidores; // Asignar los medidores encontrados
          this.error = ''; // Limpia el error si la búsqueda es exitosa
        } else {
          this.datosMedidor = [];
          this.error = 'No se encontraron medidores que coincidan con la búsqueda.';
        }
      } catch (error) {
        this.datosMedidor = [];
        this.error = 'Error al acceder a los datos del medidor.';
        await this.presentToast(this.error); // Muestra un toast de error
      }
    } else {
      this.datosMedidor = []; // Si no hay texto, limpia los resultados
    }
  }

  // Método para mostrar un toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duración en milisegundos
      position: 'bottom',  // Posición del toast
    });
    toast.present();
  }
}