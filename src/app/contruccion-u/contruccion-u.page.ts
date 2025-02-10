import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicstorageService } from '../services/ionicstorage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contruccion-u',
  templateUrl: './contruccion-u.page.html',
  styleUrls: ['./contruccion-u.page.scss'],
  standalone: false
})
export class ContruccionUPage {
  // Datos iniciales del bloque
  bloque = {
    gid: '',
    piso: null,
    bloque: null
  };

  // Variables para los campos de selección
  estructura: any = {};
  acabados: any = {};
  instalaciones: any = {};

  // Variables para los campos dinámicos
  estructuraCampos: any[] = [];
  acabadosCampos: any[] = [];
  instalacionesCampos: any[] = [];

  constructor(private ionicStorageService: IonicstorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const PUR01CODI = params['PUR01CODI']; // Aquí obtienes el PUR01CODI
      console.log('PUR01CODI desde la ruta:', PUR01CODI);
      this.bloque.gid = PUR01CODI;
      this.cargarDatosDesdeStorage();  // Llamas a la función con PUR01CODI para cargar los datos específicos
    });
  }

  async cargarDatosDesdeStorage() {
    try {
      // Cargar registros de construcción desde el almacenamiento
      const construccionData = await this.ionicStorageService.obtenerRegistrosConstruccion();
      console.log('Datos de construcción:', construccionData);


      if (construccionData) {
        if (construccionData && construccionData.estestadoCons) {
          console.log('Estado de construcción:', construccionData.estestadoCons);
          this.estructuraCampos = [
            { label: 'Estado Const.', model: 'estado', options: construccionData.estestadoCons ? construccionData.estestadoCons.map(item => item.REN21DESC) : [] },
            { label: 'Estructura', model: 'tipo', options: construccionData.estructura.map(item => item.REN21DESC) },
            { label: 'Columnas', model: 'columnas', options: construccionData.columna.map(item => item.REN21DESC) },
            { label: 'Vigas', model: 'vigas', options: construccionData.vigas.map(item => item.REN21DESC) },
            { label: 'Entre Piso', model: 'entrepiso', options: construccionData.entrePiso.map(item => item.REN21DESC) },
            { label: 'Paredes', model: 'paredes', options: construccionData.paredes.map(item => item.REN21DESC) },
            { label: 'Escaleras', model: 'escaleras', options: construccionData.escalera.map(item => item.REN21DESC) },
            { label: 'Cubierta', model: 'cubierta', options: construccionData.cubiertaAcabados.map(item => item.REN21DESC) }
          ];
        }

        if (construccionData && construccionData.tumbados) {
          this.acabadosCampos = [
            { label: 'Tumbados', model: 'tumbados', options: construccionData.tumbados.map(item => item.REN21DESC) },
            { label: 'Puertas', model: 'puertas', options: construccionData.puerta.map(item => item.REN21DESC) },
            { label: 'Cubre Ventanas', model: 'cubreVentanas', options: construccionData.cubreVentana.map(item => item.REN21DESC) },
            { label: 'Rev. Interior', model: 'revInterior', options: construccionData.revInterior.map(item => item.REN21DESC) },
            { label: 'Rev. Exterior', model: 'revExterior', options: construccionData.revExterior.map(item => item.REN21DESC) },
            { label: 'Rev. Pisos', model: 'revPisos', options: construccionData.revPisos.map(item => item.REN21DESC) },
            { label: 'Rev. Escalera', model: 'revEscalera', options: construccionData.revEscalera.map(item => item.REN21DESC) },
            { label: 'Cubie. Acabados', model: 'cubieAcabados', options: construccionData.revEscalera.map(item => item.REN21DESC) },
            { label: 'Ventanas', model: 'ventanas', options: construccionData.ventanas.map(item => item.REN21DESC) },
            { label: 'Closets', model: 'closets', options: construccionData.closet.map(item => item.REN21DESC) }
          ];
        }

        if (construccionData && construccionData.insSanitarias) {
          this.instalacionesCampos = [
            { label: 'Sanitaria', model: 'sanitaria', options: construccionData.insSanitarias.map(item => item.REN21DESC) },
            { label: 'Nro. Baños', model: 'banos', options: construccionData.nroBanios.map(item => item.REN21DESC) },
            { label: 'Electrica', model: 'electrica', options: construccionData.insElectricas.map(item => item.REN21DESC) },
          ];
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos desde IonicStorage:', error);
    }
  }
  // Método para guardar datos (personaliza según tu lógica)
  guardarConstruccion() {
    console.log('Guardando construcción...', {
      bloque: this.bloque,
      estructura: this.estructura,
      acabados: this.acabados,
      instalaciones: this.instalaciones
    });
  }
}