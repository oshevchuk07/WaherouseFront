import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../sidebar.types';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IconComponent } from "../../icons/icons.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar-nav-item',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  animations: [
    trigger('expandChildren', [
      state('open', style({ height: '*', opacity: 1 })),
      state('closed', style({ height: '0px', opacity: 0 })),
      transition('open <=> closed', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './sidebar-nav-item.component.html',
})
export class SidebarNavItemComponent implements OnInit {
  item = input.required<NavItem>();
  expanded = input<boolean>(true);

  isOpen = signal(false);
  clicked = output<void>();

  private readonly router = inject(Router);

  hasChildren = computed(() => !!this.item().children?.length);

  // перевіряємо чи активний будь-який дочірній роут
  isChildActive = computed(() => {
    const url = this.router.url;
    return this.item().children?.some(c => url.startsWith(c.route)) ?? false;
  });

  ngOnInit(): void {
    // якщо при завантаженні активний дочірній — розкриваємо
    if (this.isChildActive()) {
      this.isOpen.set(true);
    }

    // слухаємо навігацію щоб автоматично розкритись
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isChildActive() && !this.isOpen()) {
        this.isOpen.set(true);
      }
    });
  }

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }
}