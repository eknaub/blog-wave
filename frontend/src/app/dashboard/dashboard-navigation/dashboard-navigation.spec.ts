import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNavigation } from './dashboard-navigation';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DashboardNavigation', () => {
  let component: DashboardNavigation;
  let fixture: ComponentFixture<DashboardNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNavigation],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
