import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';

import { IonicstorageService } from '../services/ionicstorage.service'; // Asegúrate de tener el servicio de IonicStorage importado
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pendiente-xcausa',
  templateUrl: './pendiente-xcausa.page.html',
  styleUrls: ['./pendiente-xcausa.page.scss'],
  standalone: false,
})
export class PendienteXcausaPage implements OnInit {

  filtros: string = '';
  valorFiltro: string = '';
  rutaSeleccionada: string = '';
  rutasDisponibles: string[] = [];
  registros: any[] = [];
  idCuenta: number | null = null;
  causas: any[] = [];
  causaSeleccionada: string = '';
  causasFiltradas: any[] = [];

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private ionicStorageService: IonicstorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cargarRutas();
    this.idCuenta = Number(this.route.snapshot.paramMap.get('idCuenta'));
    this.cargarCausas();
  }

  cargarRutas() {
    const rutasGuardadas = localStorage.getItem('rutas');
    if (rutasGuardadas) {
      this.rutasDisponibles = JSON.parse(rutasGuardadas);
      console.log('Rutas Disponibles:', this.rutasDisponibles);
    } else {
      console.log('No se encontraron rutas en el localStorage');
    }
  }

  async cargarRegistros() {
    if (!this.rutaSeleccionada) {
      await this.presentToast('Por favor, selecciona una ruta primero.');
      return;
    }

    try {
      console.log('Cargando registros para:', this.rutaSeleccionada, this.valorFiltro);
      this.registros = await this.ionicStorageService.cargarRegistrosConFiltroGeneral(
        this.rutaSeleccionada,
        this.valorFiltro
      );
      console.log('Registros obtenidos:', this.registros);

      // Filtrar por la causa seleccionada
      if (this.causaSeleccionada) {
        this.registros = this.registros.filter(
          (registro) => registro.TIPOCAUSA === this.causaSeleccionada
        );
        console.log('Registros filtrados por causa:', this.registros);
      }

      if (this.registros.length === 0) {
        await this.presentToast('No se encontraron registros para los filtros seleccionados.');
      }
    } catch (error) {
      console.error('Error al cargar registros:', error);
      this.registros = [];
      await this.presentToast('Ocurrió un error al cargar los registros.');
    }
  }

  async cargarCausas() {
    try {
      const datosGuardados = await this.ionicStorageService.listar();

      if (!datosGuardados || datosGuardados.length === 0) {
        await this.presentToast('No se encontraron datos guardados.');
        return;
      }

      const causasData = datosGuardados
        .find(item => item.k === 'CAUSAS' && item.v) // Filtramos por 'CAUSAS'
        ?.v || [];

      const causas = causasData?.data || [];

      if (causas.length === 0) {
        await this.presentToast('No se encontraron causas.');
      }

      this.causas = causas
        .filter((item) => item.REN21CODI && item.REN21DESC)
        .sort((a, b) => a.REN21DESC.localeCompare(b.REN21DESC));

      console.log('Causas cargadas:', this.causas);

    } catch (error) {
      console.error('Error al cargar las causas y novedades:', error);
      await this.presentToast('Ocurrió un error al cargar las causas y novedades.');
    }
  }

  

  filtrarCausas(event: any) {
    const criterio = event.target.value.trim().toLowerCase();

    if (!criterio) {
      this.causasFiltradas = [...this.causas];
      return;
    }

    this.causasFiltradas = this.causas.filter(
      causa =>
        causa.REN21CODI.toString().includes(criterio) ||
        causa.REN21DESC.toLowerCase().includes(criterio)
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

  async irATomaLectura(idCuenta: number) {
    console.log('ID Cuenta seleccionada:', idCuenta);
    try {
      const datosLecturas = await this.ionicStorageService.obtenerRegistrosPorClave('LECTURAS');
      console.log('Datos de lecturas obtenidos:', datosLecturas);

      if (!datosLecturas || !datosLecturas.data || datosLecturas.data.length === 0) {
        await this.presentToast('No se encontraron lecturas almacenadas.');
        return;
      }

      const registro = datosLecturas.data.find((item) => item.IDCUENTA === idCuenta);
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
}
