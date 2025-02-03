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
    this.userRole = localStorage.getItem('userRole') || 'urbano';

    this.setPermissionsBasedOnRole();
  }

  setPermissionsBasedOnRole() {
    if (this.userRole === 'urbano') {
      this.showLecturaCard = false;
      this.showRuralCard = false;
    } else if (this.userRole === 'rural') {
      this.showLecturaCard = false;
      this.showUrbanoCard = false;
    }
  }

  onCardClick(tipo: string, event: Event) {
    if (
      (tipo === 'lectura' && !this.showLecturaCard) ||
      (tipo === 'urbano' && !this.showUrbanoCard) ||
      (tipo === 'rural' && !this.showRuralCard)
    ) {
      this.showPermissionToast();
      return;
    }

    const allCards = document.querySelectorAll('.custom-card');

    allCards.forEach(card => card.classList.remove('selected'));

    const cardElement = event.target as HTMLElement;

    cardElement.classList.add('selected');

    setTimeout(() => {
      switch (tipo) {
        case 'lectura':
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