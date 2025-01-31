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
  image1: string | null = null; // Imagen 1 (base64 o URL)
  image2: string | null = null; // Imagen 2 (base64 o URL)

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
      const lecturas = await this.ionicStorageService.rescatar('LECTURAS') || { data: [] };

      console.log('Lectura recibida:', registro);

      const index = lecturas.data.findIndex(item => item.NRO_CUENTA === registro.NRO_CUENTA);

      if (index !== -1) {
        const registroExistente = lecturas.data[index];
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;

        registroExistente.LECT_ACTUAL = registro.LECT_ACTUAL;
        registroExistente.TIPOCAUSA = registro.TIPOCAUSA || '';
        registroExistente.TIPONOVEDAD = registro.TIPONOVEDAD || '';
        registroExistente.X_LECTURA = longitude;
        registroExistente.Y_LECTURA = latitude;

        await this.ionicStorageService.agregarConKey('LECTURAS', lecturas);
        await this.presentToast('Lectura guardada correctamente.');
      } else {
        await this.presentToast('No se encontró el registro con el número de cuenta proporcionado.');
      }
    } catch (error) {
      console.error('Error al guardar la lectura:', error);
      await this.presentToast('Hubo un error al guardar la lectura.');
    }
  }


  async guardarImagenes() {
    try {
      const rutaGuardada = localStorage.getItem('rutas');

      if (!rutaGuardada) {
        console.log('No se encontró la ruta en el localStorage.');
        await this.presentToast('No se encontró la ruta de guardado.');
        return;
      }

      const rutaArray = JSON.parse(rutaGuardada);

      if (!Array.isArray(rutaArray) || rutaArray.length === 0) {
        console.log('El array de rutas está vacío o no es válido.');
        await this.presentToast('Ruta de guardado no válida.');
        return;
      }

      const rutaFormateada = rutaArray[0]?.trim() || '';

      if (!rutaFormateada) {
        console.log('La ruta formateada está vacía.');
        await this.presentToast('Error al obtener la ruta de guardado.');
        return;
      }

      console.log('Ruta obtenida:', rutaFormateada);

      if (!this.idCuenta) {
        console.log('ID de cuenta no definido.');
        await this.presentToast('Error: ID de cuenta no encontrado.');
        return;
      }

      // Guardar la primera imagen si existe
      if (this.image1 && this.image1.startsWith('data:image')) {
        const byteImg1 = await this.dataURItoBlob(this.image1);
        await this.ionicStorageService.guardarImagenAGUAAPP(
          byteImg1,
          'image1.jpg',
          'jpg',
          rutaFormateada,
          this.idCuenta.toString()
        );
      }

      // Guardar la segunda imagen si existe
      if (this.image2 && this.image2.startsWith('data:image')) {
        const byteImg2 = await this.dataURItoBlob(this.image2);
        await this.ionicStorageService.guardarImagenAGUAAPP(
          byteImg2,
          'image2.jpg',
          'jpg',
          rutaFormateada,
          this.idCuenta.toString()
        );
      }

      await this.presentToast('Imágenes guardadas correctamente.');
    } catch (error) {
      console.error('Error al guardar las imágenes:', error);
      await this.presentToast('Hubo un error al guardar las imágenes.');
    }
  }

  async dataURItoBlob(dataURI: string): Promise<Blob> {
    try {
      if (!dataURI || !dataURI.includes(',')) {
        throw new Error('Formato de imagen inválido.');
      }

      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      console.log('Tipo MIME del archivo:', mimeString);
      return new Blob([uintArray], { type: mimeString });
    } catch (error) {
      console.error('Error al convertir dataURI a Blob:', error);
      throw error;
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

  // Método para abrir la cámara y tomar una foto
  async takePhoto(photoNumber: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 90, // Calidad de la imagen
        source: CameraSource.Camera, // Usar la cámara
        resultType: CameraResultType.DataUrl, // Obtener URI de la imagen
        correctOrientation: true, // Corregir la orientación de la imagen
      });

      if (!image || !image.dataUrl) {
        throw new Error('No se pudo obtener la imagen.');
      }

      // Asigna la imagen tomada al atributo correspondiente
      if (photoNumber === 1) {
        this.image1 = image.dataUrl;
      } else if (photoNumber === 2) {
        this.image2 = image.dataUrl;
      }

      console.log(`Foto ${photoNumber} tomada correctamente.`);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      await this.presentToast('Error al capturar la foto.');
    }
  }
}  