import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loggingInterceptor } from './shared/interceptors/logging.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { retryInterceptor } from './shared/interceptors/retry.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor,
        errorInterceptor,
        loadingInterceptor,
        retryInterceptor,
      ])
    ),
  ],
};
