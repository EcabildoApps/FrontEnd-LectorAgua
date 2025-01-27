import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LecturagtPage } from './lecturagt.page';

describe('LecturagtPage', () => {
  let component: LecturagtPage;
  let fixture: ComponentFixture<LecturagtPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturagtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
