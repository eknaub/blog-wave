import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContentWrapper } from './dashboard-content-wrapper';

describe('DashboardContentWrapper', () => {
  let component: DashboardContentWrapper;
  let fixture: ComponentFixture<DashboardContentWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContentWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
