import { AfterViewInit, Component } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import * as maplibregl from 'maplibre-gl';



@Component({
  selector: 'app-ubilectura',
  templateUrl: './ubilectura.page.html',
  styleUrls: ['./ubilectura.page.scss'],
  standalone: false,
})

export class UbilecturaPage implements AfterViewInit {

  lecturas: any[] = [];
  lecturasFiltradas: any[] = [];
  selectedEstado: string = 'TOMA DE LECTURAS'; // Estado predeterminado
  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  constructor(private ionicStorageService: IonicstorageService) { }

  // Ejecutar después de que la vista esté inicializada
  async ngAfterViewInit() {
    await this.cargarLecturas(); // Cargar las lecturas primero
    await this.obtenerCoordenadasYMostrar(); // Obtener coordenadas y mostrar en mapa
  }

  // Obtener las coordenadas desde Ionic Storage y mostrar el mapa
  async obtenerCoordenadasYMostrar() {
    try {
      // Obtener los registros de lecturas desde Ionic Storage
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosLecturas();
      // Buscar la coordenada X y Y (en este ejemplo, tomo el primer registro)
      const lectura = registrosLecturas[0];
      const xLectura = lectura.X_LECTURA;
      const yLectura = lectura.Y_LECTURA;

      // Inicializar el mapa después de obtener las coordenadas
      this.inicializarMapa(xLectura, yLectura);
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
    }
  }

  // Inicializar el mapa con las coordenadas obtenidas
  inicializarMapa(xLectura: number, yLectura: number) {
    // Crear el mapa
    this.map = new maplibregl.Map({
      container: 'map', // Contenedor del mapa en el HTML
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [xLectura, yLectura], // Coordenadas donde se centra el mapa
      zoom: 15, // Nivel de zoom del mapa (puedes ajustarlo si es necesario)
    });

    // Eliminar el control de navegación (zoom, rotación)
    //this.map.addControl(new maplibregl.NavigationControl()); // Elimina esta línea si no quieres los controles de zoom y rotación.

    this.agregarMarcadores(); // Agregar los marcadores en el mapa
  }

  // Agregar marcadores de las lecturas filtradas
  agregarMarcadores() {
    if (!this.map) return;

    // Eliminar marcadores anteriores
    this.markers.forEach(marker => marker.remove());
    this.markers = []; // Limpiar la lista de marcadores

    // Agregar los nuevos marcadores al mapa
    this.lecturasFiltradas.forEach((lectura) => {
      const lat = lectura.Y_LECTURA;
      const lng = lectura.X_LECTURA;

      if (lat && lng) {
        // Crear un marcador con un círculo
        const el = document.createElement('div');
        el.style.backgroundColor = '#ff0000'; // Color del círculo
        el.style.borderRadius = '50%';
        el.style.width = '30px'; // Ancho del círculo
        el.style.height = '30px'; // Alto del círculo
        el.style.cursor = 'pointer';

        // Crear y agregar el marcador
        const marker = new maplibregl.Marker(el)
          .setLngLat([lng, lat]) // Establecer las coordenadas
          .setPopup(new maplibregl.Popup().setHTML(
            `<b>${lectura.CONSUMIDOR}</b><br>${lectura.DIRECCION}`
          )) // Mostrar la dirección al hacer clic
          .addTo(this.map); // Añadir al mapa

        this.markers.push(marker); // Guardar el marcador
      }
    });
  }

  // Cargar lecturas desde Ionic Storage
  async cargarLecturas() {
    const listado = await this.ionicStorageService.rescatar('LECTURAS');
    this.lecturas = listado?.data || [];
    this.filtrarEstado(); // Filtrar las lecturas por estado
  }

  // Filtrar las lecturas por estado
  filtrarEstado() {
    this.lecturasFiltradas = this.lecturas.filter(
      (lectura) => lectura.ESTADO === this.selectedEstado.toUpperCase()
    );
    this.agregarMarcadores(); // Actualizar el mapa con los nuevos marcadores filtrados
  }
}