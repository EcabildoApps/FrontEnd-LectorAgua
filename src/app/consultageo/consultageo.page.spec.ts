import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultageoPage } from './consultageo.page';

describe('ConsultageoPage', () => {
  let component: ConsultageoPage;
  let fixture: ComponentFixture<ConsultageoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultageoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
