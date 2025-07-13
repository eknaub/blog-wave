import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [LoggerService, provideZonelessChangeDetection()],
    }).compileComponents();

    service = TestBed.inject(LoggerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should log messages', () => {
    spyOn(console, 'log');
    const message = 'Test log message';
    service.log(message);
    expect(console.log).toHaveBeenCalledWith(message);
  });

  it('should log errors', () => {
    spyOn(console, 'error');
    const error = 'Test error message';
    service.error(error);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should log warnings', () => {
    spyOn(console, 'warn');
    const warning = 'Test warning message';
    service.warn(warning);
    expect(console.warn).toHaveBeenCalledWith(warning);
  });

  it('should log info', () => {
    spyOn(console, 'info');
    const info = 'Test info message';
    service.info(info);
    expect(console.info).toHaveBeenCalledWith(info);
  });
});
