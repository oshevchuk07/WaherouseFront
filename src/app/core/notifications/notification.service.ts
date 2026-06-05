import { Injectable, signal } from "@angular/core";
import { Notification, NotificationType } from "./notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notifications = signal<Notification[]>([]);

  private show(type: NotificationType, message: string, duration = 2000): void {
    const id = crypto.randomUUID();
    this.notifications.update(n => [...n, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number): void {
    this.show('info', message, duration);
  }

  dismiss(id: string): void {
    this.notifications.update(n => n.filter(item => item.id !== id));
  }
}