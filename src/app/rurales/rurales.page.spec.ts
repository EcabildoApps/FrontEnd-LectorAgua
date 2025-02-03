import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuralesPage } from './rurales.page';

describe('RuralesPage', () => {
  let component: RuralesPage;
  let fixture: ComponentFixture<RuralesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RuralesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
