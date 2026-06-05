import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../../core/models/user.model';


export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-sidebar-nav-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="item().route"
      routerLinkActive="bg-gray-700 text-white"
      [routerLinkActiveOptions]="{ exact: false }"
      class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400
             hover:bg-gray-700 hover:text-white transition-colors duration-150 cursor-pointer"
    >
      <span class="material-icons text-xl shrink-0">{{ item().icon }}</span>
      <span
        class="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-250"
        [class.w-0]="!expanded()"
        [class.opacity-0]="!expanded()"
        [class.w-auto]="expanded()"
        [class.opacity-100]="expanded()"
      >
        {{ item().label }}
      </span>
    </a>
  `,
})
export class SidebarNavItemComponent {
  item = input.required<NavItem>();
  expanded = input<boolean>(true);
}