import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthStore } from '../../core/auth/auth.store';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { LayoutConfig, LayoutService } from '../../core/services/layout.service';
import { filter, Subscription } from 'rxjs';
import { BreakpointService } from '../../core/services/breakpoint.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, NotificationsComponent],
  template: `
     <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

      <app-sidebar
        #sidebar
        [forceCollapsed]="layout.config().sidebarCollapsed"
        (onLogout)="authStore.logout()"
      />

      <div class="flex flex-col flex-1 overflow-hidden relative min-w-0">

        @if (layout.config().topbarVisible) {
          <app-topbar
            [user]="authStore.user()"
            [transparent]="layout.config().topbarTransparent"
            [showMenuButton]="!bp.isDesktop()"
            (menuClick)="sidebar.toggleExpanded()"
          />
        }

        <main
          class="flex-1 overflow-y-auto p-6 transition-all duration-200"
          [class.absolute]="layout.config().topbarTransparent"
          [class.inset-0]="layout.config().topbarTransparent"
        >
          <router-outlet />
        </main>

      </div>
    </div>

    <app-notifications />
  `,
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebarRef!: SidebarComponent;

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