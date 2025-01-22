import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private navCtrl: NavController, private router: Router, private location: Location) { }


  // Método para verificar si la ruta actual es la seleccionada
  isSelected(route: string): boolean {
    return this.location.path() === route;
  }


  cerrarSesion() {
    // Aquí puedes agregar la lógica para limpiar el almacenamiento o cerrar sesión
    console.log('Sesión cerrada');
    // Redirigir al login
    this.navCtrl.navigateRoot('/home');
  }
}
