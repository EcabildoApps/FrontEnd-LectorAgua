import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false,
})
export class PrincipalPage {
  public userRole: string = '';
  public showLecturaCard: boolean = true;
  public showUrbanoCard: boolean = true;
  public showRuralCard: boolean = true;

  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';

    // Inicializamos los permisos basados en el rol del usuario
    this.setPermissionsBasedOnRole();
  }

  setPermissionsBasedOnRole() {
    // Restricciones de visibilidad de los módulos según el rol
    if (this.userRole === 'LEC') {
      this.showUrbanoCard = false;   // No puede ver el módulo de Urbano
      this.showRuralCard = false;    // No puede ver el módulo de Rural
      this.showLecturaCard = true;   // Puede ver el módulo de Lectura
    } else if (this.userRole === 'urbano') {
      this.showLecturaCard = false;  // No puede ver el módulo de Lectura
      this.showRuralCard = false;    // No puede ver el módulo de Rural
    } else if (this.userRole === 'rural') {
      this.showLecturaCard = false;  // No puede ver el módulo de Lectura
      this.showUrbanoCard = false;   // No puede ver el módulo Urbano
    } else if (this.userRole === 'admin') {
      // Los administradores pueden ver todo
      this.showLecturaCard = true;
      this.showUrbanoCard = true;
      this.showRuralCard = true;
    } else {
      // Si no hay rol o el rol es inválido, no mostrar nada
      this.showLecturaCard = false;
      this.showUrbanoCard = false;
      this.showRuralCard = false;
    }
  }

  onCardClick(tipo: string, event: Event) {
    // Verificamos el acceso del usuario a cada módulo
    if (
      (tipo === 'LEC' && !this.showLecturaCard) ||
      (tipo === 'urbano' && !this.showUrbanoCard) ||
      (tipo === 'rural' && !this.showRuralCard)
    ) {
      this.showPermissionToast();  // Si no tiene acceso, mostramos el mensaje
      return;
    }

    // Seleccionamos la tarjeta que el usuario hizo clic
    const allCards = document.querySelectorAll('.custom-card');
    allCards.forEach(card => card.classList.remove('selected'));

    const cardElement = event.target as HTMLElement;
    cardElement.classList.add('selected');

    // Redirigimos a la pantalla correspondiente dependiendo del tipo
    setTimeout(() => {
      switch (tipo) {
        case 'LEC':
          this.router.navigate(['/lectura']);
          break;
        case 'urbano':
          this.router.navigate(['/urbanos']);
          break;
        case 'rural':
          this.router.navigate(['/rurales']);
          break;
        default:
          break;
      }
    }, 300);
  }

  async showPermissionToast() {
    const toast = await this.toastController.create({
      message: 'No tienes acceso a este módulo.',
      duration: 2000,
      icon: 'lock-closed-outline',
      position: 'bottom',
      color: 'warning',
    });
    toast.present();
  }
}