import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  username: string = ''; // Para almacenar el username ingresado
  password: string = ''; // Para almacenar la contraseña ingresada
  passwordVisible: boolean = false; // Para controlar la visibilidad de la contraseña
  userRole: string = ''; // Para almacenar el rol del usuario
  isLoggedIn: boolean = false; // Para controlar si el usuario está logueado

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private router: Router,
    private storageService: IonicstorageService,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        console.log('Corriendo en Android');
        // Configura cosas específicas de Android si es necesario
      } else if (this.platform.is('ios')) {
        console.log('Corriendo en iOS');
        // Configura cosas específicas de iOS si es necesario
      } else {
        console.log('Corriendo en un navegador web');
        // Configura cosas para la web si es necesario
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para mostrar el toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom', // Puedes cambiar la posición (top, middle, bottom)
      color: 'primary', // Puedes cambiar el color (primary, success, danger, etc.)
    });
    toast.present();
  }


  /* async getCoordinates() {
    try {
      // Solicitar permisos de ubicación
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        console.error('Permiso de ubicación no concedido');
        this.showToast('Permiso de ubicación denegado');
        return null;
      }

      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Error al obtener las coordenadas', error);
      return null;
    }
  } */



  async onSubmit() {
    if (!this.username || !this.password || !this.userRole) {
      await this.showToast('⚠️ Por favor, complete todos los campos.');
      return;
    }

    try {
      // Obtener la IP y el puerto desde el almacenamiento
      const dominio = await this.storageService.rescatar('dominio') || '192.168.69.18'; // IP predeterminada
      const puerto = await this.storageService.rescatar('port') || '3000';

      // Obtener coordenadas del dispositivo
      /* const coordinates = await this.getCoordinates();

      if (!coordinates) {
        await this.showToast('📍 No se pudo obtener la ubicación.');
        return;
      } */

      // Construcción de la URL
      const baseUrl = `http://${dominio}:${puerto}/api/auth/login`;

      // Formatear los datos como x-www-form-urlencoded

      const body = {
        username: this.username,
        password: this.password,
      //  latitude: coordinates.latitude,
      //  longitude: coordinates.longitude
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
            localStorage.setItem('username', this.username);

            const rutas = response.user.RUTA ? [response.user.RUTA] : [];
            localStorage.setItem('rutas', JSON.stringify(rutas));

            await this.showToast(`✅ Bienvenido ${this.username}`);
            this.router.navigate(['/principal']);
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

}