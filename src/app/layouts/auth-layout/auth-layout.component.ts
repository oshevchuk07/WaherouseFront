import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NotificationsComponent],
  template: `
    <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <router-outlet />
    </div>

    <app-notifications />
  `,
})
export class AuthLayoutComponent {}
