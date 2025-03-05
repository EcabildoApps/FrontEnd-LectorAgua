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

  isEditing: boolean = false; // Indicador de si estamos en modo edición

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
      return;
    }

    try {
      // Cargar registros sin aplicar filtro
      const registrosOriginales = await this.ionicStorageService.cargarRegistrosConFiltroGeneral(
        this.rutaSeleccionada,
        ''
      );

      // Aplicar filtro según el valor ingresado
      let registrosFiltrados = registrosOriginales.filter(registro =>
        registro.NRO_CUENTA.includes(this.valorFiltro) ||
        registro.CONSUMIDOR.toLowerCase().includes(this.valorFiltro.toLowerCase()) ||
        registro.NRO_MEDIDOR.includes(this.valorFiltro)
      );

      // Eliminar los que tienen estado '1'
      registrosFiltrados = registrosFiltrados.filter(registro => registro.ESTADO !== '1');

      // Guardar el orden actual cuando se termine el drag
      const ordenActual = [...this.registros];

      // Actualizar los registros en base al filtro
      this.registros = registrosFiltrados;

      // Si estamos en modo edición, reordenar los registros según el último orden de arrastre
      if (this.isEditing && ordenActual.length > 0) {
        this.registros = this.registros.sort((a, b) => {
          const indexA = ordenActual.indexOf(a);
          const indexB = ordenActual.indexOf(b);
          return indexA - indexB;
        });
      }

      // Si no hay registros, mostrar un mensaje
      if (this.registros.length === 0) {
        await this.presentToast('No se encontraron registros pendientes.');
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

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.presentToast('Ahora puedes modificar la posición de los registros.');
    }
  }

  dragIndex: number | null = null; // Para almacenar el índice del elemento arrastrado

  // Método que se llama cuando el usuario empieza a arrastrar un item
  onDragStart(event: DragEvent, index: number) {
    this.dragIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  // Evita el comportamiento por defecto para permitir el "drop"
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Método que maneja el "drop" (soltar) del registro en una nueva posición
  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();

    if (this.dragIndex === null || this.dragIndex === dropIndex) return;

    const draggedItem = this.registros[this.dragIndex];
    this.registros.splice(this.dragIndex, 1);
    this.registros.splice(dropIndex, 0, draggedItem);

    // Guardar el nuevo orden después del drop
    this.dragIndex = null;
    //this.cargarRegistros(); // Recargar los registros después del drag para mantener la persistencia del orden
  }

}
