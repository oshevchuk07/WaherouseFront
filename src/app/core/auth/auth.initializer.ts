import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { AuthStore } from "./auth.store";
import { ThemeService } from "../services/theme.service";

export function authInitializer(): () => Promise<void> {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  inject(ThemeService)

  return async () => {
    if (!authService.isAuthenticated()) {
      return;
    };

    try {
      const user = await authService.getProfile().toPromise();
      if (user) {
        authStore.setUser(user);
      }
    } catch {
      authService.logout();
    }
  }
}