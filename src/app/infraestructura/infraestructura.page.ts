import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-infraestructura',
  templateUrl: './infraestructura.page.html',
  styleUrls: ['./infraestructura.page.scss'],
  standalone: false,
})
export class InfraestructuraPage implements OnInit {
  geocodigosDisponibles: string[] = [];
  predios: any[] = [];
  catalogos: any = {}; // Para almacenar los catálogos sincronizados
  ocupacion: any[] = [];
  terreno: any[] = [];
  topografia: any[] = [];
  localiza: any[] = [];
  forma: any[] = [];
  viasuso: any[] = [];
  viasmate: any[] = [];


  // Para almacenar los valores seleccionados en el formulario
  selectedOcupacion: string;
  selectedTerreno: string;
  selectedTopografia: string;
  selectedLocaliza: string;
  selectedForma: string;
  selectedViasUso: string;
  selectedViasMate: string;

  aguaDisponible: boolean = false;
  electricaDisponible: boolean = false;
  alcantarilladoDisponible: boolean = false;
  aseoCalleDisponible: boolean = false;
  aceraDisponible: boolean = false;
  bordilloDisponible: boolean = false;

  selectedNumeroPersonas: number;
  selectedAreaDocumentos: number;
  selectedFrentePrincipal: number;

  constructor(
    private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const rutasGuardadas = localStorage.getItem('geocodigo');
    if (rutasGuardadas) {
      this.geocodigosDisponibles = JSON.parse(rutasGuardadas);
    }
    this.obtenerPredios();
    this.obtenerCatalogos(); // Asegurarse de obtener los catálogos
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
      const lecturasGuardadas = await this.ionicStorageService.rescatar('PREDIOS');
      if (lecturasGuardadas && lecturasGuardadas.data) {
        this.predios = lecturasGuardadas.data;
        // Aquí ya tienes los datos de los predios
        this.setValoresFormulario();
      } else {
        console.warn('No se encontraron predios almacenadas');
      }
    } catch (error) {
      console.error('Error al recuperar predios:', error);
    }
  }

  async obtenerCatalogos() {
    try {
      const datosGuardados = await this.ionicStorageService.rescatar('CATALOGOS');
      if (!datosGuardados) {
        await this.presentToast('No se encontraron catálogos guardados.');
        return;
      }

      // Guardar los catálogos completos
      this.catalogos = datosGuardados;
      console.log('Catalogos cargados:', this.catalogos);  // Agregar log aquí

      this.ocupacion = this.catalogos.ocupa || [];
      this.terreno = this.catalogos.terreno || [];
      this.topografia = this.catalogos.topografia || [];
      this.localiza = this.catalogos.localiza || [];
      this.forma = this.catalogos.forma || [];
      this.viasuso = this.catalogos.viasuso || [];
      this.viasmate = this.catalogos.viasmate || [];

      console.log('Ocupacion:', this.ocupacion);  // Agregar log aquí
      console.log('Terrenos:', this.terreno);  // Agregar log aquí
      console.log('Topografía:', this.topografia);  // Agregar log aquí
      console.log('Localización:', this.localiza);  // Agregar log aquí
      console.log('Forma:', this.forma);  // Agregar log aquí
      console.log('Vías de uso:', this.viasuso);  // Agregar log aquí
      console.log('Vías de material:', this.viasmate);  // Agregar log aquí



      if (this.ocupacion.length === 0) {
        await this.presentToast('No se encontraron ocupación.');
      }
      if (this.terreno.length === 0) {
        await this.presentToast('No se encontraron terrenos.');
      }
    } catch (error) {
      console.error('Error al cargar los catálogos:', error);
      await this.presentToast('Ocurrió un error al cargar los catálogos.');
    }
  }

  async setValoresFormulario() {
    const datosGuardados = await this.ionicStorageService.rescatar('CATALOGOS');
    if (!datosGuardados) {
      await this.presentToast('No se encontraron catálogos guardados.');
      return;
    }

    if (this.predios.length === 0) {
      console.warn('No hay predios disponibles');
      return;
    }

    const predio = this.predios[0];  // Asume que solo hay un predio para establecer los valores

    this.catalogos = datosGuardados;
    this.ocupacion = this.catalogos.ocupa || [];
    this.terreno = this.catalogos.terreno || [];
    this.topografia = this.catalogos.topografia || [];
    this.localiza = this.catalogos.localiza || [];
    this.forma = this.catalogos.forma || [];
    this.viasuso = this.catalogos.viasuso || [];
    this.viasmate = this.catalogos.viasmate || [];

    this.selectedNumeroPersonas = predio['GNROPERSONA'] || 0;
    this.selectedAreaDocumentos = predio['AREAESCR'] || 0;
    this.selectedFrentePrincipal = predio['GFONDRELA'] || 0;

    // Establece los valores de los selectores
    this.setSelectorValue(predio, 'GOCUPACION', 'selectedOcupacion', this.ocupacion);
    this.setSelectorValue(predio, 'GFORMA', 'selectedTerreno', this.terreno);
    this.setSelectorValue(predio, 'GTOPOGRAFIA', 'selectedTopografia', this.topografia);
    this.setSelectorValue(predio, 'GLOCALIZA', 'selectedLocaliza', this.localiza);
    this.setSelectorValue(predio, 'GFORMA', 'selectedForma', this.forma);
    this.setSelectorValue(predio, 'GVIASUSO', 'selectedViasUso', this.viasuso);
    this.setSelectorValue(predio, 'GVIASMATE', 'selectedViasMate', this.viasmate);

    // Establece los valores de los checkboxes
    this.setCheckboxValue(predio, 'aguaDisponible', 'GAGUA');
    this.setCheckboxValue(predio, 'electricaDisponible', 'GELECTRICA');
    this.setCheckboxValue(predio, 'alcantarilladoDisponible', 'GALCCAN');
    this.setCheckboxValue(predio, 'aseoCalleDisponible', 'GRBASUDOMI');
    this.setCheckboxValue(predio, 'aceraDisponible', 'GACERA');
    this.setCheckboxValue(predio, 'bordilloDisponible', 'GBORDILLO');


  }

  setSelectorValue(predio: any, predioKey: string, modelKey: string, catalogo: any[]) {
    const catalogoItem = catalogo.find(item => item.REN21SUBF === predio[predioKey]);
    if (catalogoItem) {
      this[modelKey] = catalogoItem.REN21CODI;
    } else {
      console.warn(`No se encontró ${predioKey} para ${predio[predioKey]}`);
    }
  }

  setCheckboxValue(predio: any, modelKey: string, predioKey: string) {
    this[modelKey] = predio[predioKey] === 'S';  // Asegúrate que en tus predios el valor sea 'SÍ' o algo similar
  }

  getValorCatalogo(codigo: string, tipoCatalogo: string): string {
    const catalogo = this.catalogos[tipoCatalogo];
    if (catalogo) {
      console.log(`Buscando ${codigo} en el catálogo ${tipoCatalogo}`);
      const opcion = catalogo.find((item: any) => item.REN21CODI.toString() === codigo.toString());
      console.log('Opción encontrada:', opcion);
      if (opcion) {
        return opcion.REN21DESC; // Retorna la descripción si la encuentra
      }
    }
    return ''; // Si no se encuentra el código, retorna un valor vacío
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



}