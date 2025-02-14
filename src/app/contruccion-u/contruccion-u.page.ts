import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contruccion-u',
  templateUrl: './contruccion-u.page.html',
  styleUrls: ['./contruccion-u.page.scss'],
  standalone: false
})
export class ContruccionUPage {

  misDatosConstruccion: any[] = []; // Declarar la propiedad misDatosConstruccion
  predios: any[] = [];
  catalogos: any = {}; // Para almacenar los catálogos sincronizados


  closet: any[] = [];
  columna: any[] = [];
  cubiertaAcabados: any[] = [];
  cubreVentana: any[] = [];
  entrePiso: any[] = [];
  escalera: any[] = [];
  estestadoCons: any[] = [];
  estructura: any[] = [];
  estructuraCubierta: any[] = [];
  insElectricas: any[] = [];
  insEspeciales: any[] = [];
  insSanitarias: any[] = [];
  nroBanios: any[] = [];
  paredes: any[] = [];
  puerta: any[] = [];
  revEscalera: any[] = [];
  revExterior: any[] = [];
  revInterior: any[] = [];
  revPisos: any[] = [];
  tumbados: any[] = [];
  ventanas: any[] = [];
  vigas: any[] = [];

  predioId: number; // Variable para almacenar el ID del predio


  // Para almacenar los valores seleccionados en el formulario
  selectedEstadoCons: string;
  selectedEstructura: string;
  selectedCubierta: string;
  selectedCubVentana: string;
  selectedEntrePiso: string;
  selectedEscalera: string;
  selectedEstCons: string;
  selectedEstructuraCubierta: string;
  selectedInsElectricas: string;
  selectedInsEspeciales: string;
  selectedInsSanitarias: string;
  selectedNroBanios: string;
  selectedParedes: string;
  selectedPuerta: string;
  selectedRevEscalera: string;
  selectedRevExterior: string;
  selectedRevInterior: string;
  selectedRevPisos: string;
  selectedTumbados: string;
  selectedVentanas: string;
  selectedVigas: string;
  selectedColumanas: string;
  selectedCloset: string;


  aguaDisponible: boolean = false;
  electricaDisponible: boolean = false;
  alcantarilladoDisponible: boolean = false;
  aseoCalleDisponible: boolean = false;
  aceraDisponible: boolean = false;
  bordilloDisponible: boolean = false;
  recoleccionBasura: boolean = false;

  selectedNumeroPersonas: number;
  selectedAreaDocumentos: number;
  selectedFrentePrincipal: number;

  constructor(
    private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.predioId = +this.route.snapshot.paramMap.get('PUR01CODI');

    this.obtenerPredios();
    this.obtenerCatalogos(); // Asegurarse de obtener los catálogos
    console.log('Predios predioId:', this.predioId);  // Agregar log aquí
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
    console.log('Obteniendo predios...');
    try {
      const lecturasGuardadas = await this.ionicStorageService.rescatar('APP_PRE_CONSTRUC');
      console.log('lecturasGuardadas:', lecturasGuardadas);  // Agregar log aquí

      if (lecturasGuardadas && Array.isArray(lecturasGuardadas)) {
        this.predios = lecturasGuardadas; // Asignar directamente los datos del array
        console.log('Predios disponibles:', this.predios);  // Agregar log aquí

        // Asegurar que la comparación se haga con valores numéricos
        const predioSeleccionado = this.predios.find(predio => Number(predio.PUR01CODI) === Number(this.predioId));

        if (predioSeleccionado) {
          this.predios = [predioSeleccionado]; // Asignar solo el predio seleccionado
          console.log('Predio encontrado:', predioSeleccionado);
          this.setValoresFormulario(); // Establecer los valores del formulario
        } else {
          console.warn('No se encontró el predio con el ID proporcionado:', this.predioId);
          await this.presentToast('No se encontró el predio con el ID proporcionado.');
        }
      } else {
        console.warn('No se encontraron predios almacenados en APP_PRE_CONSTRUC.');
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

      this.closet = this.catalogos.closet || [];
      this.columna = this.catalogos.columna || [];
      this.cubiertaAcabados = this.catalogos.cubiertaAcabados || [];
      this.cubreVentana = this.catalogos.cubreVentana || [];
      this.entrePiso = this.catalogos.entrePiso || [];
      this.escalera = this.catalogos.escalera || [];
      this.estestadoCons = this.catalogos.estestadoCons || [];
      this.estructura = this.catalogos.estructura || [];
      this.estructuraCubierta = this.catalogos.estructuraCubierta || [];
      this.insElectricas = this.catalogos.insElectricas || [];
      this.insEspeciales = this.catalogos.insEspeciales || [];
      this.insSanitarias = this.catalogos.insSanitarias || [];
      this.nroBanios = this.catalogos.nroBanios || [];
      this.paredes = this.catalogos.paredes || [];
      this.puerta = this.catalogos.puerta || [];
      this.revEscalera = this.catalogos.revEscalera || [];
      this.revExterior = this.catalogos.revExterior || [];
      this.revInterior = this.catalogos.revInterior || [];
      this.revPisos = this.catalogos.revPisos || [];
      this.tumbados = this.catalogos.tumbados || [];
      this.ventanas = this.catalogos.ventanas || [];
      this.vigas = this.catalogos.vigas || [];

      console.log('Closet:', this.closet);  // Agregar log aquí
      console.log('Columna:', this.columna);  // Agregar log aquí
      console.log('Cubierta y acabados:', this.cubiertaAcabados);  // Agregar log aquí
      console.log('Cubre ventana:', this.cubreVentana);  // Agregar log aquí
      console.log('Entre piso:', this.entrePiso);  // Agregar log aquí
      console.log('Escalera:', this.escalera);  // Agregar log aquí
      console.log('Estado de conservación:', this.estestadoCons);  // Agregar log aquí
      console.log('Estructura:', this.estructura);  // Agregar log aquí
      console.log('Estructura de cubierta:', this.estructuraCubierta);  // Agregar log aquí
      console.log('Instalaciones eléctricas:', this.insElectricas);  // Agregar log aquí
      console.log('Instalaciones especiales:', this.insEspeciales);  // Agregar log aquí
      console.log('Instalaciones sanitarias:', this.insSanitarias);  // Agregar log aquí
      console.log('Número de baños:', this.nroBanios);  // Agregar log aquí
      console.log('Paredes:', this.paredes);  // Agregar log aquí
      console.log('Puerta:', this.puerta);  // Agregar log aquí
      console.log('Revestimiento de escalera:', this.revEscalera);  // Agregar log aquí
      console.log('Revestimiento exterior:', this.revExterior);  // Agregar log aquí
      console.log('Revestimiento interior:', this.revInterior);  // Agregar log aquí
      console.log('Revestimiento de pisos:', this.revPisos);  // Agregar log aquí
      console.log('Tumbados:', this.tumbados);  // Agregar log aquí
      console.log('Ventanas:', this.ventanas);  // Agregar log aquí
      console.log('Vigas:', this.vigas);  // Agregar log aquí




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

    this.catalogos = datosGuardados;
    this.closet = this.catalogos.closet || [];
    this.columna = this.catalogos.columna || [];
    this.cubiertaAcabados = this.catalogos.cubiertaAcabados || [];
    this.cubreVentana = this.catalogos.cubreVentana || [];
    this.entrePiso = this.catalogos.entrePiso || [];
    this.escalera = this.catalogos.escalera || [];
    this.estestadoCons = this.catalogos.estestadoCons || [];
    this.estructura = this.catalogos.estructura || [];
    this.estructuraCubierta = this.catalogos.estructuraCubierta || [];
    this.insElectricas = this.catalogos.insElectricas || [];
    this.insEspeciales = this.catalogos.insEspeciales || [];
    this.insSanitarias = this.catalogos.insSanitarias || [];
    this.nroBanios = this.catalogos.nroBanios || [];
    this.paredes = this.catalogos.paredes || [];
    this.puerta = this.catalogos.puerta || [];
    this.revEscalera = this.catalogos.revEscalera || [];
    this.revExterior = this.catalogos.revExterior || [];
    this.revInterior = this.catalogos.revInterior || [];
    this.revPisos = this.catalogos.revPisos || [];
    this.tumbados = this.catalogos.tumbados || [];
    this.ventanas = this.catalogos.ventanas || [];
    this.vigas = this.catalogos.vigas || [];



    // Establece los valores de los selectores
    this.setSelectorValue(predio, 'GESTADOCONS', 'selectedEstadoCons', this.estestadoCons);
    this.setSelectorValue(predio, 'GESTRUCTURA', 'selectedEstructura', this.estructura);
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedCubierta', this.cubiertaAcabados);//
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedCubVentana', this.cubreVentana);//
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedEntrePiso', this.entrePiso);//
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedEscalera', this.escalera);//
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedEstCons', this.estestadoCons);//
    this.setSelectorValue(predio, 'GESTCUBIER', 'selectedEstructuraCubierta', this.estructuraCubierta);
    this.setSelectorValue(predio, 'GCUBRVENT', 'selectedInsElectricas', this.insElectricas);//
    this.setSelectorValue(predio, 'GIESPECIA', 'selectedInsEspeciales', this.insEspeciales);
    this.setSelectorValue(predio, 'GISANITAR', 'selectedInsSanitarias', this.insSanitarias);
    this.setSelectorValue(predio, 'GNROBANIO', 'selectedNroBanios', this.nroBanios);
    this.setSelectorValue(predio, 'GPAREDES', 'selectedParedes', this.paredes);
    this.setSelectorValue(predio, 'GPUERTA', 'selectedPuerta', this.puerta);
    this.setSelectorValue(predio, 'GREVESCAL', 'selectedRevEscalera', this.revEscalera);
    this.setSelectorValue(predio, 'GREVEXTER', 'selectedRevExterior', this.revExterior);
    this.setSelectorValue(predio, 'GREVINTER', 'selectedRevInterior', this.revInterior);
    this.setSelectorValue(predio, 'GREVPISOS', 'selectedRevPisos', this.revPisos);
    this.setSelectorValue(predio, 'GTUMBADOS', 'selectedTumbados', this.tumbados);
    this.setSelectorValue(predio, 'GVENTANAS', 'selectedVentanas', this.ventanas);
    this.setSelectorValue(predio, 'GVIGAS', 'selectedVigas', this.vigas);


  }
  
  setSelectorValue(predio: any, predioKey: string, modelKey: string, catalogo: any[]) {
    const catalogoItem = catalogo.find(item => item.REN21SUBF === predio[predioKey]);
  
    if (catalogoItem) {
      this[modelKey] = catalogoItem.REN21CODI;
    } else {
      console.warn(`No se encontró ${predioKey} para ${predio[predioKey]}`);
      this[modelKey] = "No tiene"; // Establece un valor por defecto si no se encuentra
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

  async guardarConstruccion() {
    try {
      const datosConstruccion = {
        estadoCons: this.selectedEstadoCons,
        estructura: this.selectedEstructura,
        cubierta: this.selectedCubierta,
        cubVentana: this.selectedCubVentana,
        entrePiso: this.selectedEntrePiso,
        escalera: this.selectedEscalera,
        estCons: this.selectedEstCons,
        estructuraCubierta: this.selectedEstructuraCubierta,
        insElectricas: this.selectedInsElectricas,
        insEspeciales: this.selectedInsEspeciales,
        insSanitarias: this.selectedInsSanitarias,
        nroBanios: this.selectedNroBanios,
        paredes: this.selectedParedes,
        puerta: this.selectedPuerta,
        revEscalera: this.selectedRevEscalera,
        revExterior: this.selectedRevExterior,
        revInterior: this.selectedRevInterior,
        revPisos: this.selectedRevPisos,
        tumbados: this.selectedTumbados,
        ventanas: this.selectedVentanas,
        vigas: this.selectedVigas,
        columanas: this.selectedColumanas,
      };

      //await this.ionicStorageService.guardguardarOActualizarPredioar('APP_PER_CONSTRUC', datosConstruccion);
      await this.presentToast('Construcción guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la construcción:', error);
      await this.presentToast('Ocurrió un error al guardar la construcción.');
    }
  }


  /*   guardarConstruccion() {
      console.log('Guardando construcción...', {
        bloque: this.bloque,
        estructura: this.estructura,
        acabados: this.acabados,
        instalaciones: this.instalaciones
      });
    } */


}

