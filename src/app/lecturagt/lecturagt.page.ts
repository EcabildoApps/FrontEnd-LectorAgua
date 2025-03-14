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
  registrosSinFiltro: any[] = []; // Para almacenar los registros sin filtro
  idCuenta: number | null = null;
  registrosOrdenados: any[] = []; // Guardar el orden actual de los registros

  isEditing: boolean = false;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private ionicStorageService: IonicstorageService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas);
    }
    this.idCuenta = Number(this.route.snapshot.paramMap.get('idCuenta'));
    console.log('ID Cuenta recibido:', this.idCuenta);
  }

  async cargarRegistros() {
    if (!this.rutaSeleccionada) {
      await this.presentToast('Por favor, selecciona una ruta primero.');
      return;
    }

    try {
      // Cargar los registros sin aplicar ningún filtro
      const registrosOriginales = await this.ionicStorageService.cargarRegistrosConFiltroGeneral(
        this.rutaSeleccionada,
        ''
      );

      // Si no se tiene el estado sin filtro guardado, lo guardamos
      if (this.registrosSinFiltro.length === 0) {
        this.registrosSinFiltro = [...registrosOriginales]; // Guardamos los registros sin filtro
      }

      let registrosFiltrados = registrosOriginales;

      if (this.valorFiltro) {
        // Si hay filtro, filtrar según el valor ingresado
        registrosFiltrados = registrosOriginales.filter(registro =>
          registro.NRO_CUENTA.includes(this.valorFiltro) ||
          registro.CONSUMIDOR.toLowerCase().includes(this.valorFiltro.toLowerCase()) ||
          registro.NRO_MEDIDOR.includes(this.valorFiltro)
        );
      }

      // Eliminar los que tienen estado '1'
      registrosFiltrados = registrosFiltrados.filter(registro => registro.ESTADO !== '1');

      // Si estamos en modo edición, manejar la reordenación
      const ordenActual = [...this.registros];

      // Si estamos filtrando, mantener los registros filtrados
      if (this.isEditing && ordenActual.length > 0) {
        registrosFiltrados = this.sortByOriginalOrder(registrosFiltrados, ordenActual);
      }

      // Guardar los registros ordenados al actualizar la lista
      this.registros = registrosFiltrados;
      this.registrosOrdenados = [...this.registros]; // Guardar el nuevo orden

      if (this.registros.length === 0) {
        await this.presentToast('No se encontraron registros pendientes.');
      }
    } catch (error) {
      console.error('Error al cargar registros locales:', error);
      this.registros = [];
      await this.presentToast('Ocurrió un error al cargar los registros locales.');
    }
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
  // Función para reordenar los registros según el orden original
  sortByOriginalOrder(filteredRecords: any[], originalOrder: any[]) {
    return filteredRecords.sort((a, b) => {
      const indexA = originalOrder.indexOf(a);
      const indexB = originalOrder.indexOf(b);
      return indexA - indexB;
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  onInputChange() {
    this.cargarRegistros();
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.presentToast('Ahora puedes modificar la posición de los registros.');
    }
  }

  dragIndex: number | null = null; // Para almacenar el índice del elemento arrastrado

  onDragStart(event: DragEvent, index: number) {
    this.dragIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Mover un registro a la primera posición
  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();

    if (this.dragIndex === null || this.dragIndex === dropIndex) return;

    const draggedItem = this.registros[this.dragIndex];
    this.registros.splice(this.dragIndex, 1);
    this.registros.splice(dropIndex, 0, draggedItem);

    // Guardar el nuevo orden de registros
    this.registrosOrdenados = [...this.registros];
    this.dragIndex = null;
  }

  // Función para restaurar los registros sin filtro
  clearFilter() {
    this.valorFiltro = ''; // Limpiar el filtro
    this.registros = [...this.registrosOrdenados]; // Restaurar el orden original de los registros
    this.cargarRegistros(); // Recargar los registros
  }
}