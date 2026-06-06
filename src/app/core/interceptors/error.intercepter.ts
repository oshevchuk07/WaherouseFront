import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../notifications/notification.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          authService.logout();
          router.navigateByUrl('/login');
          break;
        case 403:
          router.navigateByUrl('/app/dashboard');
          notify.warning('Acess denied');
          break;

        case 0:
          // CORS, offline, timeout etc...
          notify.error('Network error. Please check your connection')
          break;

        default:
          if (error.status >= 500) {
            notify.error('Server error. Please try again later.')
          }
          break;
      }

      console.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error)

      return throwError(() => error);
    })
  )
}