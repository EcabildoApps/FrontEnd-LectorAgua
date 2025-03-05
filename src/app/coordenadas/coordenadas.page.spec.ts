import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoordenadasPage } from './coordenadas.page';

describe('CoordenadasPage', () => {
  let component: CoordenadasPage;
  let fixture: ComponentFixture<CoordenadasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordenadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
