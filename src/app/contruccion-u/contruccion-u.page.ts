import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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

  // Estado inicial de la estructura
  estructura: any = {};

  // Estado inicial de los acabados
  acabados: any = {};

  // Estado inicial de instalaciones
  instalaciones: any = {};

  // Opciones para Estructura de la Edificación
  estructuraCampos = [
    { label: 'Estado Const.', model: 'estado', options: ['01-Estable', '02-Inestable'] },
    { label: 'Estructura', model: 'tipo', options: ['01-Aporticado', '02-Otro'] },
    { label: 'Columnas', model: 'columnas', options: ['02-Hormigón Armado', '03-Acero'] },
    { label: 'Vigas', model: 'vigas', options: ['02-Hormigón Armado', '03-Acero'] },
    { label: 'Entre Piso', model: 'entrepiso', options: ['02-Hormigón Armado', '04-Madera'] },
    { label: 'Paredes', model: 'paredes', options: ['11-Bloque', '12-Ladrillo'] },
    { label: 'Escaleras', model: 'escaleras', options: ['02-Hormigón Armado', '05-Metal'] },
    { label: 'Cubierta', model: 'cubierta', options: ['02-Hormigón Armado', '06-Otros'] }
  ];

  // Opciones para Acabados de la Edificación
  acabadosCampos = [
    { label: 'Tumbados', model: 'tumbados', options: ['17-Arena-Cemento', '18-Gypsum'] },
    { label: 'Puertas', model: 'puertas', options: ['08-Madera Común', '09-Metal'] },
    { label: 'Cubre Ventanas', model: 'cubreVentanas', options: ['01-No tiene', '02-Sí tiene'] },
    { label: 'Rev. Interior', model: 'revInterior', options: ['17-Arena-Cemento', '19-Otro'] },
    { label: 'Rev. Exterior', model: 'revExterior', options: ['01-No tiene', '02-Sí tiene'] },
    { label: 'Rev. Pisos', model: 'revPisos', options: ['17-Arena-Cemento', '20-Cerámica'] },
    { label: 'Rev. Escalera', model: 'revEscalera', options: ['17-Arena-Cemento', '21-Madera'] },
    { label: 'Cubie. Acabados', model: 'cubieAcabados', options: ['17-Arena-Cemento', '22-Otro'] },
    { label: 'Ventanas', model: 'ventanas', options: ['06-Hierro', '07-Aluminio'] },
    { label: 'Closets', model: 'closets', options: ['01-No tiene', '03-Madera'] }
  ];

  // Opciones para Instalaciones
  instalacionesCampos = [
    { label: 'Sanitaria', model: 'sanitaria', options: ['51-Canalización Combinado', '52-Independiente'] },
    { label: 'Nro. Baños', model: 'banos', options: ['56-Dos Baños', '57-Tres Baños'] }
  ];

  // Método para guardar datos (debes personalizarlo según tu lógica)
  guardarConstruccion() {
    console.log('Guardando construcción...', {
      bloque: this.bloque,
      estructura: this.estructura,
      acabados: this.acabados,
      instalaciones: this.instalaciones
    });
    // Aquí puedes llamar a tu servicio para guardar los datos en la base de datos
  }
}