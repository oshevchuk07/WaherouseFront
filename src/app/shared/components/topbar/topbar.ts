import { Component, input } from '@angular/core';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 shrink-0">
      @if (user()) {
        <span class="text-sm text-gray-500">
          ({{ user()!.email }})
        </span>
      }
    </header>
  `,
})
export class TopbarComponent {
  user = input<AuthUser | null>(null);
}