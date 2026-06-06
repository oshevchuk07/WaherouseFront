import { Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarNavItemComponent } from "./sidebar-nav-item.component";
import { AuthStore } from "../../../core/auth/auth.store";
import { NavDivider, NavEntry, NavItem } from "./sidebar.types";
import { NAV_CONFIG } from "./sidebar.config";
import { UserRole } from "../../../core/models/user.model";
import { IconComponent } from "../icons/icons.component";
import { BreakpointService } from "../../../core/services/breakpoint.service";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [SidebarNavItemComponent, IconComponent, NgTemplateOutlet],
  animations: [
    // desctop/tablet
    trigger('sidebarWidth', [
      state('expanded', style({ width: '240px' })),
      state('collapsed', style({ width: '64px' })),
      transition('expanded <=> collapsed',
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')
      ),
    ]),
    // mobile 
    trigger('mobileSlide', [
      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(-100%)' })),
      transition('open <=> closed',
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStore);
  readonly bp = inject(BreakpointService);

  forceCollapsed = input<boolean>(false);
  logout = output<void>();

  // десктоп стан
  private desktopExpanded = signal(true);

  // мобільний стан
  mobileOpen = signal(false);

  isCollapsed = computed(() =>
    this.forceCollapsed() || !this.desktopExpanded()
  );

  // показувати лейбли:
  // desktop — залежить від collapsed
  // tablet  — тільки якщо розгорнутий (overlay режим)
  // mobile  — завжди показуємо (сайдбар повноширокий)
  showLabels = computed(() => {
    if (this.bp.isMobile()) return true;
    if (this.bp.isTablet()) return !this.isCollapsed();
    return !this.isCollapsed();
  });

  constructor() {
    // при зміні breakpoint — скидаємо стани
    effect(() => {
      const bp = this.bp.breakpoint();

      if (bp === 'tablet') {
        // планшет — завжди collapsed за замовчуванням
        this.desktopExpanded.set(false);
      }
      if (bp === 'desktop') {
        // десктоп — розгортаємо
        this.desktopExpanded.set(true);
        this.mobileOpen.set(false);
      }
      if (bp === 'mobile') {
        this.mobileOpen.set(false);
      }
    });
  }

  // публічний метод — topbar викликає для відкриття на мобільному
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

  // закриваємо мобільний після кліку на пункт меню
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