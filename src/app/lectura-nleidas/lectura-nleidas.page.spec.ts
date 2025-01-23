import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LecturaNleidasPage } from './lectura-nleidas.page';

describe('LecturaNleidasPage', () => {
  let component: LecturaNleidasPage;
  let fixture: ComponentFixture<LecturaNleidasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaNleidasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
