import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionPPage } from './informacion-p.page';

describe('InformacionPPage', () => {
  let component: InformacionPPage;
  let fixture: ComponentFixture<InformacionPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
