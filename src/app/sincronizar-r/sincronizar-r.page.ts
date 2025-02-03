import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sincronizar-r',
  templateUrl: './sincronizar-r.page.html',
  styleUrls: ['./sincronizar-r.page.scss'],
  standalone: false,
})
export class SincronizarRPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async obtenerDatos() {
    console.log('Obteniendo datos');
  }

  async actualizarLecturas() {
    console.log('Actualizando lecturas');
  }


}
