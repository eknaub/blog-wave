import {
  ChangeDetectionStrategy,
  Component,
  signal,
  effect,
} from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggle],
})
export class Settings {
  commentNotifications = signal(false);
  likeNotifications = signal(false);
  followNotifications = signal(false);
  publicProfile = signal(false);
  showEmail = signal(false);
  allowMessages = signal(false);
  theme = signal<'light' | 'dark' | 'auto'>('auto');
  language = signal<'en' | 'es' | 'fr' | 'de'>('en');

  protected readonly hasUnsavedChanges = signal(false);

  private readonly initialState = {
    commentNotifications: this.commentNotifications(),
    likeNotifications: this.likeNotifications(),
    followNotifications: this.followNotifications(),
    publicProfile: this.publicProfile(),
    showEmail: this.showEmail(),
    allowMessages: this.allowMessages(),
    theme: this.theme(),
    language: this.language(),
  };

  constructor() {
    effect(() => {
      const changed =
        this.commentNotifications() !==
          this.initialState.commentNotifications ||
        this.likeNotifications() !== this.initialState.likeNotifications ||
        this.followNotifications() !== this.initialState.followNotifications ||
        this.publicProfile() !== this.initialState.publicProfile ||
        this.showEmail() !== this.initialState.showEmail ||
        this.allowMessages() !== this.initialState.allowMessages ||
        this.theme() !== this.initialState.theme ||
        this.language() !== this.initialState.language;
      this.hasUnsavedChanges.set(changed);
    });
  }

  saveSettings() {
    this.initialState.commentNotifications = this.commentNotifications();
    this.initialState.likeNotifications = this.likeNotifications();
    this.initialState.followNotifications = this.followNotifications();
    this.initialState.publicProfile = this.publicProfile();
    this.initialState.showEmail = this.showEmail();
    this.initialState.allowMessages = this.allowMessages();
    this.initialState.theme = this.theme();
    this.initialState.language = this.language();
    this.hasUnsavedChanges.set(false);
  }

  resetSettings() {
    this.commentNotifications.set(this.initialState.commentNotifications);
    this.likeNotifications.set(this.initialState.likeNotifications);
    this.followNotifications.set(this.initialState.followNotifications);
    this.publicProfile.set(this.initialState.publicProfile);
    this.showEmail.set(this.initialState.showEmail);
    this.allowMessages.set(this.initialState.allowMessages);
    this.theme.set(this.initialState.theme);
    this.language.set(this.initialState.language);
    this.hasUnsavedChanges.set(false);
  }
}
