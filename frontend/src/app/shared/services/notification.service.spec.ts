import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        provideZonelessChangeDetection(),
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    });

    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show a notification with default action', () => {
    service.showNotification('Hello!');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Hello!',
      'Close',
      jasmine.objectContaining({ duration: 3000, verticalPosition: 'bottom' })
    );
  });

  it('should show a notification with custom action', () => {
    service.showNotification('Goodbye!', 'Dismiss');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Goodbye!',
      'Dismiss',
      jasmine.objectContaining({ duration: 3000, verticalPosition: 'bottom' })
    );
  });
});
