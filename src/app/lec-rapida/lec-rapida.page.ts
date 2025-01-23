import { Component, } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-lec-rapida',
  templateUrl: './lec-rapida.page.html',
  styleUrls: ['./lec-rapida.page.scss'],
  standalone: false,
})
export class LecRapidaPage {
  nroCuenta: string = ''; // Variable para el número de cuenta
  datosCuenta: any = null; // Variable para los datos de la cuenta
  error: string = ''; // Mensaje de error

  constructor(
    private toastController: ToastController,
    private http: HttpClient
  ) { }

  // Método para buscar los datos de la cuenta
  async buscar() {
    if (this.nroCuenta) {
      this.http
        .get(`http://localhost:3000/api/auth/lecturaR?cuenta=${this.nroCuenta}`)
        .subscribe(
          async (response: any) => {
            if (response?.data?.length) {
              this.datosCuenta = response.data[0]; // Obtén el primer resultado
              this.error = ''; // Limpia cualquier error anterior
            } else {
              this.datosCuenta = null;
              this.error = 'No se encontraron datos para este número de cuenta.';
              await this.presentToast(this.error, 'warning');
            }
          },
          async () => {
            this.datosCuenta = null;
            this.error = 'Ocurrió un error al buscar los datos.';
            await this.presentToast(this.error, 'danger');
          }
        );
    } else {
      // Si no se ingresó un número de cuenta
      this.datosCuenta = null;
      this.error = 'Por favor, ingresa un número de cuenta.';
      await this.presentToast(this.error, 'danger');
    }
  }

  // Método para mostrar un toast con un mensaje
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}