import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaMedidorPage } from './busqueda-medidor.page';

describe('BusquedaMedidorPage', () => {
  let component: BusquedaMedidorPage;
  let fixture: ComponentFixture<BusquedaMedidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaMedidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
