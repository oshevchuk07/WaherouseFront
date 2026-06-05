import { Component, output, signal } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavItem, SidebarNavItemComponent } from "./sidebar-nav-item.component";

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: '/app/dashboard', icon: 'home' },
  { label: 'Warehouse 3D', route: '/app/warehouse-3d', icon: 'warehouse' },
  { label: 'Planes y precios', route: '/app/plans', icon: 'account_tree' },
  { label: 'Configurador de tarifas', route: '/app/tariff-configurator', icon: 'settings' },
  { label: 'Servicios y grupos', route: '/app/services-groups', icon: 'hub' },
  { label: 'Usuarios', route: '/app/users', icon: 'group' },
  { label: 'Picking IA', route: '/app/picking-ia', icon: 'grid_view' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [SidebarNavItemComponent],
  animations: [
    trigger('sidebarExpand', [
      state('expanded', style({ width: '240px' })),
      state('collapsed', style({ width: '64px' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ]
})
export class SidebarComponent {
  readonly navItems = NAV_ITEMS;
  isExpanded = signal(true);
  logout = output<void>();

  toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }
}