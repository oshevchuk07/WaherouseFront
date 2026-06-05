import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthStore } from '../../core/auth/auth.store';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, NotificationsComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-gray-50">
      <app-sidebar (onLogout)="authStore.logout()" />

      <div class="flex flex-col flex-1 overflow-hidden">
        <app-topbar [user]="authStore.user()" />

        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>

    <app-notifications />
  `,
})
export class AdminLayoutComponent {
  readonly authStore = inject(AuthStore);
}