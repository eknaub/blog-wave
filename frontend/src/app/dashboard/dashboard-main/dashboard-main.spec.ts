import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMain } from './dashboard-main';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DashboardMain', () => {
  let component: DashboardMain;
  let fixture: ComponentFixture<DashboardMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMain],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
