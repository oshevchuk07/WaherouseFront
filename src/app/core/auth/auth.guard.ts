import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { AuthStore } from "./auth.store";
import { catchError, map, of } from "rxjs";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authStore.user()) {
    return true;
  }

  return authService.getProfile().pipe(
    map(user => {
      authStore.setUser(user);
      return true;
    }),
    catchError(() => {
      authService.logout();
      return of(router.createUrlTree(['/login']));
    })
  );
}