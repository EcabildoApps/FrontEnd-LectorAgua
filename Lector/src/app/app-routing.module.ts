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
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
