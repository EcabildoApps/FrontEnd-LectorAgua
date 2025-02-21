import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-infraestructura-pr',
  templateUrl: './infraestructura-pr.page.html',
  styleUrls: ['./infraestructura-pr.page.scss'],
  standalone: false,
})
export class InfraestructuraPRPage implements OnInit {

  geocodigosDisponibles: string[] = [];
  predios: any[] = [];
  catalogos: any = {}; // Para almacenar los catálogos sincronizados
  poblacerca: any[] = [];
  ordenvia: any[] = [];

  zonainfluencia: any[] = [];
  clasetierra: any[] = [];
  usopredio: any[] = [];

  topo: any[] = [];
  forma: any[] = [];
  drenaje: any[] = [];
  tiporiego: any[] = [];
  riego: any[] = [];
  erosion: any[] = [];

  predioId: number; // Variable para almacenar el ID del predio


  // Para almacenar los valores seleccionados en el formulario
  selectedPoblacerca: string;
  selectedOrdenvia: string;

  selectedZonaInfluencia: string;
  selectedClaseTierra: string;
  selectedUsoPredio: string;

  selectedTopo: string;
  selectedForma: string;
  selectedDrenaje: string;
  selectedTipoRiego: string;
  selectedRiego: string;
  selectedErosion: string;


  aguaDisponible: boolean = false;
  electricaDisponible: boolean = false;
  alcantarilladoDisponible: boolean = false;
  telefonoDisponible: boolean = false;
  transporteDisponible: boolean = false;

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
    this.predioId = +this.route.snapshot.paramMap.get('PRU01CODI');

    const rutasGuardadas = localStorage.getItem('poligono');
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
      const lecturasGuardadas = await this.ionicStorageService.rescatar('PREDIOSRUR');
      if (lecturasGuardadas && lecturasGuardadas.data) {
        this.predios = lecturasGuardadas.data;

        // Filtrar el predio correspondiente al ID
        const predioSeleccionado = this.predios.find(predio => predio.PRU01CODI === this.predioId);

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
      const datosGuardados = await this.ionicStorageService.rescatar('CATALOGOSRUR');
      if (!datosGuardados) {
        await this.presentToast('No se encontraron catálogos guardados.');
        return;
      }

      // Guardar los catálogos completos
      this.catalogos = datosGuardados;
      console.log('Catalogos cargados:', this.catalogos);  // Agregar log aquí

      this.poblacerca = this.catalogos.gpoblacerca || [];
      this.ordenvia = this.catalogos.gordenvia || [];

      console.log('Población cercana:', this.poblacerca);  // Agregar log aquí
      console.log('Orden vía:', this.ordenvia);  // Agregar log aquí

    } catch (error) {
      console.error('Error al cargar los catálogos:', error);
      await this.presentToast('Ocurrió un error al cargar los catálogos.');
    }
  }

  async setValoresFormulario() {
    const datosGuardados = await this.ionicStorageService.rescatar('CATALOGOSRUR');
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

    this.poblacerca = this.catalogos.gpoblacerca || [];
    this.ordenvia = this.catalogos.gordenvia || [];
    this.zonainfluencia = this.catalogos.zonainfluencia || [];
    this.clasetierra = this.catalogos.clasetierra || [];
    this.usopredio = this.catalogos.gdominio || [];
    this.topo = this.catalogos.gtopografia || [];
    this.forma = this.catalogos.gforma || [];
    this.drenaje = this.catalogos.gdrenaje || [];
    this.tiporiego = this.catalogos.gtipo || [];
    this.riego = this.catalogos.griego || [];
    this.erosion = this.catalogos.gerosion || [];


    this.selectedNumeroPersonas = predio['GNROPERSONA'] || 0;
    this.selectedAreaDocumentos = predio['AREAESCR'] || 0;
    this.selectedFrentePrincipal = predio['GFONDRELA'] || 0;

    this.selectedZonaInfluencia = predio['ZONAINFLUENCIA'] || '';
    this.selectedClaseTierra = predio['CLASETIERRA'] || '';
    this.selectedUsoPredio = predio['GUSOPREDI'] || '';

    this.selectedTopo = predio['GTOPOGRAFIA'] || '';
    this.selectedForma = predio['GFORMA'] || '';
    this.selectedDrenaje = predio['GDRENAJE'] || '';
    this.selectedTipoRiego = predio['GTPRIESGO'] || '';
    this.selectedRiego = predio['GRIEGO'] || '';
    this.selectedErosion = predio['GEROSION'] || '';
    // Establece los valores de los selectores

    this.setSelectorValue(predio, 'GPOBLACERCA', 'selectedPoblacerca', this.poblacerca);
    this.setSelectorValue(predio, 'GORDENVIA', 'selectedOrdenvia', this.ordenvia);
    this.setSelectorValue(predio, 'ZONAINFLUENCIA', 'selectedZonaInfluencia', this.zonainfluencia);
    this.setSelectorValue(predio, 'CLASETIERRA', 'selectedClaseTierra', this.clasetierra);
    this.setSelectorValue(predio, 'GDOMINIO', 'selectedUsoPredio', this.usopredio);
    this.setSelectorValue(predio, 'GTOPOGRAFIA', 'selectedTopo', this.topo);
    this.setSelectorValue(predio, 'GFORMA', 'selectedForma', this.forma);
    this.setSelectorValue(predio, 'GDRENAJE', 'selectedDrenaje', this.drenaje);
    this.setSelectorValue(predio, 'GTPRIESGO', 'selectedTipoRiego', this.tiporiego);
    this.setSelectorValue(predio, 'GRIEGO', 'selectedRiego', this.riego);
    this.setSelectorValue(predio, 'GEROSION', 'selectedErosion', this.erosion);


    // Establece los valores de los checkboxes
    this.setCheckboxValue(predio, 'aguaDisponible', 'GAGUA');
    this.setCheckboxValue(predio, 'electricaDisponible', 'GALUMBPUB');
    this.setCheckboxValue(predio, 'alcantarilladoDisponible', 'GALCCAN');
    this.setCheckboxValue(predio, 'telefonoDisponible', 'GTELEF');
    this.setCheckboxValue(predio, 'transporteDisponible', 'GTRANSP');
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

      predio.GPOBLACERCA = this.getValorCatalogo(this.selectedPoblacerca, 'gpoblacerca').subf;
      predio.GORDENVIA = this.getValorCatalogo(this.selectedOrdenvia, 'gordenvia').subf;
      predio.ZONAINFLUENCIA = this.getValorCatalogo(this.selectedZonaInfluencia, 'zonainfluencia').subf;
      predio.CLASETIERRA = this.getValorCatalogo(this.selectedClaseTierra, 'clasetierra').subf;
      predio.GUSOPREDI = this.getValorCatalogo(this.selectedUsoPredio, 'gdominio').subf;
      predio.GTOPOGRAFIA = this.getValorCatalogo(this.selectedTopo, 'gtopografia').subf;
      predio.GFORMA = this.getValorCatalogo(this.selectedForma, 'gforma').subf;
      predio.GDRENAJE = this.getValorCatalogo(this.selectedDrenaje, 'gdrenaje').subf;
      predio.GTPRIESGO = this.getValorCatalogo(this.selectedTipoRiego, 'gtipo').subf;
      predio.GRIEGO = this.getValorCatalogo(this.selectedRiego, 'griego').subf;
      predio.GEROSION = this.getValorCatalogo(this.selectedErosion, 'gerosion').subf;
      

      predio.GAGUA = this.aguaDisponible ? 'S' : 'N';
      predio.GALUMBPUB = this.electricaDisponible ? 'S' : 'N';
      predio.GALCCAN = this.alcantarilladoDisponible ? 'S' : 'N';
      predio.GTELEF = this.telefonoDisponible ? 'S' : 'N';
      predio.GTRANSP = this.transporteDisponible ? 'S' : 'N';

      // Actualizar los valores de los inputs
      predio.GNROPERSONA = this.selectedNumeroPersonas;
      predio.AREAESCR = this.selectedAreaDocumentos;
      predio.GFONDRELA = this.selectedFrentePrincipal;

      // Guardar los valores en Ionic Storage
      await this.ionicStorageService.guardarOActualizarPredioRur(predio);

      // Mostrar mensaje de éxito
      await this.presentToast('Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.presentToast('Ocurrió un error al guardar los cambios.');
    }
  }



}