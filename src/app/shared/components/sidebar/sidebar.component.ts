import { Component, signal } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('sidebarExpand', [
      state('expanded', style({ width: '240px' })),
      state('collapsed', style({ width: '64px' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ]
})
export class SidebarComponent {
  isExpanded = signal(true);

  toggle() {
    this.isExpanded.update(v => !v);
  }
}