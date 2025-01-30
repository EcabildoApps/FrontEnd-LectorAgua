import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';



@Component({
  selector: 'app-tomalectura',
  templateUrl: './tomalectura.page.html',
  styleUrls: ['./tomalectura.page.scss'],
  standalone: false,
})
export class TomalecturaPage {
  registros: any[] = [];
  causas: any[] = [];
  novedades: any[] = [];
  idCuenta: number = 0;
  selectedImages: File[] = [];
  image1: string | undefined = undefined;  // Para la primera imagen
  image2: string | undefined = undefined;  // Para la segunda imagen

  constructor(
    private toastController: ToastController,
    private router: Router,
    private ionicStorageService: IonicstorageService
  ) { }

  async ngOnInit() {
    try {
      const currentUrl = this.router.url;
      const urlSegments = currentUrl.split('/');
      const idFromUrl = urlSegments[urlSegments.length - 1];
      this.idCuenta = parseInt(idFromUrl, 10);

      if (isNaN(this.idCuenta)) {
        await this.presentToast('Error: El ID de cuenta no es válido.');
        return;
      }
      await this.cargarCausasYNovedades();
      await this.cargarRegistros();
    } catch (error) {
      await this.presentToast('Ocurrió un error al cargar la página.');
    }
  }

  async cargarRegistros() {
    try {
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosLecturas(); // Usamos el nuevo método
      console.log('Registros de Lecturas:', registrosLecturas);

      // Filtrar registros por ID de cuenta
      const registrosFiltrados = registrosLecturas.filter(registro => registro.IDCUENTA === this.idCuenta);

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

  async cargarCausasYNovedades() {
    try {
      const datosGuardados = await this.ionicStorageService.listar();

      if (!datosGuardados || datosGuardados.length === 0) {
        await this.presentToast('No se encontraron datos guardados.');
        return;
      }

      // Cargar causas filtrando por el identificador 'CAUSAS'
      const causasData = datosGuardados
        .find(item => item.k === 'CAUSAS' && item.v) // Filtramos por 'CAUSAS'
        ?.v || [];

      // Cargar novedades filtrando por el identificador 'NOVEDADES'
      const novedadesData = datosGuardados
        .find(item => item.k === 'NOVEDADES' && item.v) // Filtramos por 'NOVEDADES'
        ?.v || [];

      // Asumimos que dentro de `v` hay una propiedad `data` que contiene la lista
      const causas = causasData?.data || [];
      const novedades = novedadesData?.data || [];

      // Si las causas o novedades no tienen datos, mostramos un mensaje
      if (causas.length === 0) {
        await this.presentToast('No se encontraron causas.');
      }
      if (novedades.length === 0) {
        await this.presentToast('No se encontraron novedades.');
      }

      // Filtramos y ordenamos los datos
      this.causas = causas
        .filter((item) => item.REN21CODI && item.REN21DESC) // Filtramos los elementos con estos campos
        .sort((a, b) => a.REN21DESC.localeCompare(b.REN21DESC));

      this.novedades = novedades
        .filter((item) => item.REN21CODI && item.REN21DESC) // Filtramos los elementos con estos campos
        .sort((a, b) => a.REN21DESC.localeCompare(b.REN21DESC));

      // Mostrar los resultados en consola (puedes eliminar esto después)
      console.log('Causas cargadas:', this.causas);
      console.log('Novedades cargadas:', this.novedades);

    } catch (error) {
      console.error('Error al cargar las causas y novedades:', error);
      await this.presentToast('Ocurrió un error al cargar las causas y novedades.');
    }
  }




  async guardarLectura(registro: any) {
    try {
      // Obtener la entrada "Lecturas" de la base de datos o almacenamiento
      const lecturas = await this.ionicStorageService.rescatar('LECTURAS');

      if (lecturas && lecturas.data && lecturas.data.length > 0) {
        // Buscar el índice del registro a actualizar usando el identificador (NRO_CUENTA o NRO_MEDIDOR)
        const index = lecturas.data.findIndex(item => item.NRO_CUENTA === registro.NRO_CUENTA);

        if (index !== -1) {
          // Si el registro existe, actualizamos sus valores
          const registroExistente = lecturas.data[index];

          const position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;


          registroExistente.LECT_ACTUAL = registro.LECT_ACTUAL;
          registroExistente.TIPOCAUSA = registro.TIPOCAUSA || '';
          registroExistente.TIPONOVEDAD = registro.TIPONOVEDAD || '';
          registroExistente.X_LECTURA = longitude;  // Coordenada de longitud (X)
          registroExistente.Y_LECTURA = latitude;


          // Actualizar las imágenes si están presentes
          if (registro.imagenes && registro.imagenes.length > 0) {
            registroExistente.IMAGENES = registro.imagenes;
          }

          // Guardar los datos actualizados
          await this.ionicStorageService.agregarConKey('LECTURAS', lecturas);

          await this.presentToast('Lectura actualizada correctamente.');
        } else {
          // Si no se encuentra el registro
          await this.presentToast('No se encontró el registro con el número de cuenta proporcionado.');
        }
      } else {
        await this.presentToast('No hay datos de lecturas almacenados.');
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



  // Método para abrir la cámara y tomar una foto
  async takePhoto(photoNumber: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 90, // Calidad de la imagen
        source: CameraSource.Camera, // Usar la cámara
        resultType: CameraResultType.Uri, // Obtener URI de la imagen
        correctOrientation: true, // Corregir la orientación de la imagen
      });

      // Dependiendo del número de la foto, asigna la imagen tomada
      if (photoNumber === 1) {
        this.image1 = image.webPath;  // Guardar la primera imagen
      } else if (photoNumber === 2) {
        this.image2 = image.webPath;  // Guardar la segunda imagen
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
}