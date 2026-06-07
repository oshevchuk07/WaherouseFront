import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthStore } from '../../core/auth/auth.store';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { LayoutConfig, LayoutService } from '../../core/services/layout.service';
import { filter, Subscription } from 'rxjs';
import { BreakpointService } from '../../core/services/breakpoint.service';
import { RouteProgressBarComponent } from "../../shared/components/route-progressbar/route-progressbar.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, NotificationsComponent, RouteProgressBarComponent],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  readonly authStore = inject(AuthStore);
  readonly layout = inject(LayoutService);
  readonly bp = inject(BreakpointService);

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const data = this.getDeepestRouteData();
      const layoutConfig = data['layout'] as Partial<LayoutConfig> | undefined;

      if (layoutConfig) {
        this.layout.set(layoutConfig);
      } else {
        this.layout.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getDeepestRouteData(): Record<string, unknown> {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
  }
}