import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { ActivatedRoute } from '@angular/router';
import { UserProfileStats } from './user-profile-stats/user-profile-stats';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  imports: [UserProfileStats],
})
export class UserProfile {
  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userId = signal<number | null>(null);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.userId.set(parseInt(params['id']));
    });
  }

  protected readonly user = computed(() => {
    return this.userService.getUserById(this.userId());
  });
}
