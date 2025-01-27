import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';
import { Geolocation } from '@capacitor/geolocation';



@Component({
  selector: 'app-tomalectura',
  templateUrl: './tomalectura.page.html',
  styleUrls: ['./tomalectura.page.scss'],
  standalone: false,
})
export class TomalecturaPage {
  registros: any[] = [];
  idCuenta: number = 0;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private ionicStorageService: IonicstorageService // Inyecta el servicio
  ) { }

  async ngOnInit() {
    try {
      const currentUrl = this.router.url;
      const urlSegments = currentUrl.split('/');
      const idFromUrl = urlSegments[urlSegments.length - 1];
      this.idCuenta = parseInt(idFromUrl, 10); // Convierte a número

      if (isNaN(this.idCuenta)) {
        console.error('El ID de cuenta en la URL no es válido:', idFromUrl);
        await this.presentToast('Error: El ID de cuenta no es válido.');
        return;
      }

      console.log('ID Cuenta obtenido:', this.idCuenta); // Asegúrate de que IDCUENTA se obtiene correctamente
      await this.cargarRegistros();
    } catch (error) {
      console.error('Error durante la inicialización:', error);
      await this.presentToast('Ocurrió un error al cargar la página.');
    }
  }

  async cargarRegistros() {
    try {
      const registro = await this.ionicStorageService.obtenerCuentaPorID(this.idCuenta);
      if (registro) {
        this.registros = [registro]; // Asegúrate de asignar un arreglo
        console.log('Registros cargados:', this.registros);
      } else {
        this.registros = [];
        console.warn(`No se encontraron registros para IDCUENTA: ${this.idCuenta}`);
        await this.presentToast('No se encontraron registros para el ID de cuenta proporcionado.');
      }
    } catch (error) {
      console.error('Error al cargar los registros:', error);
      await this.presentToast('Ocurrió un error al cargar los registros.');
    }
  }

  async guardarLectura(registro: any) {
    try {
      // Captura la posición del usuario
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Recupera el registro actual por su clave
      const registroExistente = await this.ionicStorageService.rescatar(registro.NRO_CUENTA);

      if (registroExistente) {
        // Actualiza los campos del registro existente
        registroExistente.X_LECTURA = longitude;
        registroExistente.Y_LECTURA = latitude;
        registroExistente.LECT_ACTUAL = registro.LECT_ACTUAL;

        // Guarda el registro actualizado
        await this.ionicStorageService.agregarConKey(registro.NRO_CUENTA, registroExistente);

        console.log('Registro actualizado con éxito:', registroExistente);
        await this.presentToast('Lectura actualizada correctamente.');
      } else {
        // Si no existe, muestra un mensaje de error
        console.warn(`No se encontró un registro con NRO_CUENTA: ${registro.NRO_CUENTA}. No se guardará la lectura.`);
        await this.presentToast('No se encontró el registro. Verifica el número de medidor.');
      }
    } catch (error) {
      console.error('Error al actualizar la lectura:', error);
      await this.presentToast('Ocurrió un error al actualizar la lectura.');
    }
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file);
    } else {
      console.warn('No se seleccionó ningún archivo.');
    }
  }
}