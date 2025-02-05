import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPurbanosPage } from './lista-purbanos.page';

describe('ListaPurbanosPage', () => {
  let component: ListaPurbanosPage;
  let fixture: ComponentFixture<ListaPurbanosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPurbanosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
