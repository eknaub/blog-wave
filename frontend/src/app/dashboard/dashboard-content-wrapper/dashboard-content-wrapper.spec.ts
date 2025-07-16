import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContentWrapper } from './dashboard-content-wrapper';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DashboardContentWrapper', () => {
  let component: DashboardContentWrapper;
  let fixture: ComponentFixture<DashboardContentWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentWrapper],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContentWrapper);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Title');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
