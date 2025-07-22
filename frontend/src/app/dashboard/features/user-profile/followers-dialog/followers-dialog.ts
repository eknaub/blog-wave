import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserFollowersService } from '../../../services/user-followers-service';

export enum FollowersDialogType {
  FOLLOWERS = 'FOLLOWERS',
  FOLLOWING = 'FOLLOWING',
}

@Component({
  selector: 'app-followers-dialog',
  templateUrl: './followers-dialog.html',
  styleUrl: './followers-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
  ],
})
export class FollowersDialog {
  protected readonly FollowersDialogType = FollowersDialogType;
  private readonly dialogRef = inject(MatDialogRef<FollowersDialog>);
  private readonly followersService = inject(UserFollowersService);
  protected readonly data = inject(MAT_DIALOG_DATA) as {
    type: FollowersDialogType;
  };

  protected readonly followers = this.followersService.followers();
  protected readonly following = this.followersService.following();
  protected readonly dialogType = this.data.type;

  protected readonly dialogTitle =
    this.dialogType === FollowersDialogType.FOLLOWERS
      ? $localize`:@@dialog.followers.title:Followers`
      : $localize`:@@dialog.following.title:Following`;

  protected closeDialog(): void {
    console.log('Close followers dialog');
    this.dialogRef.close();
  }
}
