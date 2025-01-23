import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-lectura-nleidas',
  templateUrl: './lectura-nleidas.page.html',
  styleUrls: ['./lectura-nleidas.page.scss'],
  standalone: false,
})
export class LecturaNleidasPage implements OnInit {

  filtros: string = ''; // Filtro(s) ingresado(s), ejemplo: "cuenta,medidor"
  valorFiltro: string = ''; // Valor del filtro a buscar
  rutaSeleccionada: string = ''; // Ruta seleccionada (inicialmente en blanco)
  rutasDisponibles: string[] = []; // Lista de rutas disponibles
  registros: any[] = []; // Lista de registros obtenidos de la API

  constructor(private http: HttpClient, private toastController: ToastController) { }

  ngOnInit() {
    // Obtener las rutas del localStorage (que fue guardado al hacer login)
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas); // Parseamos las rutas guardadas y las asignamos
    }
  }

  /**
   * Método para cargar registros desde la API.
   * Filtra los registros por ruta y aplica filtros si se ingresan.
   */
  cargarRegistros() {
    // Verificar que la ruta esté seleccionada y que haya filtros ingresados
    if (!this.rutaSeleccionada) {
      this.registros = []; // Si no hay ruta seleccionada, no mostrar registros
      return;
    }

    // Construir la URL de la API
    let url = `http://localhost:3000/api/auth/correctL?ruta=${this.rutaSeleccionada}`;

    // Si hay filtros y valor, agregar a la URL
    if (this.filtros && this.valorFiltro) {
      url += `&filtros=${this.filtros}&valor=${this.valorFiltro}`;
    }

    // Hacer la solicitud HTTP para obtener los registros filtrados
    this.http.get(url).subscribe(
      async (response: any) => {
        if (response?.data?.length) {
          this.registros = response.data; // Almacena los datos obtenidos
        } else {
          this.registros = []; // Si no hay registros
          await this.presentToast('No se encontraron registros.');
        }
      },
      async (error) => {
        console.error('Error al cargar registros:', error);
        this.registros = []; // Manejar el estado de error
        await this.presentToast('Ocurrió un error al cargar los registros.');
      }
    );
  }

  /**
   * Método para mostrar un mensaje Toast
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'bottom', // Posición del toast
    });
    toast.present();
  }
}