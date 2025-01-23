import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false,
})
export class PrincipalPage {

  constructor(private router: Router) { }

  onCardClick() {
    // Agregamos la clase de animación
    const cardElement = document.querySelector('.custom-card');
    if (cardElement) {
      cardElement.classList.add('selected');

      // Luego de 300ms (duración de la animación), redirigimos
      setTimeout(() => {
        this.router.navigate(['/lectura']);
      }, 300); // Tiempo que dura la animación
    }
  }
}
