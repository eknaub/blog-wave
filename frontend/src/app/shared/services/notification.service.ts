import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  showNotification(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
    });
  }
}
