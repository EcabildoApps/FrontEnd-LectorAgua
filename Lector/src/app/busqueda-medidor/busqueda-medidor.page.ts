import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-busqueda-medidor',
  templateUrl: './busqueda-medidor.page.html',
  styleUrls: ['./busqueda-medidor.page.scss'],
  standalone: false,
})
export class BusquedaMedidorPage {


  nroMedidor: string = '';

  constructor(private toastController: ToastController) { }

  async buscar() {
    if (this.nroMedidor) {
      // Simulación de búsqueda
      const toast = await this.toastController.create({
        message: `Buscando el número de cuenta: ${this.nroMedidor}`,
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
