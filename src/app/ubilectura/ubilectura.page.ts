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
  ngAfterViewInit() {
    setTimeout(() => {

      this.obtenerCoordenadasYMostrar();
    }, 500); // Pequeño retraso para asegurar que el DOM esté listo
  }


  inicializarMapa(xLectura: number, yLectura: number) {
    if (!xLectura || !yLectura || isNaN(xLectura) || isNaN(yLectura)) {
      console.error("Coordenadas inválidas:", xLectura, yLectura);
      return;
    }

    this.map = new maplibregl.Map({
      container: 'map',
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
      center: [xLectura, yLectura],
      zoom: 15,
      maxZoom: 20,
      minZoom: 3,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Crear un marcador personalizado
    const markerElement = document.createElement('div');
    markerElement.innerHTML = '📍';
    markerElement.style.fontSize = '24px';
    markerElement.style.position = 'absolute';
    markerElement.style.left = '50%';
    markerElement.style.top = '50%';
    markerElement.style.transform = 'translate(-50%, -50%)';
    markerElement.style.pointerEvents = 'none'; // Evita que interfiera con eventos del mapa

    this.map.getContainer().appendChild(markerElement);
  }


  async obtenerCoordenadasYMostrar() {
    try {
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosLecturas();

      if (registrosLecturas.length > 0) {
        const lectura = registrosLecturas[0];
        const xLectura = lectura.X_LECTURA;
        const yLectura = lectura.Y_LECTURA;

        console.log("Coordenadas obtenidas:", xLectura, yLectura); // Para depuración

        this.inicializarMapa(xLectura, yLectura);
      } else {
        console.warn("No se encontraron lecturas registradas.");
      }
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
    }
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
        // Crear un marcador personalizado
        const marker = new maplibregl.Marker({
          draggable: false, // Hacer que el marcador no sea arrastrable
          pitchAlignment: "viewport", // Evita que desaparezca con el zoom
          rotationAlignment: "viewport", // Mantiene la orientación estática
        })
          .setLngLat([lng, lat]) // Fijar la posición exacta
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