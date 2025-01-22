import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LecRapidaPage } from './lec-rapida.page';

describe('LecRapidaPage', () => {
  let component: LecRapidaPage;
  let fixture: ComponentFixture<LecRapidaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LecRapidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
