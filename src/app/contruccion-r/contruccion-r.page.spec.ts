import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContruccionRPage } from './contruccion-r.page';

describe('ContruccionRPage', () => {
  let component: ContruccionRPage;
  let fixture: ComponentFixture<ContruccionRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContruccionRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
