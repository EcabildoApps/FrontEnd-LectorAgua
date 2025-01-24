import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { Location } from '@angular/common';
import { SqliteService } from './services/sqlite.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  submenuVisible: boolean = false;
  public isWeb: boolean;
  public load: boolean = false;

  constructor(private navCtrl: NavController,
    private location: Location,
    private platform: Platform,
    private sqliteService: SqliteService) {
    this.initApp();
    this.isWeb = false;
    this.load = false;
  }

  async ngOnInit() {

    await this.sqliteService.init();
    await this.sqliteService.setupDatabase();

    this.sqliteService.dbready.subscribe((ready) => {
      if (ready) {
        console.log('Base de datos inicializada y lista para usar.');
      } else {
        console.error('La base de datos no está lista.');
      }
    });



    setTimeout(() => {
      this.load = true;
    }, 1000);
    console.log('Estado de load:', this.load);

  }

  initApp() {

    this.platform.ready().then(async () => {
      const info = await Device.getInfo();
      this.isWeb = info.platform === 'web';
      this.load = true;
      this.sqliteService.init();
      this.sqliteService.dbready.subscribe(load => {
        this.load = load;
      });
    })

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
