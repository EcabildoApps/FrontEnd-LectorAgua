import { Component,  } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lec-rapida',
  templateUrl: './lec-rapida.page.html',
  styleUrls: ['./lec-rapida.page.scss'],
  standalone: false,
})
export class LecRapidaPage {

  nroCuenta: string = '';

  constructor(private toastController: ToastController) {}

  async buscar() {
    if (this.nroCuenta) {
      // Simulación de búsqueda
      const toast = await this.toastController.create({
        message: `Buscando el número de cuenta: ${this.nroCuenta}`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor ingresa un número de cuenta.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
