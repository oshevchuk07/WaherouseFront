import { Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { SidebarNavItemComponent } from "./sidebar-nav-item/sidebar-nav-item.component";
import { AuthStore } from "../../../core/auth/auth.store";
import { NavDivider, NavEntry, NavItem } from "./sidebar.types";
import { NAV_CONFIG } from "./sidebar.config";
import { UserRole } from "../../../core/models/user.model";
import { BreakpointService } from "../../../core/services/breakpoint.service";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [SidebarNavItemComponent, NgTemplateOutlet],
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStore);
  readonly bp = inject(BreakpointService);

  forceCollapsed = input<boolean>(false);
  logout = output<void>();

  private desktopExpanded = signal(true);

  mobileOpen = signal(false);

  isCollapsed = computed(() =>
    this.forceCollapsed() || !this.desktopExpanded()
  );

  // Labels
  // desktop — depends on collapsed
  // tablet  — only if expanded (overlay mode)
  // mobile  — Always
  showLabels = computed(() => {
    if (this.bp.isMobile()) return true;
    if (this.bp.isTablet()) return !this.isCollapsed();
    return !this.isCollapsed();
  });

  constructor() {
    // sidebar behaviour on different break points
    effect(() => {
      const bp = this.bp.breakpoint();

      if (bp === 'tablet') {
        this.desktopExpanded.set(false);
      }
      if (bp === 'desktop') {
        this.desktopExpanded.set(true);
        this.mobileOpen.set(false);
      }
      if (bp === 'mobile') {
        this.mobileOpen.set(false);
      }
    });
  }

  openMobile(): void {
    this.mobileOpen.set(true);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  collapseTablet(): void {
    this.desktopExpanded.set(false);
  }

  toggleDesktop(): void {
    this.desktopExpanded.update(v => !v);
  }

  onNavItemClick(): void {
    if (this.bp.isMobile()) {
      this.mobileOpen.set(false);
    }
  }

  visibleEntries = computed<NavEntry[]>(() => {
    const role = this.authStore.user()?.role as UserRole | undefined;
    return NAV_CONFIG.filter(entry =>
      !entry.roles || (role && entry.roles.includes(role))
    );
  });

  toggleExpanded(): void {
    if (this.bp.isMobile()) {
      this.openMobile();
    } else {
      this.toggleDesktop();
    }
  }

  asItem(entry: NavEntry): NavItem { return entry as NavItem; }
  asDivider(entry: NavEntry): NavDivider { return entry as NavDivider; }
}