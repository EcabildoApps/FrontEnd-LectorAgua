import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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

  predioId: number; // Variable para almacenar el ID del predio


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

        // Filtrar el predio correspondiente al ID
        const predioSeleccionado = this.predios.find(predio => predio.PUR01CODI === this.predioId);

        if (predioSeleccionado) {
          this.predios = [predioSeleccionado]; // Asignar solo el predio seleccionado
          this.setValoresFormulario(); // Establecer los valores del formulario
        } else {
          console.warn('No se encontró el predio con el ID proporcionado');
          await this.presentToast('No se encontró el predio con el ID proporcionado.');
        }
      } else {
        console.warn('No se encontraron predios almacenados');
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
  
    const predio = this.predios[0];  // Usar el primer predio de la lista (que es el seleccionado)
  
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
    this.setCheckboxValue(predio, 'electricaDisponible', 'GALUMBPUB');
    this.setCheckboxValue(predio, 'alcantarilladoDisponible', 'GALCCAN');
    this.setCheckboxValue(predio, 'aseoCalleDisponible', 'GRBASUDOMI');
    this.setCheckboxValue(predio, 'aceraDisponible', 'GACERA');
    this.setCheckboxValue(predio, 'bordilloDisponible', 'GBORDILLO');
    this.setCheckboxValue(predio, 'recoleccionBasura', 'GTEPRI');
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

      // Obtener el valor de REN21SUBF
      predio.GOCUPACION = this.getValorCatalogo(this.selectedOcupacion, 'ocupa').subf;
      predio.GFORMA = this.getValorCatalogo(this.selectedTerreno, 'terreno').subf;
      predio.GTOPOGRAFIA = this.getValorCatalogo(this.selectedTopografia, 'topografia').subf;
      predio.GLOCALIZA = this.getValorCatalogo(this.selectedLocaliza, 'localiza').subf;
      predio.GFORMA = this.getValorCatalogo(this.selectedForma, 'forma').subf;
      predio.GVIASUSO = this.getValorCatalogo(this.selectedViasUso, 'viasuso').subf;
      predio.GVIASMATE = this.getValorCatalogo(this.selectedViasMate, 'viasmate').subf;

      predio.GAGUA = this.aguaDisponible ? 'S' : 'N';
      predio.GALUMBPUB = this.electricaDisponible ? 'S' : 'N';
      predio.GALCCAN = this.alcantarilladoDisponible ? 'S' : 'N';
      predio.GRBASUDOMI = this.aseoCalleDisponible ? 'S' : 'N';
      predio.GACERA = this.aceraDisponible ? 'S' : 'N';
      predio.GBORDILLO = this.bordilloDisponible ? 'S' : 'N';
      predio.GRBASUDOMI = this.recoleccionBasura ? 'S' : 'N';

      // Actualizar los valores de los inputs
      predio.GNROPERSONA = this.selectedNumeroPersonas;
      predio.AREAESCR = this.selectedAreaDocumentos;
      predio.GFONDRELA = this.selectedFrentePrincipal;

      // Guardar los valores en Ionic Storage
      await this.ionicStorageService.guardarOActualizarPredio(predio);

      // Mostrar mensaje de éxito
      await this.presentToast('Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.presentToast('Ocurrió un error al guardar los cambios.');
    }
  }



}