import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';
import { EnviarlocalService } from '../services/enviarlocal.service';

@Component({
  selector: 'app-sincronizar',
  templateUrl: './sincronizar.page.html',
  styleUrls: ['./sincronizar.page.scss'],
  standalone: false,
})
export class SincronizarPage implements OnInit {

  rutasDisponibles: string[] = [];
  lecturas: any[] = [];  // Variable para almacenar los datos de lecturas


  constructor(private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController,
    private enviarlocalService: EnviarlocalService) { }

  ngOnInit() {
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas);
    }
    this.obtenerLecturas();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    toast.present();
  }


  async obtenerLecturas() {
    try {
      const lecturasGuardadas = await this.ionicStorageService.rescatar('LECTURAS');
      if (lecturasGuardadas && lecturasGuardadas.data) {
        this.lecturas = lecturasGuardadas.data;
      } else {
        console.warn('No se encontraron lecturas almacenadas');
      }
    } catch (error) {
      console.error('Error al recuperar lecturas:', error);
    }
  }

  async obtenerDatos() {

    const dominio = await this.ionicStorageService.rescatar('dominio');
    const puerto = await this.ionicStorageService.rescatar('port');
    if (!dominio || !puerto) {
      await this.showToast('Dominio o puerto no configurados.');
      return;
    }

    const baseUrl = `http://${dominio}:${puerto}`;

    const urlLecturas = `${baseUrl}/api/auth/lecturas?ruta=${this.rutasDisponibles}`;
    const urlCatalogo = `${baseUrl}/api/auth/causas`;
    const urlNovedad = `${baseUrl}/api/auth/novedades`;

    try {
      const response = await this.http.get<any>(urlLecturas).toPromise();

      if (response.message && response.message.includes('No se encontraron lecturas')) {
        await this.showToast('No se encontraron lecturas para la ruta proporcionada.');
      } else if (response.data) {
        await this.sincronizarTabla(
          urlLecturas,
          'Lecturas',
          'NRO_CUENTA'
        );

        // Procesar catálogos
        await this.sincronizarTabla(
          urlCatalogo,
          'Catálogos',
          'REN21CODI',
          false // Evitar sobreescribir
        );

        // Procesar novedades
        await this.sincronizarTabla(
          urlNovedad,
          'Novedades',
          'REN21CODI'
        );
        await this.showToast('Datos sincronizados correctamente.');
      }
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
      await this.showToast('Ocurrió un error al sincronizar los datos. Por favor, verifica la conexión al servidor.');
    }
  }

  private async sincronizarTabla(
    url: string,
    nombreTabla: string,
    key: string,
    sobrescribir: boolean = true
  ) {
    console.log(`Sincronizando ${nombreTabla} desde: ${url}`);

    const response: any = await this.http.get(url).toPromise();
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log(`${nombreTabla} obtenidas:`, response.data);

      const dataToStore = {
        nombreTabla: nombreTabla,
        data: response.data,
      };

      // Definir la clave basada en el tipo de tabla
      let keyValue: string;
      if (nombreTabla === 'Lecturas') {
        keyValue = 'LECTURAS'; // Clave para lecturas
      } else if (nombreTabla === 'Catálogos') {
        keyValue = 'CAUSAS'; // Clave para causas
      } else if (nombreTabla === 'Novedades') {
        keyValue = 'NOVEDADES'; // Clave para novedades
      } else {
        keyValue = nombreTabla.toUpperCase(); // Usar el nombre de la tabla si no se encuentra en los casos anteriores
      }

      // Verifica si debe sobrescribir o no
      if (sobrescribir) {
        await this.ionicStorageService.agregarConKey(keyValue, dataToStore);
        console.log(`Datos de ${nombreTabla} almacenados bajo la clave: ${keyValue}`);
      } else {
        const registroExistente = await this.ionicStorageService.rescatar(keyValue);
        if (!registroExistente) {
          await this.ionicStorageService.agregarConKey(keyValue, dataToStore);
          console.log(`Nuevo registro agregado para ${nombreTabla} bajo la clave: ${keyValue}`);
        }
      }

      console.log(`${nombreTabla} sincronizadas con éxito.`);
    } else {
      console.warn(`No se encontraron datos para ${nombreTabla}.`);
    }
  }



  async actualizarLecturas() {
    const sincronizado = await this.enviarlocalService.sincronizarImagenes();
    this.enviarlocalService.enviarLecturasAlServidor();

    if (sincronizado) {
      await this.showToast('¡Imágenes y Lectura sincronizadas con éxito!');
    } else {
      await this.showToast('Hubo un problema al sincronizar los datos.');
    }
  }

  async limpiarLecturas() {
    try {
      await this.ionicStorageService.eliminarLecturas();
      await this.ionicStorageService.eliminarImagenes();
      this.lecturas = [];

      await this.showToast('Lecturas e imagenes limpiadas correctamente');
    } catch (error) {
      await this.showToast('Error al limpiar las lecturas e imagenes.');
    }
  }






}