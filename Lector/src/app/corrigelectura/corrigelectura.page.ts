import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-corrigelectura',
  templateUrl: './corrigelectura.page.html',
  styleUrls: ['./corrigelectura.page.scss'],
  standalone: false,
})
export class CorrigelecturaPage {

  registros = [
    { nroSec: 10, nroCuenta: '01000100', nombre: 'SOCIEDAD OBRERA FEDERICO GONZA', nroMedidor: '0807044971', tipo: '2 - COMERCIAL' },
    { nroSec: 20, nroCuenta: '01000200', nombre: 'CRUZ CESPEDES FAUSTO HERNAN', nroMedidor: '0304824', tipo: '1 - RESIDENCIAL' },
  ];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.showAlert(this.registros.length);
  }

  async showAlert(tamano: number) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: `Tamaño lecturas actuales: ${tamano}.`,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
