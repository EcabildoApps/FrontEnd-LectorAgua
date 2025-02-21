import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfraestructuraPRPage } from './infraestructura-pr.page';

describe('InfraestructuraPRPage', () => {
  let component: InfraestructuraPRPage;
  let fixture: ComponentFixture<InfraestructuraPRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraestructuraPRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
