import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PrincipalPage } from './principal/principal.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'lectura',
    loadChildren: () => import('./lectura/lectura.module').then( m => m.LecturaPageModule)
  },
  {
    path: 'lec-rapida',
    loadChildren: () => import('./lec-rapida/lec-rapida.module').then( m => m.LecRapidaPageModule)
  },
  {
    path: 'busqueda-medidor',
    loadChildren: () => import('./busqueda-medidor/busqueda-medidor.module').then( m => m.BusquedaMedidorPageModule)
  },
  {
    path: 'sincronizar',
    loadChildren: () => import('./sincronizar/sincronizar.module').then( m => m.SincronizarPageModule)
  },
  {
    path: 'corrigelectura',
    loadChildren: () => import('./corrigelectura/corrigelectura.module').then( m => m.CorrigelecturaPageModule)
  },
  {
    path: 'tomalectura',
    loadChildren: () => import('./tomalectura/tomalectura.module').then( m => m.TomalecturaPageModule)
  },
  {
    path: 'tomalectura/:idCuenta',
    loadChildren: () => import('./tomalectura/tomalectura.module').then( m => m.TomalecturaPageModule)
  },
  {
    path: 'pendiente-xcausa',
    loadChildren: () => import('./pendiente-xcausa/pendiente-xcausa.module').then( m => m.PendienteXcausaPageModule)
  },
  {
    path: 'lectura-nleidas',
    loadChildren: () => import('./lectura-nleidas/lectura-nleidas.module').then( m => m.LecturaNleidasPageModule)
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./ajustes/ajustes.module').then( m => m.AjustesPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'controlacceso',
    loadChildren: () => import('./controlacceso/controlacceso.module').then( m => m.ControlaccesoPageModule)
  },
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
