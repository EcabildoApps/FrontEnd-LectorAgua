import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';

import { IonicstorageService } from '../services/ionicstorage.service'; // Asegúrate de tener el servicio de IonicStorage importado
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-lecturagt',
  templateUrl: './lecturagt.page.html',
  styleUrls: ['./lecturagt.page.scss'],
  standalone: false,
})
export class LecturagtPage implements OnInit {


  filtros: string = '';
  valorFiltro: string = '';
  rutaSeleccionada: string = '';
  rutasDisponibles: string[] = [];
  registros: any[] = [];
  idCuenta: number | null = null;

  dragging: boolean = false;
  dragIndex: number | null = null;
  offsetX: number = 0;
  offsetY: number = 0;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private ionicStorageService: IonicstorageService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Obtener las rutas del localStorage (que fue guardado al hacer login)
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas); // Parseamos las rutas guardadas y las asignamos
    }

    this.idCuenta = Number(this.route.snapshot.paramMap.get('idCuenta'));
    console.log('ID Cuenta recibido:', this.idCuenta);
  }


  async cargarRegistros() {
    if (!this.rutaSeleccionada) {
      await this.presentToast('Por favor, selecciona una ruta primero.');
      return; // No hacer nada si no se seleccionó una ruta
    }

    try {
      // Llamar al método del servicio para obtener los registros locales
      this.registros = await this.ionicStorageService.cargarRegistrosConFiltroGeneral(
        this.rutaSeleccionada,
        this.valorFiltro
      );

      // Mostrar mensaje si no hay registros
      if (this.registros.length === 0) {
        await this.presentToast('No se encontraron registros para los filtros seleccionados.');
      }
    } catch (error) {
      console.error('Error al cargar registros locales:', error);
      this.registros = [];
      await this.presentToast('Ocurrió un error al cargar los registros locales.');
    }
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'bottom', // Posición del toast
    });
    toast.present();
  }

  async irATomaLectura(idCuenta: number) {
    console.log('ID Cuenta seleccionada:', idCuenta);

    try {
      // Obtener los registros de la clave 'LECTURAS' del almacenamiento
      const datosLecturas = await this.ionicStorageService.obtenerRegistrosPorClave('LECTURAS');

      // Verificamos si la clave 'LECTURAS' tiene datos
      if (!datosLecturas || !datosLecturas.data || datosLecturas.data.length === 0) {
        await this.presentToast('No se encontraron lecturas almacenadas.');
        return;
      }

      // Buscar el registro con el IDCUENTA proporcionado
      const registro = datosLecturas.data.find(item => item.IDCUENTA === idCuenta);

      if (registro) {
        console.log('Registro encontrado:', registro);
        this.navCtrl.navigateForward(`/tomalectura/${idCuenta}`);
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

  startDrag(event: MouseEvent, index: number) {
    this.dragging = true;
    this.dragIndex = index;
    this.offsetX = event.clientX;
    this.offsetY = event.clientY;
  }

  draggingCard(event: MouseEvent) {
    if (this.dragging && this.dragIndex !== null) {
      this.offsetX = event.clientX;
      this.offsetY = event.clientY;
    }
  }

  stopDrag() {
    this.dragging = false;
    if (this.dragIndex !== null) {
      // Cambiar la posición de los registros en la lista
      const draggedItem = this.registros[this.dragIndex];
      this.registros = this.registros.filter((_, i) => i !== this.dragIndex);
      this.registros.unshift(draggedItem);  // Colocar el item en la nueva posición
    }
    this.dragIndex = null;
  }

}
