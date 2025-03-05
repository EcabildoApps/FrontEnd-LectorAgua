import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicstorageService } from '../services/ionicstorage.service';


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: false,
})
export class ConfiguracionPage {
  password: string = ''; // Para almacenar la contraseña ingresada
  username: string = ''; // Variable para almacenar el username recuperado
  imagenLogin: string = '/assets/img/login2.jpeg';
  passwordVisible: boolean = false;
  userRole: string = '';
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router, private storageService: IonicstorageService) { }

  ngOnInit() {
    this.loadImageFromServer();
  }



  async login() {
    const dominio = await this.storageService.rescatar('dominio') || '192.168.69.18';
    const puerto = await this.storageService.rescatar('port') || '3000';


    console.log('Username:', this.username); // Depuración
    console.log('Password:', this.password); // Depuración

    if (this.password.trim()) {
      this.http.post(`http://${dominio}:${puerto}/api/auth/login`, {
        username: this.username,
        password: this.password
      }).subscribe(
        (response: any) => {
          console.log('Respuesta del servidor:', response); // Verifica la respuesta

          // Verifica si el mensaje indica éxito
          if (response.message === 'Inicio de sesión exitoso.') {
            // Redirige a la siguiente pantalla
            this.router.navigate(['/coordenadas']);
          } else {
            alert('Contraseña incorrecta.');
          }
        },
        (error) => {
          console.error('Error en la petición:', error);
          alert('Hubo un problema al intentar iniciar sesión.');
        }
      );
    } else {
      alert('Por favor, ingrese la contraseña.');
    }
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


}
