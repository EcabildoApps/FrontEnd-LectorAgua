import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
  userRole: string = '';  // Para el tipo de login
  isLoggedIn: boolean = false;  // Para controlar si el usuario está logueado

  constructor(private alertController: AlertController) { }

  // Método para mostrar u ocultar la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    if (this.username && this.password && this.userRole) {
      // Simulación de autenticación exitosa
      this.isLoggedIn = true;

      // Puedes agregar aquí tu lógica real de autenticación

      const alert = await this.alertController.create({
        header: 'Bienvenido',
        message: `Usuario: ${this.username} ha iniciado sesión como ${this.userRole}.`,
        buttons: ['OK'],
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos.',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
}
