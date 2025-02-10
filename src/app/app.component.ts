import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';



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
  public userRole: string = '';

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private location: Location,
    private network: Network
  ) {
    this.isWeb = false;
    this.load = false;
    this.userRole = localStorage.getItem('userRole') || '';
    this.network.onDisconnect().subscribe(() => {
      alert('Sin conexión a Internet');
      console.log('Sin conexión a Internet');
    });

    this.network.onConnect().subscribe(() => {
      alert('Conectado a Internet');
      console.log('Conectado a Internet');
    });
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
    localStorage.removeItem('userRole');

    this.navCtrl.navigateRoot('/home');
  }

  // 🔹 Cierra el menú si se hace clic fuera de él
  cerrarMenuSiEstaAbierto() {
    this.menuCtrl.isOpen().then((isOpen) => {
      if (isOpen) {
        this.menuCtrl.close();
      }
    });
  }
}