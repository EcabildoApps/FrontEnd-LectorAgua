import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }

  // Función para mostrar/ocultar la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit() {
    if (this.username && this.password && this.userRole) {
      const loginData = {
        username: this.username,
        password: this.password,
      };

      // Realiza la solicitud POST a la API de login
      this.http.post('http://localhost:3000/api/auth/login', loginData).subscribe(
        async (response: any) => {
          // Si el login es exitoso
          if (response.message === 'Inicio de sesión exitoso.') {
            this.isLoggedIn = true;

            localStorage.setItem('username', this.username);

            const rutas = response.user.RUTA ? [response.user.RUTA] : [];
            localStorage.setItem('rutas', JSON.stringify(rutas));

            const alert = await this.alertController.create({
              header: 'Bienvenido',
              message: `Usuario: ${this.username} ha iniciado sesión como ${this.userRole}.`,
              buttons: ['OK'],
            });

            // Redirigimos a la siguiente pantalla
            this.router.navigate(['/principal']);

            await alert.present();
          }
        },
        async (error) => {
          // Si ocurre un error en el login
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Usuario o contraseña incorrectos.',
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
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
