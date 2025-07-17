import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
//import { loggingInterceptor } from './shared/interceptors/logging.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { retryInterceptor } from './shared/interceptors/retry.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading.interceptor';
import { credentialsInterceptor } from './shared/interceptors/credentials.interceptor';
import { performanceInterceptor } from './shared/interceptors/performance.interceptor';
import { unwrapApiResponseInterceptor } from './shared/interceptors/unwrapApiResponse.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        unwrapApiResponseInterceptor,
        credentialsInterceptor,
        performanceInterceptor,
        //loggingInterceptor,
        errorInterceptor,
        loadingInterceptor,
        retryInterceptor,
      ])
    ),
  ],
};
