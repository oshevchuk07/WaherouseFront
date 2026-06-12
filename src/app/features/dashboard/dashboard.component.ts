import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/notifications/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [TemplateComponent],
})
export class DashboardComponent {
  private readonly notify = inject(NotificationService);
  private readonly dialogService = inject(DialogService);

  submit(): void {
    this.notify.success('Sucees alert');
  }

  save(): void {
    this.dialogService
      .confirm({
        title: 'Видалити користувача',
        message: 'Цю дію неможливо скасувати. Продовжити?',
        variant: 'danger',
        confirmLabel: 'Видалити',
      })
      .subscribe(() => {
        //
      });
  }
}
