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

      if (!registrosLecturas || registrosLecturas.length === 0) {
        console.warn("No se encontraron lecturas registradas.");
        return;
      }

      // Inicializar mapa con la primera lectura
      const { X_LECTURA, Y_LECTURA } = registrosLecturas[0];
      this.inicializarMapa(X_LECTURA, Y_LECTURA);

      // Agregar todos los marcadores al mapa
      this.agregarMarcadores(registrosLecturas);
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
    }
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
}