import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  protected readonly settings = signal({
    notifications: {
      comments: true,
      likes: false,
      follows: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      allowMessages: true,
    },
    appearance: {
      theme: 'light' as 'light' | 'dark' | 'auto',
      language: 'en',
    },
  });

  protected readonly isDarkMode = computed(
    () => this.settings().appearance.theme === 'dark'
  );

  protected readonly hasUnsavedChanges = signal(false);

  updateNotificationSetting(
    key: keyof ReturnType<typeof this.settings>['notifications'],
    event: Event
  ) {
    const value = (event.target as HTMLInputElement | null)?.value;

    if (!value) {
      return;
    }

    this.settings.update((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }));
    this.hasUnsavedChanges.set(true);
  }

  updatePrivacySetting(
    key: keyof ReturnType<typeof this.settings>['privacy'],
    event: Event
  ) {
    const value = (event.target as HTMLInputElement | null)?.value;

    if (!value) {
      return;
    }

    this.settings.update((current) => ({
      ...current,
      privacy: {
        ...current.privacy,
        [key]: value,
      },
    }));
    this.hasUnsavedChanges.set(true);
  }

  updateTheme(event: Event) {
    const value = (event.target as HTMLSelectElement | null)?.value;

    if (!value) {
      return;
    }

    this.settings.update((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        value,
      },
    }));
    this.hasUnsavedChanges.set(true);
  }

  updateLanguage(event: Event) {
    const value = (event.target as HTMLSelectElement | null)?.value;

    if (!value) {
      return;
    }

    this.settings.update((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        value,
      },
    }));
    this.hasUnsavedChanges.set(true);
  }

  saveSettings() {
    // TODO: Implement API call to save settings
    console.log('Saving settings:', this.settings());
    this.hasUnsavedChanges.set(false);
  }

  resetSettings() {
    // Reset to default values
    this.settings.set({
      notifications: {
        comments: true,
        likes: false,
        follows: true,
      },
      privacy: {
        profileVisible: true,
        showEmail: false,
        allowMessages: true,
      },
      appearance: {
        theme: 'light',
        language: 'en',
      },
    });
    this.hasUnsavedChanges.set(true);
  }
}
