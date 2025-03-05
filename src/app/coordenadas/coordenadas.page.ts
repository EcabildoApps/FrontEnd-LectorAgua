import { Component, OnInit } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';

@Component({
  selector: 'app-coordenadas',
  templateUrl: './coordenadas.page.html',
  styleUrls: ['./coordenadas.page.scss'],
  standalone: false
})
export class CoordenadasPage implements OnInit {
  lecturas: any[] = [];
  lecturasFiltradas: any[] = [];
  lecturaSeleccionada: any;
  filtro: string = '';
  modalAbierto: boolean = false;

  constructor(private ionicStorageService: IonicstorageService) { }

  ngOnInit() {
    this.cargarLecturas();
  }

  // Cargar lecturas desde el almacenamiento
  async cargarLecturas() {
    const registrosLecturas = await this.ionicStorageService.obtenerRegistrosLecturas();
    if (registrosLecturas) {
      this.lecturas = registrosLecturas;
      this.lecturasFiltradas = this.lecturas;
      console.log('Lecturas cargadas:', this.lecturas);
    }
  }

  // Filtrar las lecturas según el filtro
  filtrarLecturas() {
    this.lecturasFiltradas = this.lecturas.filter(lectura =>
      lectura.IDCUENTA.toString().includes(this.filtro)
    );
  }

  // Abrir el modal para editar la lectura
  abrirModal(lectura: any) {
    if (lectura) {
      this.lecturaSeleccionada = { ...lectura };  // Crear una copia de la lectura seleccionada
      this.modalAbierto = true;  // Abrir el modal
    }
  }

  // Cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;  // Cerrar el modal
  }

  // Guardar los cambios en las coordenadas
  async guardarCambios() {
    if (this.lecturaSeleccionada) {
      const { IDCUENTA, X_LECTURA, Y_LECTURA } = this.lecturaSeleccionada;

      // Verificar que IDCUENTA no sea null/undefined
      if (!IDCUENTA) {
        console.error('IDCUENTA es inválido:', IDCUENTA);
        return;
      }

      // Llamar al servicio para actualizar los campos X_LECTURA e Y_LECTURA
      await this.ionicStorageService.actualizarLectura(IDCUENTA.toString(), { X_LECTURA, Y_LECTURA });

      console.log('Cambios guardados:', this.lecturaSeleccionada);

      // Actualizar la lista localmente
      await this.cargarLecturas();
      this.modalAbierto = false;  // Cerrar el modal después de guardar
    }
  }

}