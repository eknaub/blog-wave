import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = signal(0);

  isLoading = computed(() => {
    return this.loading() > 0;
  });

  setLoading(isLoading: boolean): void {
    if (isLoading) {
      this.loading.update((current) => current + 1);
    } else {
      this.loading.update((current) => Math.max(current - 1, 0));
    }
  }
}
