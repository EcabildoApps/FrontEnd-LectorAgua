import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tomalectura',
  templateUrl: './tomalectura.page.html',
  styleUrls: ['./tomalectura.page.scss'],
  standalone: false,
})
export class TomalecturaPage {
  registros: any[] = [];
  idCuenta: string = '';


  constructor(private http: HttpClient,
    private toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');
    this.idCuenta = urlSegments[urlSegments.length - 1];
    this.cargarRegistros();
  }

  cargarRegistros() {
    let url = `http://localhost:3000/api/auth/toma?IDCUENTA=${this.idCuenta}`; // Correcto

    this.http.get(url).subscribe(
      async (response: any) => {
        if (response?.data?.length) {
          this.registros = response.data;
        } else {
          this.registros = [];
          await this.presentToast('No se encontraron registros.');
        }
      },
      async (error) => {
        console.error('Error al cargar registros:', error);
        this.registros = [];
        await this.presentToast('Ocurrió un error al cargar los registros.');
      }
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; 
        if (file) {
      console.log('Archivo seleccionado:', file);
    }
  }

}