import { Component, computed, inject, output, signal } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavItem, SidebarNavItemComponent } from "./sidebar-nav-item.component";
import { AuthStore } from "../../../core/auth/auth.store";

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: '/app/dashboard', icon: 'home' },
  { label: 'Warehouse 3D', route: '/app/warehouse-3d', icon: 'warehouse' },
  { label: 'Planes y precios', route: '/app/plans', icon: 'account_tree' },
  { label: 'Configurador de tarifas', route: '/app/tariff-configurator', icon: 'settings', roles: ['ADMIN'] },
  { label: 'Servicios y grupos', route: '/app/services-groups', icon: 'hub', roles: ['ADMIN'] },
  { label: 'Usuarios', route: '/app/users', icon: 'group', roles: ['ADMIN'] },
  { label: 'Picking IA', route: '/app/picking-ia', icon: 'grid_view', roles: ['ADMIN'] },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [SidebarNavItemComponent],
  animations: [
    trigger('sidebarWidth', [
      state('expanded', style({ width: '240px' })),
      state('collapsed', style({ width: '64px' })),
      transition('expanded <=> collapsed',
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStore);

  isExpanded = signal(true);
  logout = output<void>();

  visibleNavItems = computed(() => {
    const role = this.authStore.user()?.role;
    return NAV_ITEMS.filter(item =>
      !item.roles || (role && item.roles.includes(role))
    );
  });

  toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }
}