import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { AuthStore } from "./auth.store";

export function authInitializer(): () => Promise<void> {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

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