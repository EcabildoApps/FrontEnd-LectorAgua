import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  submenuVisible: boolean = false;
  public isWeb: boolean;
  public load: boolean = false;

  constructor(private navCtrl: NavController,
    private location: Location,) {
    this.isWeb = false;
    this.load = false;
  }


  isSelected(route: string): boolean {
    return this.location.path() === route;
  }

  toggleSubmenu() {
    this.submenuVisible = !this.submenuVisible;
  }

  cerrarSesion() {
    console.log('Sesión cerrada');
    localStorage.removeItem('username');
    localStorage.removeItem('rutas');

    this.navCtrl.navigateRoot('/home');
  }
}
