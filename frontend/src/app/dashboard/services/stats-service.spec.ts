import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
