import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCard } from './stats-card';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { StatsService } from '../../../../services/stats-service';

describe('StatsCard', () => {
  let component: StatsCard;
  let fixture: ComponentFixture<StatsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCard],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hasErrors true when blogService has error', () => {
    const statsService = TestBed.inject(StatsService);
    spyOn(statsService, 'blogServiceError').and.returnValue('Error');
    spyOn(statsService, 'userServiceError').and.returnValue(null);

    expect(component.hasErrors()).toBeTruthy();
  });

  it('should hasErrors true when userService has error', () => {
    const statsService = TestBed.inject(StatsService);
    spyOn(statsService, 'blogServiceError').and.returnValue(null);
    spyOn(statsService, 'userServiceError').and.returnValue('Error');

    expect(component.hasErrors()).toBeTruthy();
  });

  it('should hasErrors false when no errors', () => {
    const statsService = TestBed.inject(StatsService);
    spyOn(statsService, 'blogServiceError').and.returnValue(null);
    spyOn(statsService, 'userServiceError').and.returnValue(null);

    expect(component.hasErrors()).toBeNull();
  });
});
