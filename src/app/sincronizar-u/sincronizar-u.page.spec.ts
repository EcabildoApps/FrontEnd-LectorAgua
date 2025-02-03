import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SincronizarUPage } from './sincronizar-u.page';

describe('SincronizarUPage', () => {
  let component: SincronizarUPage;
  let fixture: ComponentFixture<SincronizarUPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SincronizarUPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
