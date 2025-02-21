import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionPRPage } from './informacion-pr.page';

describe('InformacionPRPage', () => {
  let component: InformacionPRPage;
  let fixture: ComponentFixture<InformacionPRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionPRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
