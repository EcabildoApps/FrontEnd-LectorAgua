import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContruccionUPage } from './contruccion-u.page';

describe('ContruccionUPage', () => {
  let component: ContruccionUPage;
  let fixture: ComponentFixture<ContruccionUPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContruccionUPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
