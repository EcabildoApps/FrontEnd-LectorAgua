import { AfterViewInit, Component } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import * as maplibregl from 'maplibre-gl';
import { Feature, LineString, GeoJSON } from 'geojson';


@Component({
  selector: 'app-ubilectura',
  templateUrl: './ubilectura.page.html',
  styleUrls: ['./ubilectura.page.scss'],
  standalone: false,
})

export class UbilecturaPage implements AfterViewInit {
  lecturas: any[] = [];
  lecturasFiltradas: any[] = [];
  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  constructor(private ionicStorageService: IonicstorageService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.obtenerCoordenadasYMostrar();
    }, 500);
  }

  async obtenerCoordenadasYMostrar() {
    try {
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosLecturas();
      console.log('Registros de lecturas:', registrosLecturas);

      if (!registrosLecturas || registrosLecturas.length === 0) {
        console.warn("No se encontraron lecturas registradas.");
        return;
      }

      // Almacenar las lecturas en el array
      this.lecturas = registrosLecturas;
      this.lecturasFiltradas = [...this.lecturas]; // Inicializar lecturasFiltradas con todas las lecturas

      // Inicializar mapa con las coordenadas predeterminadas
      const lng = -78.545038;
      const lat = -1.329917;
      this.inicializarMapa(lng, lat);

      // Cargar los marcadores después de que el mapa esté inicializado
      this.agregarMarcadores(this.lecturasFiltradas);

    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
    }
  }


  inicializarMapa(lng: number, lat: number) {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.error("Coordenadas inválidas:", lat, lng);
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
      center: [lng, lat],
      zoom: 15,
      maxZoom: 20,
      minZoom: 3,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
  }

  agregarMarcadores(lecturas: any[]) {
    if (!this.map) return;

    // Eliminar marcadores anteriores
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    lecturas.forEach((lectura) => {
      const lat = lectura.Y_LECTURA;
      const lng = lectura.X_LECTURA;

      if (lat && lng) {
        const marker = new maplibregl.Marker({ draggable: false })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup().setHTML(
            `<b>${lectura.CONSUMIDOR}</b><br>${lectura.DIRECCION}`
          ))
          .addTo(this.map);

        this.markers.push(marker);
      }
    });
  }

  filtrarMarcadores(event: any) {
    const valorBusqueda = event.target.value?.trim() || '';

    if (!valorBusqueda) {
      // Si no hay valor, mostrar todos los marcadores
      this.lecturasFiltradas = [...this.lecturas];
    } else {
      // Filtrar las lecturas según el IDCUENTA
      this.lecturasFiltradas = this.lecturas.filter(lectura =>
        lectura.IDCUENTA.toString().includes(valorBusqueda)
      );
    }

    // Actualizar marcadores en el mapa de acuerdo a las lecturas filtradas
    this.agregarMarcadores(this.lecturasFiltradas);
  }

}