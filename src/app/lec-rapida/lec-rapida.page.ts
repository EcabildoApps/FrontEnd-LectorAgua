import { Component } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service'; // Asegúrate de tener el servicio de IonicStorage importado
import { NavController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-lec-rapida',
  templateUrl: './lec-rapida.page.html',
  styleUrls: ['./lec-rapida.page.scss'],
  standalone: false,
})
export class LecRapidaPage {
  NRO_CUENTA: string = '';   // Variable para el número de medidor
  datosMedidor: any = [];     // Variable para los datos del medidor
  error: string = '';         // Mensaje de error

  constructor(
    private ionicStorageService: IonicstorageService, // Usamos el servicio de almacenamiento
    private toastController: ToastController,
    private navCtrl: NavController,
  ) { }

  // Método para realizar la búsqueda del medidor mientras se escribe
  async onInputChange() {
    if (this.NRO_CUENTA.trim()) {
      try {
        // Buscar medidores que coincidan con el número ingresado
        const medidores = await this.ionicStorageService.buscarCuentaNumeroParcial(this.NRO_CUENTA);

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

  async irATomaLectura(idCuenta: number) {
    console.log('ID Cuenta seleccionada:', idCuenta);

    try {
      // Obtener los registros de la clave 'LECTURAS' del almacenamiento
      const datosLecturas = await this.ionicStorageService.obtenerRegistrosPorClave('LECTURAS');

      // Verificamos si la clave 'LECTURAS' tiene datos
      if (!datosLecturas || !datosLecturas.data || datosLecturas.data.length === 0) {
        await this.presentToast('No se encontraron lecturas almacenadas.');
        return;
      }

      // Buscar el registro con el IDCUENTA proporcionado
      const registro = datosLecturas.data.find(item => item.IDCUENTA === idCuenta);

      if (registro) {
        console.log('Registro encontrado:', registro);
        this.navCtrl.navigateForward(`/tomalectura/${idCuenta}`);
      } else {
        console.error('No se encontró ningún registro con el ID proporcionado.');
        await this.presentToast('No se encontró el registro para esta cuenta.');
      }
    } catch (error) {
      console.error('Error al intentar obtener el registro:', error);
      await this.presentToast('Ocurrió un error al buscar el registro de lectura.');
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