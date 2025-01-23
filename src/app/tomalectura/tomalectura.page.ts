import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tomalectura',
  templateUrl: './tomalectura.page.html',
  styleUrls: ['./tomalectura.page.scss'],
  standalone: false,
})
export class TomalecturaPage {
  registros: any[] = [];


  constructor(private http: HttpClient,
    private toastController: ToastController) { }

  ngOnInit() {
    this.cargarRegistros();
   /*  this.idCuenta = this.route.snapshot.paramMap.get('idCuenta') || '';
    console.log('IDCUENTA recibido:', this.idCuenta); */
  }

  cargarRegistros() {
    let url = `http://localhost:3000/api/auth/toma`; // Correcto

    this.http.get(url).subscribe(
      async (response: any) => {
        if (response?.data?.length) {
          this.registros = response.data; // Asignar los datos obtenidos
        } else {
          this.registros = []; // Si no hay registros
          await this.presentToast('No se encontraron registros.');
        }
      },
      async (error) => {
        console.error('Error al cargar registros:', error);
        this.registros = []; // Limpiar los registros en caso de error
        await this.presentToast('Ocurrió un error al cargar los registros.');
      }
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'bottom', // Posición del toast
    });
    toast.present();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; // Obtener el primer archivo seleccionado
    if (file) {
      console.log('Archivo seleccionado:', file);
      // Puedes hacer lo que necesites con el archivo, como cargarlo a un servidor o mostrar una vista previa.
    }
  }

}