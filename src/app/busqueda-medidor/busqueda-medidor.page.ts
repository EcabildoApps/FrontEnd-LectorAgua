import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-busqueda-medidor',
  templateUrl: './busqueda-medidor.page.html',
  styleUrls: ['./busqueda-medidor.page.scss'],
  standalone: false,
})
export class BusquedaMedidorPage {
  nroMedidor: string = '';   // Variable para el número de medidor
  datosMedidor: any = null;  // Variable para los datos del medidor
  error: string = '';        // Mensaje de error

  constructor(
    private http: HttpClient,
    private toastController: ToastController  // Cambié a ToastController
  ) { }

  // Método para realizar la búsqueda del medidor
  async buscar() {
    if (this.nroMedidor) {
      // Realiza la solicitud GET a la API de búsqueda del medidor
      this.http.get(`http://localhost:3000/api/auth/meter?medidor=${this.nroMedidor}`).subscribe(
        async (response: any) => {
          // Accede a los datos dentro de la propiedad "data"
          if (response?.data?.length) {
            this.datosMedidor = response.data; // Almacena los datos
            this.error = ''; // Limpia el error si la búsqueda es exitosa
          } else {
            this.datosMedidor = null;
            this.error = 'No se encontraron datos para el medidor.';
            await this.presentToast(this.error); // Muestra un toast de error
          }
        },
        async (error) => {
          // Si ocurre un error en la solicitud
          await this.presentToast('Ocurrió un error al buscar el medidor.'); // Muestra un toast de error
        }
      );
    } else {
      // Si no se ingresa el número de medidor
      await this.presentToast('Por favor, ingresa un número de medidor.'); // Muestra un toast de error
    }
  }


  // Método para mostrar un toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duración en milisegundos
      position: 'bottom',  // Posición del toast
    });
    toast.present();
  }
}
