import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/notifications/notification.service';
import { NotificationType } from '../../../core/notifications/notification.model';

const ICONS: Record<NotificationType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const STYLES: Record<NotificationType, string> = {
  success: 'bg-emerald-900/90 border-emerald-700 text-emerald-100',
  error: 'bg-red-900/90 border-red-700 text-red-100',
  warning: 'bg-amber-900/90 border-amber-700 text-amber-100',
  info: 'bg-blue-900/90 border-blue-700 text-blue-100',
};

const ICON_STYLES: Record<NotificationType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
};

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  readonly service = inject(NotificationService);
  readonly icons = ICONS;
  readonly styles = STYLES;
  readonly iconStyles = ICON_STYLES;
}