import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [LoadingService, provideZonelessChangeDetection()],
    }).compileComponents();

    service = TestBed.inject(LoadingService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start loading', () => {
    service.setLoading(true);
    expect(service.isLoading()).toBeTrue();
  });

  it('should stop loading', () => {
    service.setLoading(true);
    service.setLoading(false);
    expect(service.isLoading()).toBeFalse();
  });

  it('should not go below zero when stopping loading', () => {
    service.setLoading(false);
    expect(service.isLoading()).toBeFalse();
  });

  it('should handle multiple loading calls', () => {
    service.setLoading(true);
    service.setLoading(true);
    expect(service.isLoading()).toBeTrue();
    service.setLoading(false);
    expect(service.isLoading()).toBeTrue();
    service.setLoading(false);
    expect(service.isLoading()).toBeFalse();
  });
});
