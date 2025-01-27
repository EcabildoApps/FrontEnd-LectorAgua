import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { IonicstorageService } from '../services/ionicstorage.service';


@Component({
  selector: 'app-lectura-nleidas',
  templateUrl: './lectura-nleidas.page.html',
  styleUrls: ['./lectura-nleidas.page.scss'],
  standalone: false,
})
export class LecturaNleidasPage implements OnInit {
  filtros: string = '';
  valorFiltro: string = '';
  rutaSeleccionada: string = '';
  rutasDisponibles: string[] = [];
  registros: any[] = [];

  constructor(private ionicStorageService: IonicstorageService, private toastController: ToastController) { }

  ngOnInit() {
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas);
    }
  }

  async cargarRegistros() {
    if (!this.rutaSeleccionada) {
      this.registros = [];
      return;
    }
  
    try {
      const registrosFiltrados = await this.ionicStorageService.cargarRegistrosConFiltroGeneral(
        this.rutaSeleccionada,
        this.valorFiltro
      );
  
      // Filtrar los registros para excluir aquellos con X_LECTURA y Y_LECTURA no vacíos
      this.registros = registrosFiltrados.filter(registro => {
        return (
          (registro.X_LECTURA === null || registro.X_LECTURA === undefined) &&
          (registro.Y_LECTURA === null || registro.Y_LECTURA === undefined)
        );
      });
  
      if (this.registros.length === 0) {
        await this.presentToast('No se encontraron registros.');
      }
    } catch (error) {
      console.error('Error al cargar registros:', error);
      this.registros = [];
      await this.presentToast('Ocurrió un error al cargar los registros.');
    }
  }
  


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}