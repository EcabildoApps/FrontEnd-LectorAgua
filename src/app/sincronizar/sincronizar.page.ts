import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicstorageService } from '../services/ionicstorage.service';

@Component({
  selector: 'app-sincronizar',
  templateUrl: './sincronizar.page.html',
  styleUrls: ['./sincronizar.page.scss'],
  standalone: false,
})
export class SincronizarPage implements OnInit {

  rutasDisponibles: string[] = [];

  constructor(private http: HttpClient, private ionicStorageService: IonicstorageService) { }

  ngOnInit() {
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas);
    }
  }

  async obtenerDatos() {

    // URLs para las tablas
    const urlLecturas = `http://localhost:3000/api/auth/lecturas?ruta=${this.rutasDisponibles}`;
    const urlCatalogo = `http://localhost:3000/api/auth/catalogo`;

    try {
      // Obtener lecturas de la tabla AGUALEC_APP
      const responseLecturas: any = await this.http.get(urlLecturas).toPromise();
      if (responseLecturas.data && Array.isArray(responseLecturas.data) && responseLecturas.data.length > 0) {
        console.log('Lecturas obtenidas:', responseLecturas.data);

        // Guardar lecturas en el almacenamiento local (sobreescribir siempre)
        for (let lectura of responseLecturas.data) {
          await this.ionicStorageService.agregarConKey(lectura.NRO_CUENTA, lectura); // Sobrescribe directamente
          console.log(`Registro de lectura actualizado para NRO_CUENTA: ${lectura.NRO_CUENTA}`);
        }

        alert('Lecturas sincronizadas con éxito.');
      } else {
        console.warn('No se encontraron lecturas para sincronizar.');
      }

      // Obtener catálogos de la tabla REN21
      const responseCatalogo: any = await this.http.get(urlCatalogo).toPromise();
      if (responseCatalogo.data && Array.isArray(responseCatalogo.data) && responseCatalogo.data.length > 0) {
        console.log('Catálogos obtenidos:', responseCatalogo.data);

        // Guardar catálogos en el almacenamiento local (solo si no existen)
        for (let catalogo of responseCatalogo.data) {
          const registroExistente = await this.ionicStorageService.rescatar(catalogo.REN21CODI);

          if (!registroExistente) {
            // Si no existe, se agrega el nuevo registro
            await this.ionicStorageService.agregarConKey(catalogo.REN21CODI, catalogo);
          }
        }

        alert('Catálogos sincronizados con éxito.');
      } else {
        console.warn('No se encontraron catálogos para sincronizar.');
      }
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
      alert('Ocurrió un error al sincronizar los datos. Por favor, verifica la conexión al servidor.');
    }
  }




  // Método para sincronizar las lecturas locales con la API (si es necesario)
  async sincronizarLecturas() {
    const ruta = '0404-04- BAR'; // Ruta fija (puedes hacerlo dinámico si es necesario)
    await this.ionicStorageService.sincronizarConApi(ruta);
  }

}