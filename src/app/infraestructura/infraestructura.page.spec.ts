import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfraestructuraPage } from './infraestructura.page';

describe('InfraestructuraPage', () => {
  let component: InfraestructuraPage;
  let fixture: ComponentFixture<InfraestructuraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraestructuraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
