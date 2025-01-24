import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-sincronizar',
  templateUrl: './sincronizar.page.html',
  styleUrls: ['./sincronizar.page.scss'],
  standalone: false,
})
export class SincronizarPage implements OnInit {
  constructor(private http: HttpClient, private sqliteService: SqliteService) { }

  ngOnInit() { }

  async obtenerLecturas() {
    const ruta = '0404-04- BAR'; // Ruta fija (puedes hacerlo dinámico si es necesario)
    const url = `http://localhost:3000/api/auth/lecturas?ruta=${ruta}`;

    try {
      const response: any = await this.http.get(url).toPromise();

      if (response.data) {
        console.log('Datos obtenidos desde el servidor:', response.data);
       /*  await this.sqliteService.guardarLecturas(response.data); */
        alert('Lecturas sincronizadas con éxito.');
      } else {
        alert('No se encontraron datos para sincronizar.');
      }
    } catch (error) {
      console.error('Error al obtener lecturas:', error);
      alert('Error al sincronizar datos.');
    }
  }
}