import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contruccion-r',
  templateUrl: './contruccion-r.page.html',
  styleUrls: ['./contruccion-r.page.scss'],
  standalone: false,
})
export class ContruccionRPage implements OnInit {

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

  isEditMode: boolean = false;
  codigo: string;
  PRU01CODI: number = 0;
  registros: any[] = [];


  constructor(
    private http: HttpClient,
    private ionicStorageService: IonicstorageService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
  ) { }


  validarCampos(): boolean {
    const camposObligatorios = [
      this.selectedEstadoCons, this.selectedEstructura, this.selectedColumanas,
      this.selectedVigas, this.selectedEntrePiso, this.selectedParedes,
      this.selectedEscalera, this.selectedCubierta, this.selectedTumbados,
      this.selectedPuerta, this.selectedCubVentana, this.selectedRevInterior,
      this.selectedRevExterior, this.selectedRevPisos, this.selectedRevEscalera,
      this.selectedCubiertaAcabados, this.selectedVentanas, this.selectedCloset,
      this.selectedInsSanitarias, this.selectedNroBanios, this.selectedInsElectricas
    ];

    // Comprobar que todos los campos estén seleccionados (no nulos ni vacíos)
    return camposObligatorios.every(campo => campo);
  }

  ngOnInit() {
    // Obtener el código desde queryParams o paramMap
    this.predioId = +this.route.snapshot.paramMap.get('PUR01CODI');
    this.codigo = this.route.snapshot.queryParamMap.get('PRU01CODI'); // Capturar código del queryParam


    console.log('ID desde paramMap:', this.predioId);
    console.log('ID desde queryParamMap:', this.codigo);

    // Determinar si estamos en modo edición o agregando
    this.isEditMode = this.predioId ? true : false;
    console.log('Código recibido:', this.codigo || this.predioId);

    if (this.isEditMode) {
      console.log('Modo edición activado.');
      this.obtenerPredios();
    } else {
      // Si se está agregando una nueva construcción
      this.misDatosConstruccion = [{
        PUR01CODI: Number(this.codigo),
        PISO: null,
        BLOQUE: null,
      }];
    }

    this.cargarRegistrosPrediosRur();
    this.obtenerCatalogos();

  }

  isValid(dato: any): boolean {
    return !dato.BLOQUE || !dato.PISO;
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

        if (!this.predioId) {
          console.warn('El ID del predio no está definido');
          await this.showToast('ID de predio no válido.');
          return;
        }

        const predioSeleccionado = this.predios.find(predio => predio.PUR01CODI === this.predioId);

        if (predioSeleccionado) {
          console.log('Predio seleccionado:', predioSeleccionado);

          // Datos de construcción
          this.misDatosConstruccion = [{
            PUR01CODI: predioSeleccionado.PUR01CODI,
            PISO: predioSeleccionado.PISO,
            BLOQUE: predioSeleccionado.BLOQUE,
          }];

          // Aquí ya hemos encontrado el predio, así que establecemos los valores
          console.log('Datos de construcción:', this.misDatosConstruccion);
          this.setValoresFormulario();

        } else {
          console.warn('Predio no encontrado con el ID:', this.predioId);

          // Mostrar el mensaje y redirigir a la pantalla de agregar
          await this.showToast('Predio no registrado. Agregue uno nuevo.');
          this.router.navigate(['/contruccion-r'], {
            queryParams: { PUR01CODI: this.predioId }
          });
        }

      } else {
        console.warn('No hay predios almacenados en la aplicación.');
        await this.showToast('No hay predios registrados.');
      }
    } catch (error) {
      console.error('Error al recuperar los predios:', error);
      await this.showToast('Ocurrió un error al obtener los predios.');
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

    console.log('Datos de predios:', this.predios);

    const predio = this.predios.find(p => p.PUR01CODI === this.predioId);
    if (!predio) {
      console.warn('No se encontró el predio con PUR01CODI');
      return;
    }

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
    if (!catalogo || !Array.isArray(catalogo)) {
      console.warn(`El catálogo ${tipoCatalogo} no está definido o no es un array.`);
      return { subf: '' };
    }

    const opcion = catalogo.find((item: any) => item.REN21CODI && item.REN21CODI.toString() === codigo?.toString());
    if (opcion) {
      return { subf: opcion.REN21SUBF };
    }

    console.warn(`No se encontró el código ${codigo} en el catálogo ${tipoCatalogo}`);
    return { subf: '' };
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

  async cargarRegistrosPrediosRur() {
    this.codigo = this.route.snapshot.queryParamMap.get('PRU01CODI'); // Capturar código del queryParam

    try {
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosPrediosRural(); // Usamos el nuevo método

      console.log('Registros de predioS:', registrosLecturas);

      // Filtrar registros por ID de cuenta
      const registrosFiltrados = registrosLecturas.filter(registro => registro.PRU01CODI.toString() === this.codigo);

      if (registrosFiltrados.length > 0) {
        this.registros = registrosFiltrados;
        console.log('Registros filtrados:', this.registros);
      } else {
        this.registros = [];
      }
    } catch (error) {
      console.error('Error al cargar los registros:', error);
      await this.presentToast('Ocurrió un error al cargar los registros.');
    }
  }

  async guardarCambios() {
    this.predioId = +this.route.snapshot.paramMap.get('PUR01CODI');

    
      const registrosLecturas = await this.ionicStorageService.obtenerRegistrosPrediosRural(); // Usamos el nuevo método

      console.log('Registros de predioS:', registrosLecturas);

      // Filtrar registros por ID de cuenta
      const registrosFiltrados = registrosLecturas.filter(registro => registro.PRU01CODI === this.predioId);




    try {
      if (!this.misDatosConstruccion || this.misDatosConstruccion.length === 0) {
        await this.presentToast('No hay datos disponibles para guardar.');
        return;
      }


      const predio = this.misDatosConstruccion[0]; // Primer registro de construcción

      if (!predio || !predio.BLOQUE || !predio.PISO) {
        await this.presentToast('El número de bloque y el número de piso son obligatorios.');
        return;
      }

      console.log('Guardando predio:', predio.BLOQUE, predio.PISO);

      let cambiosRealizados = false;
      const cambios: any = {}; // Objeto para almacenar los cambios

      // Función para actualizar un campo si el valor cambió
      const actualizarSiCambio = (campo: string, valor: any, categoria: string) => {
        if (!valor) return;
        const nuevoValor = this.getValorCatalogo(valor, categoria)?.subf;
        if (nuevoValor && nuevoValor !== predio[campo]) {
          cambios[campo] = nuevoValor;
          cambiosRealizados = true;
        }
      };

      // Verificar que todos los campos requeridos tengan valor
      const camposObligatorios = [
        this.selectedEstadoCons, this.selectedEstructura, this.selectedColumanas,
        this.selectedVigas, this.selectedEntrePiso, this.selectedParedes,
        this.selectedEscalera, this.selectedCubierta, this.selectedTumbados,
        this.selectedPuerta, this.selectedCubVentana, this.selectedRevInterior,
        this.selectedRevExterior, this.selectedRevPisos, this.selectedRevEscalera,
        this.selectedCubiertaAcabados, this.selectedVentanas, this.selectedCloset,
        this.selectedInsSanitarias, this.selectedNroBanios, this.selectedInsElectricas
      ];

      if (camposObligatorios.includes(null) || camposObligatorios.includes(undefined)) {
        await this.presentToast('Por favor, complete todos los campos obligatorios.');
        return;
      }

      // Actualizar campos según selección
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
      actualizarSiCambio('GREVEXTERIOR', this.selectedRevExterior, 'revExterior');
      actualizarSiCambio('GACAPISOS', this.selectedRevPisos, 'revPisos');
      actualizarSiCambio('GREVESCA', this.selectedRevEscalera, 'revEscalera');
      actualizarSiCambio('GCUBIACAB', this.selectedCubiertaAcabados, 'cubiertaAcabados');
      actualizarSiCambio('GCLOSER', this.selectedCloset, 'closet');
      actualizarSiCambio('GISANI', this.selectedInsSanitarias, 'insSanitarias');
      actualizarSiCambio('GINBANIOS', this.selectedNroBanios, 'nroBanios');
      actualizarSiCambio('GCUBRVENT', this.selectedInsElectricas, 'insElectricas');

      if (!cambiosRealizados) {
        await this.presentToast('No se realizaron cambios.');
        return;
      }

      // Aplicar cambios a predio
      Object.assign(predio, cambios);

      if (predio.PUR01CODI) {
        predio.PUR01CODI = Number(predio.PUR01CODI);
      }

      this.registros = registrosFiltrados;
  


      console.log('Predio actualizado:', predio);

      console.log('Registros de prediosddd:', this.registros);
      console.log('Código obtenido del queryParam:', this.predioId);
      // Buscar en PREDIOSRUR el predio correspondiente
      const predioRural = this.registros.find(p => p.PRU01CODI === this.predioId);


      console.log('Predio rural encontrado:', predioRural);
      console.log('Código obtenido del queryParam:', this.predioId);

      if (predioRural) {
        // Completar los datos de predio con PREDIOSRUR
        Object.keys(predioRural).forEach(key => {
          if (predio[key] === null || predio[key] === undefined) {
            predio[key] = predioRural[key];
          }
        });

        // Asegurar que se asignen PUR01CODI y PRU01CODI
        predio.PUR01CODI = predioRural.PUR01CODI || predio.PUR01CODI;
      }

      const fechaActual = new Date();
      const fechaFormato = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(fechaActual.getDate()).padStart(2, '0')} ${String(fechaActual.getHours()).padStart(2, '0')}:${String(fechaActual.getMinutes()).padStart(2, '0')}:${String(fechaActual.getSeconds()).padStart(2, '0')}`;

      // Formato final para APP_PRE_CONSTRUC
      const datosGuardados = {
        PUR01CODI: predio.PUR01CODI,
        PISO: predio.PISO,
        BLOQUE: predio.BLOQUE,
        GESTADOCONS: predio.GESTADOCONS,
        GESTRUCTURA: predio.GESTRUCTURA,
        GESTCOLU: predio.GESTCOLU,
        GESTVIGAS: predio.GESTVIGAS,
        GESTEPISO: predio.GESTEPISO,
        GESTPARE: predio.GESTPARE,
        GESCALERAS: predio.GESCALERAS,
        GESTCUBIER: predio.GESTCUBIER,
        GACATUMB: predio.GACATUMB,
        GACAPUER: predio.GACAPUER,
        GCUBRVENT: predio.GCUBRVENT,
        GREVINTERIOR: predio.GREVINTERIOR,
        GACAPISOS: predio.GACAPISOS,
        GREVESCA: predio.GREVESCA,
        GCUBIACAB: predio.GCUBIACAB,
        GCLOSER: predio.GCLOSER,
        GISANI: predio.GISANI,
        GINBANIOS: predio.GINBANIOS,

        AREABLGIS: predioRural?.AREABLGIS || 0,
        CANTON: predioRural?.CANTON || null,
        CLAVE_CATASTRAL: predioRural?.CLAVE_CATASTRAL || null,
        GACAENLU: predioRural?.GACAENLU || null,
        GACAENLU1: predioRural?.GACAENLU1 || null,
        GACAPISOS1: predioRural?.GACAPISOS1 || null,
        GACAPUER1: predioRural?.GACAPUER1 || null,
        GACATUMB1: predioRural?.GACATUMB1 || null,
        GACAVENTA: predioRural?.GACAVENTA || null,
        GACAVENTA1: predioRural?.GACAVENTA1 || null,
        GACONS: predioRural?.GACONS || null,
        GANIOC: predioRural?.GANIOC || null,
        GAREAL: predioRural?.GAREAL || null,
        GAREPAR: predioRural?.GAREPAR || null,
        GCLOSER1: predioRural?.GCLOSER1 || null,
        GCUBIACAB1: predioRural?.GCUBIACAB1 || null,
        GCUBRVENT1: predioRural?.GCUBRVENT1 || null,
        GESCALERA1: predioRural?.GESCALERA1 || null,
        GESTADO: predioRural?.GESTADO || null,
        GESTCOLU1: predioRural?.GESTCOLU1 || null,
        GESTCUBIER1: predioRural?.GESTCUBIER1 || null,
        GESTEPISO1: predioRural?.GESTEPISO1 || null,
        GESTPARE1: predioRural?.GESTPARE1 || null,
        GESTVIGAS1: predioRural?.GESTVIGAS1 || null,

        GFCRE: fechaFormato || null,
        GID: predio.PUR01CODI || null,
        GIDLOTE: predioRural?.GIDLOTE || 0,
        GIELEC: predioRural?.GIELEC || null,
        GIESPE: predioRural?.GIESPE || null,
        GLCRE: predioRural?.GLCRE || null,
        GPORREPARA: predioRural?.GPORREPARA || null,
        GREVESCA1: predioRural?.GREVESCA1 || null,
        GREVINTERIOR1: predioRural?.GREVINTERIOR1 || null,
        IDPREDIOCONST: predioRural?.IDPREDIOCONST || null,
        IDPREDIOLOCALMENTE: predioRural?.IDPREDIOLOCALMENTE || null,
        MANZANA: predioRural?.MANZANA || null,
        MARCA: predioRural?.MARCA || null,
        NPREDIO: predioRural?.NPREDIO || null,
        OBS: predioRural?.OBS || null,
        PARROQUIA: predioRural?.PARROQUIA || null,
        PROVINCIA: predioRural?.PROVINCIA || null,
        PUR05CODI: predioRural?.PUR05CODI || null,
        SECTOR: predioRural?.SECTOR || null,
        TPPREDIO: predioRural?.TPPREDIO || null,
        VALIDO: predioRural?.VALIDO || null,
        ZONA: predioRural?.ZONA || null,



      };


      console.log('Guardando en APP_PRE_CONSTRUC:', datosGuardados);

      // Guardar o actualizar en almacenamiento local
      await this.ionicStorageService.guardarOActualizarConstruccion(datosGuardados);

      this.router.navigate([`/informacionPr${this.PRU01CODI}`]);
      await this.presentToast('Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.presentToast('Ocurrió un error al guardar los cambios.');
    }
  }


}

