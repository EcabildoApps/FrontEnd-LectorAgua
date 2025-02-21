import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';

import { IonicstorageService } from '../services/ionicstorage.service'; // Asegúrate de tener el servicio de IonicStorage importado
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-listaprurales',
  templateUrl: './listaprurales.page.html',
  styleUrls: ['./listaprurales.page.scss'],
  standalone: false,
})
export class ListapruralesPage implements OnInit {

  filtros: string = '';
  valorFiltro: string = '';
  rutaSeleccionada: string = '';
  rutasDisponibles: string[] = [];
  registros: any[] = [];
  PRU01CODI: number | null = null;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private ionicStorageService: IonicstorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Obtener las rutas del localStorage (que fue guardado al hacer login)
    const rutasGuardadas = localStorage.getItem('poligono');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas); // Parseamos las rutas guardadas y las asignamos
    }

    this.PRU01CODI = Number(this.route.snapshot.paramMap.get('PREDIOSRUR'));
    console.log('ID PREDIORUR recibido:', this.PRU01CODI);
  }

  async cargarRegistros() {
    if (!this.rutaSeleccionada) {
      await this.presentToast('Por favor, selecciona una ruta primero.');
      return; // No hacer nada si no se seleccionó una ruta
    }

    try {
      // Llamar al método del servicio para obtener los registros de predios con filtros
      this.registros = await this.ionicStorageService.cargarPrediosRURConFiltroGeneral(
        this.rutaSeleccionada,
        this.valorFiltro
      );

      // Mostrar mensaje si no hay registros
      if (this.registros.length === 0) {
        await this.presentToast('No se encontraron registros para los filtros seleccionados.');
      }
    } catch (error) {
      console.error('Error al cargar registros de predios:', error);
      this.registros = [];
      await this.presentToast('Ocurrió un error al cargar los registros de predios.');
    }
  }
  async irPredioRural(PRU01CODI: number) {
    console.log('ID Predio seleccionada:', PRU01CODI);

    try {
      // Obtener los registros de la clave 'LECTURAS' del almacenamiento
      const datosLecturas = await this.ionicStorageService.obtenerRegistrosPorClave('PREDIOSRUR');

      // Verificamos si la clave 'LECTURAS' tiene datos
      if (!datosLecturas || !datosLecturas.data || datosLecturas.data.length === 0) {
        await this.presentToast('No se encontraron predios almacenadas.');
        return;
      }
      console.log('Datos de predios:', datosLecturas);
      // Buscar el registro con el IDCUENTA proporcionado
      const registro = datosLecturas.data.find(item => item.PRU01CODI === PRU01CODI);
      
      if (registro) {
        console.log('Registro encontrado:', registro);
        this.navCtrl.navigateForward(`/informacionPr/${PRU01CODI}`);
      } else {
        console.error('No se encontró ningún registro con el ID proporcionado.');
        await this.presentToast('No se encontró el registro para esta cuenta.');
      }
    } catch (error) {
      console.error('Error al intentar obtener el registro:', error);
      await this.presentToast('Ocurrió un error al buscar el registro de lectura.');
    }
  }


  onInputChange() {
    // Cargar los registros con los filtros aplicados
    this.cargarRegistros();
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