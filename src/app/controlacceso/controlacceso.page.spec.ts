import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlaccesoPage } from './controlacceso.page';

describe('ControlaccesoPage', () => {
  let component: ControlaccesoPage;
  let fixture: ComponentFixture<ControlaccesoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlaccesoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
