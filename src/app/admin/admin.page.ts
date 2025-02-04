import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage {
  selectedFile: File | null = null;
  imagenLogin: string = '/assets/img/default-login-image.jpg';

  constructor(private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom', // Puedes cambiar la posición (top, middle, bottom)
      color: 'primary', // Puedes cambiar el color (primary, success, danger, etc.)
    });
    toast.present();
  }

  async guardarImagenLogin() {

    const dominio = await this.ionicStorageService.rescatar('dominio');
    const puerto = await this.ionicStorageService.rescatar('port');
    if (!dominio || !puerto) {
      await this.showToast('Dominio o puerto no configurados.');
      return;
    }

    const baseUrl = `http://${dominio}:${puerto}`;


    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);

    // Asegúrate de que la URL esté correcta
    this.http.post<{ imageUrl: string }>(`${baseUrl}/api/auth/upload`, formData).subscribe(
      (response) => {
        this.imagenLogin = response.imageUrl;
        alert('Imagen subida correctamente');
      },
      (error) => {
        alert('Hubo un error al subir la imagen');
      }
    );
  }

}