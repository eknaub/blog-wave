import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-delete-element-dialog',
  templateUrl: './delete-element-dialog.html',
  styleUrl: './delete-element-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDivider,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
  ],
})
export class DeleteElementDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteElementDialog>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
