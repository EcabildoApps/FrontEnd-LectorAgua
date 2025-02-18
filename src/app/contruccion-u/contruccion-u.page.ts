import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contruccion-u',
  templateUrl: './contruccion-u.page.html',
  styleUrls: ['./contruccion-u.page.scss'],
  standalone: false
})
export class ContruccionUPage implements OnInit {

  geocodigosDisponibles: string[] = [];
  misDatosConstruccion: any[] = [];
  predios: any[] = [];
  catalogos: any = {};

  estestadoCon: any[] = [];
  estructur: any[] = [];
  column: any[] = [];
  viga: any[] = [];
  entrePis: any[] = [];
  parede: any[] = [];
  escaler: any[] = [];
  estructuraCubiert: any[] = [];
  tumbado: any[] = [];
  puert: any[] = [];
  cubreVentan: any[] = [];
  revInterio: any[] = [];
  revExterio: any[] = [];
  revPiso: any[] = [];
  revEscaler: any[] = [];
  cubiertaAcabado: any[] = [];
  ventana: any[] = [];
  close: any[] = [];
  insSanitaria: any[] = [];
  nroBanio: any[] = [];
  insElectrica: any[] = [];
  // insEspeciale: any[] = [];

  predioId: number; // Variable para almacenar el ID del predio


  // Para almacenar los valores seleccionados en el formulario
  selectedEstadoCons: string;
  selectedEstructura: string;
  selectedColumanas: string;
  selectedVigas: string;
  selectedEntrePiso: string;
  selectedParedes: string;
  selectedEscalera: string;
  selectedCubierta: string;
  selectedTumbados: string;
  selectedPuerta: string;
  selectedCubVentana: string;
  selectedRevInterior: string;
  selectedRevExterior: string;
  selectedRevPisos: string;
  selectedRevEscalera: string;
  selectedCubiertaAcabados: string;
  selectedVentanas: string;
  selectedCloset: string;
  selectedInsSanitarias: string;
  selectedNroBanios: string;
  selectedInsElectricas: string;
  //  selectedInsEspeciales: string;



  constructor(
    private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.predioId = +this.route.snapshot.paramMap.get('PUR01CODI');

    const rutasGuardadas = localStorage.getItem('geocodigo');
    if (rutasGuardadas) {
      this.geocodigosDisponibles = JSON.parse(rutasGuardadas);
    }

    this.obtenerPredios();
    this.obtenerCatalogos(); // Asegurarse de obtener los catálogos


    console.log('Predios predioId:', this.predioId);
  }



  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    toast.present();
  }

  async obtenerPredios() {
    try {
      const lecturasGuardadas = await this.ionicStorageService.rescatar('APP_PRE_CONSTRUC');

      if (lecturasGuardadas && lecturasGuardadas.data) {
        this.predios = lecturasGuardadas.data;

        const predioSeleccionado = this.predios.find(predio => predio.PUR01CODI === this.predioId);
        if (predioSeleccionado) {
          console.log('Predio seleccionado:', predioSeleccionado);
          this.misDatosConstruccion = [{
            PUR01CODI: predioSeleccionado.PUR01CODI,
            PISO: predioSeleccionado.PISO,
            BLOQUE: predioSeleccionado.BLOQUE,
          }];

          console.log('Datos de construcción:', this.misDatosConstruccion);

          this.setValoresFormulario();
        } else {
          console.warn('No se encontró el predio con el ID:', this.predioId);
          await this.showToast('No se encontró el predio.');
        }
      } else {
        console.warn('No hay predios almacenados.');
      }
    } catch (error) {
      console.error('Error al recuperar predios:', error);
    }
  }



  async obtenerCatalogos() {
    try {
      const datosGuardados = await this.ionicStorageService.rescatar('CONSTRUCCION');
      if (!datosGuardados) {
        await this.presentToast('No se encontraron catálogos guardados.');
        return;
      }

      // Guardar los catálogos completos
      this.catalogos = datosGuardados;
      console.log('Catalogos cargados:', this.catalogos);  // Agregar log aquí

      this.close = this.catalogos.closet || [];
      this.column = this.catalogos.columna || [];
      this.cubiertaAcabado = this.catalogos.cubiertaAcabados || [];
      this.cubreVentan = this.catalogos.cubreVentana || [];
      this.entrePis = this.catalogos.entrePiso || [];
      this.escaler = this.catalogos.escalera || [];
      this.estestadoCon = this.catalogos.estestadoCons || [];
      this.estructur = this.catalogos.estructura || [];
      this.estructuraCubiert = this.catalogos.estructuraCubierta || [];
      this.insElectrica = this.catalogos.insElectricas || [];
      // this.insEspeciale = this.catalogos.insEspeciales || [];
      this.insSanitaria = this.catalogos.insSanitarias || [];
      this.nroBanio = this.catalogos.nroBanios || [];
      this.parede = this.catalogos.paredes || [];
      this.puert = this.catalogos.puerta || [];
      this.revEscaler = this.catalogos.revEscalera || [];
      this.revExterio = this.catalogos.revExterior || [];
      this.revInterio = this.catalogos.revInterior || [];
      this.revPiso = this.catalogos.revPisos || [];
      this.tumbado = this.catalogos.tumbados || [];
      this.ventana = this.catalogos.ventanas || [];
      this.viga = this.catalogos.vigas || [];

      console.log('Closet:', this.close);  // Agregar log aquí
      console.log('Columna:', this.column);  // Agregar log aquí
      console.log('Cubierta y acabados:', this.cubiertaAcabado);  // Agregar log aquí
      console.log('Cubre ventana:', this.cubreVentan);  // Agregar log aquí
      console.log('Entre piso:', this.entrePis);  // Agregar log aquí
      console.log('Escalera:', this.escaler);  // Agregar log aquí
      console.log('Estado de conservación:', this.estestadoCon);  // Agregar log aquí
      console.log('Estructura:', this.estructur);  // Agregar log aquí
      console.log('Estructura de cubierta:', this.estructuraCubiert);  // Agregar log aquí
      console.log('Instalaciones eléctricas:', this.insElectrica);  // Agregar log aquí
      //console.log('Instalaciones especiales:', this.insEspeciale);  // Agregar log aquí
      console.log('Instalaciones sanitarias:', this.insSanitaria);  // Agregar log aquí
      console.log('Número de baños:', this.nroBanio);  // Agregar log aquí
      console.log('Paredes:', this.parede);  // Agregar log aquí
      console.log('Puerta:', this.puert);  // Agregar log aquí
      console.log('Revestimiento de escalera:', this.revEscaler);  // Agregar log aquí
      console.log('Revestimiento exterior:', this.revExterio);  // Agregar log aquí
      console.log('Revestimiento interior:', this.revInterio);  // Agregar log aquí
      console.log('Revestimiento de pisos:', this.revPiso);  // Agregar log aquí
      console.log('Tumbados:', this.tumbado);  // Agregar log aquí
      console.log('Ventanas:', this.ventana);  // Agregar log aquí
      console.log('Vigas:', this.viga);  // Agregar log aquí

      if (this.estructur.length === 0) {
        await this.presentToast('No se encontraron catálogos de estructura.');
      }
      if (this.column.length === 0) {
        await this.presentToast('No se encontraron catálogos de columnas.');
      }
      if (this.viga.length === 0) {
        await this.presentToast('No se encontraron catálogos de vigas.');
      }


    } catch (error) {
      console.error('Error al cargar los catálogos:', error);
      await this.presentToast('Ocurrió un error al cargar los catálogos.');
    }
  }

  async setValoresFormulario() {
    const datosGuardados = await this.ionicStorageService.rescatar('CONSTRUCCION');
    if (!datosGuardados) {
      await this.presentToast('No se encontraron catálogos guardados.');
      return;
    }

    if (this.predios.length === 0) {
      console.warn('No hay predios disponibles');
      return;
    }

    const predio = this.predios[0];  // Usar el primer predio de la lista (que es el seleccionado)

    this.misDatosConstruccion = [predio];
    this.catalogos = datosGuardados;
    this.close = this.catalogos.closet || [];
    this.column = this.catalogos.columna || [];
    this.cubiertaAcabado = this.catalogos.cubiertaAcabados || [];
    this.cubreVentan = this.catalogos.cubreVentana || [];
    this.entrePis = this.catalogos.entrePiso || [];
    this.escaler = this.catalogos.escalera || [];
    this.estestadoCon = this.catalogos.estestadoCons || [];
    this.estructur = this.catalogos.estructura || [];
    this.estructuraCubiert = this.catalogos.estructuraCubierta || [];
    this.insElectrica = this.catalogos.insElectricas || [];
    //   this.insEspeciale = this.catalogos.insEspeciales || [];
    this.insSanitaria = this.catalogos.insSanitarias || [];
    this.nroBanio = this.catalogos.nroBanios || [];
    this.parede = this.catalogos.paredes || [];
    this.puert = this.catalogos.puerta || [];
    this.revEscaler = this.catalogos.revEscalera || [];
    this.revExterio = this.catalogos.revExterior || [];
    this.revInterio = this.catalogos.revInterior || [];
    this.revPiso = this.catalogos.revPisos || [];
    this.tumbado = this.catalogos.tumbados || [];
    this.ventana = this.catalogos.ventanas || [];
    this.viga = this.catalogos.vigas || [];


    console.log('Datos de construcción cargados:', this.misDatosConstruccion);

    // Establece los valores de los selectores
    this.setSelectorValue(predio, 'GESTADOCONS', 'selectedEstadoCons', this.estestadoCon);//
    this.setSelectorValue(predio, 'GESTRUCTURA', 'selectedEstructura', this.estructur);//
    this.setSelectorValue(predio, 'GESTCOLU', 'selectedColumanas', this.column);//
    this.setSelectorValue(predio, 'GESTVIGAS', 'selectedVigas', this.viga);//
    this.setSelectorValue(predio, 'GESTEPISO', 'selectedEntrePiso', this.entrePis);//
    this.setSelectorValue(predio, 'GESTPARE', 'selectedParedes', this.parede);//
    this.setSelectorValue(predio, 'GESCALERAS', 'selectedEscalera', this.escaler);//
    this.setSelectorValue(predio, 'GESTCUBIER', 'selectedCubierta', this.estructuraCubiert);//
    this.setSelectorValue(predio, 'GACATUMB', 'selectedTumbados', this.tumbado);//
    this.setSelectorValue(predio, 'GACAPUER', 'selectedPuerta', this.puert);//
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedCubVentana', this.cubreVentan);//
    this.setSelectorValue(predio, 'GREVINTERIOR', 'selectedRevInterior', this.revInterio);
    this.setSelectorValue(predio, 'GREVINTERIOR', 'selectedRevExterior', this.revExterio);
    this.setSelectorValue(predio, 'GACAPISOS', 'selectedRevPisos', this.revPiso);
    this.setSelectorValue(predio, 'GREVESCA', 'selectedRevEscalera', this.revEscaler);
    this.setSelectorValue(predio, 'GCUBIACAB', 'selectedCubiertaAcabados', this.cubiertaAcabado);//
    this.setSelectorValue(predio, 'GESTRUCTURA', 'selectedVentanas', this.ventana);//---------------------------------
    this.setSelectorValue(predio, 'GCLOSER', 'selectedCloset', this.close);//
    this.setSelectorValue(predio, 'GISANI', 'selectedInsSanitarias', this.insSanitaria);//
    this.setSelectorValue(predio, 'GINBANIOS', 'selectedNroBanios', this.nroBanio);//
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedInsElectricas', this.insElectrica);
    //  this.setSelectorValue(predio, 'GIESPECIA', 'selectedInsEspeciales', this.insEspeciale);


  }

  setSelectorValue(predio: any, predioKey: string, modelKey: string, catalogo: any[]) {
    const catalogoItem = catalogo.find(item => item.REN21SUBF === predio[predioKey]);
    if (catalogoItem) {
      this[modelKey] = catalogoItem.REN21CODI;
    } else {
      console.warn(`No se encontró ${predioKey} para ${predio[predioKey]}`);
    }
  }

  getValorCatalogo(codigo: string, tipoCatalogo: string): { subf: string } {
    const catalogo = this.catalogos[tipoCatalogo];
    if (catalogo) {
      const opcion = catalogo.find((item: any) => item.REN21CODI.toString() === codigo.toString());
      if (opcion) {
        return { subf: opcion.REN21SUBF };  // Devuelve la descripción y el REN21SUBF
      }
    }
    return { subf: '' };  // Si no se encuentra el código, retorna un objeto vacío
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    toast.present();
  }


  async guardarCambios() {
    try {
      const predio = this.predios[0];
      let cambiosRealizados = false;
      const cambios = {}; // Solo almacena los cambios válidos

      const actualizarSiCambio = (campo, valorSeleccionado, categoria) => {
        const nuevoValor = this.getValorCatalogo(valorSeleccionado, categoria)?.subf;

        console.log(`Campo: ${campo}, Valor Actual: ${predio[campo]}, Nuevo Valor: ${nuevoValor}`);

        if (nuevoValor && nuevoValor !== predio[campo]) {
          cambios[campo] = nuevoValor;
          cambiosRealizados = true;
        }
      };

      actualizarSiCambio('GESTADOCONS', this.selectedEstadoCons, 'estestadoCons');
      actualizarSiCambio('GESTRUCTURA', this.selectedEstructura, 'estructura');
      actualizarSiCambio('GESTCOLU', this.selectedColumanas, 'columna');
      actualizarSiCambio('GESTVIGAS', this.selectedVigas, 'vigas');
      actualizarSiCambio('GESTEPISO', this.selectedEntrePiso, 'entrePiso');
      actualizarSiCambio('GESTPARE', this.selectedParedes, 'paredes');
      actualizarSiCambio('GESCALERAS', this.selectedEscalera, 'escalera');
      actualizarSiCambio('GESTCUBIER', this.selectedCubierta, 'estructuraCubierta');
      actualizarSiCambio('GACATUMB', this.selectedTumbados, 'tumbados');
      actualizarSiCambio('GACAPUER', this.selectedPuerta, 'puerta');
      actualizarSiCambio('GCUBRVENT', this.selectedCubVentana, 'cubreVentana');
      actualizarSiCambio('GREVINTERIOR', this.selectedRevInterior, 'revInterior');
      actualizarSiCambio('GREVINTERIOR', this.selectedRevExterior, 'revExterior');
      actualizarSiCambio('GACAPISOS', this.selectedRevPisos, 'revPisos');
      actualizarSiCambio('GREVESCA', this.selectedRevEscalera, 'revEscalera');
      actualizarSiCambio('GCUBIACAB', this.selectedCubiertaAcabados, 'cubiertaAcabados');
      actualizarSiCambio('GESTRUCTURA', this.selectedVentanas, 'ventanas');
      actualizarSiCambio('GCLOSER', this.selectedCloset, 'closet');
      actualizarSiCambio('GISANI', this.selectedInsSanitarias, 'insSanitarias');
      actualizarSiCambio('GINBANIOS', this.selectedNroBanios, 'nroBanios');
      actualizarSiCambio('GCUBRVENT', this.selectedInsElectricas, 'insElectricas');

      if (!cambiosRealizados) {
        await this.presentToast('No se realizaron cambios.');
        return;
      }

      // Aplicar solo los cambios sin borrar los datos originales
      for (const key in cambios) {
        predio[key] = cambios[key];
      }

      await this.ionicStorageService.guardarOActualizarConstruccion(predio);

      await this.presentToast('Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.presentToast('Ocurrió un error al guardar los cambios.');
    }
  }




}

