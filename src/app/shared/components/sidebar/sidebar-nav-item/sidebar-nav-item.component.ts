import type { OnInit } from '@angular/core';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import type { NavItem } from '../sidebar.types';
import { IconComponent } from '../../icons/icons.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar-nav-item',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar-nav-item.component.html',
})
export class SidebarNavItemComponent implements OnInit {
  item = input.required<NavItem>();
  expanded = input<boolean>(true);

  isOpen = signal(false);
  clicked = output<void>();

  private readonly router = inject(Router);

  hasChildren = computed(() => !!this.item().children?.length);

  isChildActive = computed(() => {
    const url = this.router.url;
    return this.item().children?.some(c => url.startsWith(c.route)) ?? false;
  });

  ngOnInit(): void {
    if (this.isChildActive()) {
      this.isOpen.set(true);
    }

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      if (this.isChildActive() && !this.isOpen()) {
        this.isOpen.set(true);
      }
    });
  }

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }
}
