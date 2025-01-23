import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendienteXcausaPage } from './pendiente-xcausa.page';

describe('PendienteXcausaPage', () => {
  let component: PendienteXcausaPage;
  let fixture: ComponentFixture<PendienteXcausaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PendienteXcausaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
