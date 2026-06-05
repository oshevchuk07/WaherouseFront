import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService } from '../../../core/notifications/notification.service';
import { NotificationType } from '../../../core/notifications/notification.model';

const ICONS: Record<NotificationType, string> = {
  success: 'check_circle',
  error:   'error',
  warning: 'warning',
  info:    'info',
};

const STYLES: Record<NotificationType, string> = {
  success: 'bg-emerald-900/90 border-emerald-700 text-emerald-100',
  error:   'bg-red-900/90 border-red-700 text-red-100',
  warning: 'bg-amber-900/90 border-amber-700 text-amber-100',
  info:    'bg-blue-900/90 border-blue-700 text-blue-100',
};

const ICON_STYLES: Record<NotificationType, string> = {
  success: 'text-emerald-400',
  error:   'text-red-400',
  warning: 'text-amber-400',
  info:    'text-blue-400',
};

@Component({
  selector: 'app-notifications',
  standalone: true,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      @for (n of service.notifications(); track n.id) {
        <div
          [@slideIn]
          class="flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm
                 shadow-lg pointer-events-auto cursor-default"
          [class]="styles[n.type]"
        >
          <span class="material-icons text-xl shrink-0 mt-0.5" [class]="iconStyles[n.type]">
            {{ icons[n.type] }}
          </span>
          <span class="text-sm flex-1 leading-relaxed">{{ n.message }}</span>
          <button
            (click)="service.dismiss(n.id)"
            class="material-icons text-lg shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            close
          </button>
        </div>
      }
    </div>
  `,
})
export class NotificationsComponent {
  readonly service = inject(NotificationService);
  readonly icons = ICONS;
  readonly styles = STYLES;
  readonly iconStyles = ICON_STYLES;
}