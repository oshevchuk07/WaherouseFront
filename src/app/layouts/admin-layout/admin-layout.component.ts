import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthStore } from '../../core/auth/auth.store';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';
import type { LayoutConfig } from '../../core/services/layout.service';
import { LayoutService } from '../../core/services/layout.service';
import type { Subscription } from 'rxjs';
import { filter, map } from 'rxjs';
import { BreakpointService } from '../../core/services/breakpoint.service';
import { RouteProgressBarComponent } from '../../shared/components/route-progressbar/route-progressbar.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, NotificationsComponent, RouteProgressBarComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  readonly authStore = inject(AuthStore);
  readonly layout = inject(LayoutService);
  readonly bp = inject(BreakpointService);

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private sub?: Subscription;

  private readonly routeData = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.getDeepestRouteData()),
    ),
  );

  constructor() {
    effect(() => {
      const data = this.routeData();
      const layoutConfig = data?.['layout'] as Partial<LayoutConfig> | undefined;

      if (layoutConfig) {
        this.layout.set(layoutConfig);
      } else {
        this.layout.reset();
      }
    });
  }

  private getDeepestRouteData(): Record<string, unknown> {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
  }
}
