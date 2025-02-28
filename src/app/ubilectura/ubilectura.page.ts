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
  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  // Punto de referencia inicial (Longitud y Latitud)
  referencia = {
    lat: -1.329583,
    lng: -78.545528
  };

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

      // Inicializar mapa con el punto de referencia inicial
      this.inicializarMapa(this.referencia.lng, this.referencia.lat);

      // Agregar todos los marcadores al mapa
      this.agregarMarcadores(registrosLecturas);

      // Agregar las líneas entre las lecturas
      // this.agregarLineas([this.referencia, ...registrosLecturas]);
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
/* 
  agregarLineas(lecturas: any[]) {
    if (!this.map || lecturas.length < 2) return;
  
    const coordinates: [number, number][] = lecturas
      .map(lectura => {
        const lng = parseFloat(lectura.X_LECTURA);
        const lat = parseFloat(lectura.Y_LECTURA);
        return (!isNaN(lng) && !isNaN(lat)) ? [lng, lat] : null;
      })
      .filter(coord => coord !== null) as [number, number][];
  
    const geoJsonData: Feature<LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordinates
      }
    };
  
    if (this.map.loaded()) {
      this.dibujarLinea(geoJsonData);
    } else {
      this.map.on('load', () => {
        this.dibujarLinea(geoJsonData);
      });
    }
  }
  
  dibujarLinea(geoJsonData: Feature<LineString>) {
    if (this.map.getSource('line-source')) {
      (this.map.getSource('line-source') as maplibregl.GeoJSONSource).setData(geoJsonData);
    } else {
      this.map.addSource('line-source', {
        type: 'geojson',
        data: geoJsonData
      });
  
      this.map.addLayer({
        id: 'line-layer',
        type: 'line',
        source: 'line-source',
        paint: {
          'line-color': '#FF0000',
          'line-width': 4
        }
      });
    }
  } */
  
}