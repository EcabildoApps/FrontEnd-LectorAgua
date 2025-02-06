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

  currentDragIndex: number | null = null; // Índice del registro que se está arrastrando
  dragging: boolean = false; // Indicador de si se está arrastrando

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

  onDragStart(event: MouseEvent, index: number) {
    this.currentDragIndex = index;
    this.dragging = true;

    const item = event.target as HTMLElement;
    item.classList.add('dragging'); // Añadimos una clase para aplicar estilo

    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
  }

  // Mueve el elemento mientras se arrastra
  onDragMove(event: MouseEvent) {
    if (this.currentDragIndex === null || !this.dragging) return;

    const draggedElement = document.querySelector('.dragging') as HTMLElement;
    if (draggedElement) {
      // Actualizamos la posición del elemento mientras lo arrastramos
      draggedElement.style.position = 'absolute';
      draggedElement.style.left = `${event.clientX - draggedElement.offsetWidth / 2}px`;
      draggedElement.style.top = `${event.clientY - draggedElement.offsetHeight / 2}px`;
    }
  }

  // Finaliza el arrastre
  onDragEnd(event: MouseEvent) {
    if (this.currentDragIndex === null) return;

    const draggedElement = document.querySelector('.dragging') as HTMLElement;
    if (draggedElement) {
      draggedElement.classList.remove('dragging');
      draggedElement.style.position = ''; // Limpiamos la posición

      // Calculamos la nueva posición
      const newIndex = this.getNewIndex(event.clientY);
      if (newIndex !== this.currentDragIndex) {
        // Si la posición ha cambiado, cambiamos el orden
        const temp = this.registros[this.currentDragIndex];
        this.registros[this.currentDragIndex] = this.registros[newIndex];
        this.registros[newIndex] = temp;
      }
    }

    // Limpiamos el estado
    this.dragging = false;
    this.currentDragIndex = null;

    // Removemos los listeners
    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
  }

  // Función para determinar la nueva posición basada en la posición del mouse
  getNewIndex(clientY: number): number {
    const cards = document.querySelectorAll('.draggable-item');
    let newIndex = this.currentDragIndex;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2 && clientY > rect.top) {
        newIndex = index;
      }
    });

    return newIndex;
  }

}
