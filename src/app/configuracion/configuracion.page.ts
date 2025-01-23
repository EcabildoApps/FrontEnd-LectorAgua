import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: false,
})
export class ConfiguracionPage {
  password: string = ''; // Para almacenar la contraseña ingresada
  username: string = ''; // Variable para almacenar el username recuperado

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    console.log('Username cargado en ngOnInit:', this.username); // Depuración
  }



  login() {
    console.log('Username:', this.username); // Depuración
    console.log('Password:', this.password); // Depuración

    if (this.password.trim()) {
      this.http.post('http://localhost:3000/api/auth/login', {
        username: this.username,
        password: this.password
      }).subscribe(
        (response: any) => {
          console.log('Respuesta del servidor:', response); // Verifica la respuesta

          // Verifica si el mensaje indica éxito
          if (response.message === 'Inicio de sesión exitoso.') {
            // Redirige a la siguiente pantalla
            this.router.navigate(['/controlacceso']);
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


}
