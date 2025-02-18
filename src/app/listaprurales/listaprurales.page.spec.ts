import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListapruralesPage } from './listaprurales.page';

describe('ListapruralesPage', () => {
  let component: ListapruralesPage;
  let fixture: ComponentFixture<ListapruralesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListapruralesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
