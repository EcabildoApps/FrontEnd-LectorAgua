import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { IonicstorageService } from './services/ionicstorage.service';
import { RolService } from './services/rol.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  submenuVisible: boolean = false;
  public userRole: string = '';

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private location: Location,
    private network: Network,
    private storageService: IonicstorageService,
    private roleService: RolService
  ) {
    this.network.onDisconnect().subscribe(() => {
      alert('Sin conexión a Internet');
      console.log('Sin conexión a Internet');
    });

    this.network.onConnect().subscribe(() => {
      alert('Conectado a Internet');
      console.log('Conectado a Internet');
    });


  }


  ngOnInit() {
    this.roleService.userRole$.subscribe((role) => {
      this.userRole = role; // Now it's a string, and can be compared
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
    this.storageService.eliminar('username');
    this.roleService.eliminar('userRole');
    localStorage.removeItem('rutas');
    this.navCtrl.navigateRoot('/home');
  }

  cerrarMenuSiEstaAbierto() {
    this.menuCtrl.isOpen().then((isOpen) => {
      if (isOpen) {
        this.menuCtrl.close();
      }
    });
  }

  get showLecturaMenu() {
    return this.userRole === 'LEC' || this.userRole === 'admin';
  }

  get showUrbanoMenu() {
    return this.userRole === 'URB' || this.userRole === 'admin';
  }

  get showRuralMenu() {
    return this.userRole === 'RUR' || this.userRole === 'admin';
  }
}
