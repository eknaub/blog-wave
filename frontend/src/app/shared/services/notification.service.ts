import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showNotification(message: string, action = 'Close') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
    });
  }
}
