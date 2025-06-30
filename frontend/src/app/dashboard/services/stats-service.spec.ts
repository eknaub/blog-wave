import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(StatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
