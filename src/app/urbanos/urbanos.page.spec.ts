import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrbanosPage } from './urbanos.page';

describe('UrbanosPage', () => {
  let component: UrbanosPage;
  let fixture: ComponentFixture<UrbanosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UrbanosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
