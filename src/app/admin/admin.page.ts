import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage {
  selectedFile: File | null = null;
  imagenLogin: string = '/assets/img/default-login-image.jpg';

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  guardarImagenLogin() {
    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);

    // Asegúrate de que la URL esté correcta
    this.http.post<{ imageUrl: string }>('http://localhost:3000/api/auth/upload', formData).subscribe(
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