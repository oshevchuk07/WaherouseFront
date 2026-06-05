import { CanActivateFn, Router } from "@angular/router";
import { UserRole } from "../models/user.model";
import { inject } from "@angular/core";
import { AuthStore } from "./auth.store";

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const user = authStore.user();

    if (!user) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree(['/app/dashboard']);
  }
}