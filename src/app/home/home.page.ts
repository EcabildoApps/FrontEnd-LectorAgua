import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';
import { Platform } from '@ionic/angular';
import { RolService } from '../services/rol.service';
import { HTTP } from '@ionic-native/http/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  userRole: string = '';
  isLoggedIn: boolean = false;


  imagenLogin: string = '/assets/img/login2.jpeg';


  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private router: Router,
    private storageService: IonicstorageService,
    private platform: Platform,
    private rolService: RolService,
    private httpp: HTTP,
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        console.log('Corriendo en Android');
      } else if (this.platform.is('ios')) {
        console.log('Corriendo en iOS');
      } else {
        console.log('Corriendo en un navegador web');
      }
    });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.addEventListener('change', (e) => {
        const mode = e.matches ? 'dark' : 'light';
        document.body.setAttribute('color-scheme', mode);
      });

      // Inicializa el modo de acuerdo con la preferencia del sistema
      const initialMode = prefersDark.matches ? 'dark' : 'light';
      document.body.setAttribute('color-scheme', initialMode);
    });
    this.loadImageFromServer();
  }

  async loadImageFromServer() {

    const dominio = await this.storageService.rescatar('dominio') || '186.46.238.254';
    const puerto = await this.storageService.rescatar('port') || '3000';
    const serverUrl = `http://${dominio}:${puerto}/api/auth/getimage`;

    this.http.get(serverUrl).subscribe(
      (response: any) => {
        console.log('Imagen obtenida:', response.imageUrl);  // Verifica la URL de la imagen
        this.imagenLogin = response.imageUrl; // Asigna la URL a la variable
      },
      (error) => {
        console.error('Error al cargar la imagen desde el servidor', error);
      }
    );
  }




  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    toast.present();
  }

  async onSubmit() {


    if (!this.username || !this.password || !this.userRole) {
      await this.showToast('⚠️ Por favor, complete todos los campos.');
      return;
    }

    try {
      const dominio = await this.storageService.rescatar('dominio') || '186.46.238.254';
      const puerto = await this.storageService.rescatar('port') || '3000';


      const baseUrl = `http://${dominio}:${puerto}/api/auth/login`;

      const body = {
        username: this.username,
        password: this.password,
      };

      // Configurar los encabezados
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });


      // Enviar la solicitud POST
      this.http.post(baseUrl, body, { headers }).subscribe(
        async (response: any) => {
          if (response.message === 'Inicio de sesión exitoso.') {
            this.isLoggedIn = true;

            const userRole = response.user.APPROL;
            await this.storageService.agregarConKey('username', this.username);
            await this.rolService.guardar('userRole', userRole);
            this.userRole = userRole;
            this.updateRole();

            const rutas = response.user.RUTA ? [response.user.RUTA] : [];
            const geocodigo = response.user.GEOCODIGO ? [response.user.GEOCODIGO] : [];
            const poligono = response.user.GEOCODIGO ? [response.user.GEOCODIGO] : [];

            localStorage.setItem('rutas', JSON.stringify(rutas));
            localStorage.setItem('geocodigo', JSON.stringify(geocodigo));
            localStorage.setItem('poligono', JSON.stringify(poligono));

            if (this.userRole === 'admin') {
              await this.showToast(`✅ Bienvenido Admin ${this.username}`);
              this.router.navigate(['/admin']); // Redirige a la página de admin
            } else if (this.userRole === userRole) {
              await this.showToast(`✅ Bienvenido ${this.username}`);
              this.router.navigate(['/principal']); // Redirige a la página principal por defecto
            }
          } else {
            await this.showToast(`⚠️ Error en el login: ${response.message}`);
          }
        },
        async (error) => {
          let errorMessage = '❌ Error en la autenticación.';

          if (error.status === 0) {
            errorMessage = '⚠️ No se pudo conectar con el servidor.';
          } else if (error.status === 400) {
            errorMessage = '⚠️ Solicitud incorrecta. Verifique los datos.';
          } else if (error.status === 401) {
            errorMessage = '⛔ Usuario o contraseña incorrectos.';
          } else if (error.status === 403) {
            errorMessage = '🚫 Acceso denegado.';
          } else if (error.status === 500) {
            errorMessage = '🔥 Error interno en el servidor.';
          }

          await this.showToast(errorMessage);
          console.error('Error en la autenticación:', error);
        }
      );
    } catch (error) {
      await this.showToast('⚠️ Ocurrió un error inesperado.');
      
      console.error('Error inesperado:', error);
    }
    console.log('Submitting form...');
  }

  openControlAcceso() {
    // Navegar a la página de control de acceso
    this.router.navigate(['/controlacceso']);
  }
  updateRole() {
    this.storageService.rescatar('userRole').then(role => {
      console.log('Rol guardado en storage:', role);
    });

  }

}