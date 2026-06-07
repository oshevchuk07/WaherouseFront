import type { ApplicationConfig } from '@angular/core';
import { inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.intercaptor';
import { errorInterceptor } from './core/interceptors/error.intercepter';
import { AuthService } from './core/auth/auth.service';
import { AuthStore } from './core/auth/auth.store';
import { ThemeService } from './core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      const authStore = inject(AuthStore);
      inject(ThemeService);

      if (!authService.isAuthenticated()) return;

      try {
        const user = await authService.getProfile().toPromise();
        if (user) authStore.setUser(user);
      } catch {
        authService.logout();
      }
    }),
  ],
};
