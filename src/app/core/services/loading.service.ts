import { inject, Injectable, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Track Angular Router navigation lifecycle and expose a signal
 * that components can use to show show/hide global loading indicator
 */

@Injectable({
  providedIn: 'root',
})
export class RouterLoadingService {
  private readonly router = inject(Router);
  private readonly _isNavigating = signal(false);

  readonly isNavigating = this._isNavigating.asReadonly();

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(() => this._isNavigating.set(true));

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError))
      .subscribe(() => this._isNavigating.set(false));
  }
}
