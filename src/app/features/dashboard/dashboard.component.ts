import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/notifications/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-gray-800">Home</h1>
      <p class="text-gray-500 text-sm">Dashboard — en construcción</p>
      <button (click)="submit()">Sucess</button>
    </div>
  `,
})
export class DashboardComponent {
  private readonly notify = inject(NotificationService);

  submit(): void {
    this.notify.success('Sucees alert');
  }
}