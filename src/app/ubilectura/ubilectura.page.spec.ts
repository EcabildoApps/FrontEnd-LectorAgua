import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbilecturaPage } from './ubilectura.page';

describe('UbilecturaPage', () => {
  let component: UbilecturaPage;
  let fixture: ComponentFixture<UbilecturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UbilecturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
