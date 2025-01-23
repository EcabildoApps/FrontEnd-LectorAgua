import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TomalecturaPage } from './tomalectura.page';

describe('TomalecturaPage', () => {
  let component: TomalecturaPage;
  let fixture: ComponentFixture<TomalecturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TomalecturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
