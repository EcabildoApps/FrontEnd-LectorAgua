import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicstorageService } from './ionicstorage.service'; // Asegúrate de que la ruta sea correcta
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EnviarlocalService {
  constructor(
    private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController
  ) { }

  async enviarLecturasAlServidor() {
    try {
      const dominio = await this.ionicStorageService.rescatar('dominio');
      const puerto = await this.ionicStorageService.rescatar('port');
      const apiUrl = `http://${dominio}:${puerto}/api/auth/lecturas`;

      const lecturasStorage = await this.ionicStorageService.rescatar('LECTURAS');

      if (!lecturasStorage?.data?.length) {
        this.mostrarToast('No hay lecturas para enviar.', 'warning');
        return;
      }

      console.log('Lecturas a enviar:', lecturasStorage.data);

      const lecturasExitosas = [];
      const lecturasFallidas = [];

      for (const lectura of lecturasStorage.data) {
        try {
          await this.http.post(apiUrl, lectura).toPromise();
          lecturasExitosas.push(lectura);
        } catch (error) {
          console.error('Error al enviar lectura:', lectura, error);
          lecturasFallidas.push(lectura);
        }
      }

      if (lecturasExitosas.length > 0) {
        // Filtrar las lecturas enviadas con éxito y actualizar el almacenamiento
        lecturasStorage.data = lecturasStorage.data.filter(
          (lectura) => !lecturasExitosas.includes(lectura)
        );
        await this.ionicStorageService.agregarConKey('LECTURAS', lecturasStorage);
        this.mostrarToast('Lecturas enviadas correctamente.', 'success');
      }

      if (lecturasFallidas.length > 0) {
        this.mostrarToast(`${lecturasFallidas.length} lecturas no pudieron enviarse.`, 'warning');
      }
    } catch (error) {
      console.error('Error en el proceso de envío de lecturas:', error);
      this.mostrarToast('Error al enviar lecturas. Verifica la conexión.', 'danger');
    }
  }



  async sincronizarImagenes() {
    try {
      const dominio = await this.ionicStorageService.rescatar('dominio');
      const puerto = await this.ionicStorageService.rescatar('port');
      const apiUrl = `http://${dominio}:${puerto}/api/auth/gimagen`;

      const datosGuardados = await this.ionicStorageService.listar();
      const imagenes = datosGuardados.find((item) => item.k === 'AGUAAPP_IMG');

      if (!imagenes?.v?.length) {
        console.log('No hay imágenes para sincronizar');
        return false;
      }

      const idCuenta = imagenes.v[0].IDCUENTA;
      const fechaRegistro = this.getFormattedDate();

      for (const imagen of imagenes.v) {
        const formData = new FormData();
        formData.append('ID_AGUALEC_APP_IMG', imagen.ID_AGUALEC_APP_IMG);
        formData.append('IDCUENTA', idCuenta);
        formData.append('TIPO_IMG', imagen.TIPO_IMG || 'JPEG');
        formData.append('RUTA', imagen.RUTA || '');
        formData.append('FECHA_REGISTRO', fechaRegistro);
        formData.append('DETALLE', imagen.DETALLE || '');

        // Convertir base64 a Blob si es necesario
        if (imagen.BYTE_IMG) {
          const blob = this.base64ToBlob(imagen.BYTE_IMG, imagen.TIPO_IMG || 'image/jpeg');
          formData.append('file', blob, imagen.PATH_IMG || 'imagen.jpg');
        }

        try {
          const response = await this.http.post(apiUrl, formData).toPromise();
          console.log('Imagen sincronizada correctamente:', response);
        } catch (error) {
          console.error('Error al sincronizar la imagen:', error);
          this.mostrarToast('Error al sincronizar la imagen.', 'danger');
        }
      }
      return true;
    } catch (error) {
      console.error('Error al sincronizar imágenes:', error);
      this.mostrarToast('Error al sincronizar imágenes.', 'danger');
      return false;
    }
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    try {
      const byteString = atob(base64.split(',')[1]); // Decodificar base64
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }
      return new Blob([uintArray], { type: mimeType });
    } catch (error) {
      console.error('Error al convertir base64 a Blob:', error);
      return new Blob();
    }
  }

  private getFormattedDate(): string {
    const date = new Date();
    return date.toISOString().replace('T', ' ').substring(0, 23);
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }
}