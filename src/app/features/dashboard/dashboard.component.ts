import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/notifications/notification.service';
import { IconComponent } from "../../shared/components/icons/icons.component";
import { FormFieldComponent } from "../../shared/components/form-field/form-field.component";
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [IconComponent, FormFieldComponent],
})
export class DashboardComponent {
  private readonly notify = inject(NotificationService);
  private readonly dialogService = inject(DialogService);

  submit(): void {
    this.notify.success('Sucees alert');
  }

  save(): void {
    this.dialogService.confirm({
      title: 'Видалити користувача',
      message: 'Цю дію неможливо скасувати. Продовжити?',
      variant: 'danger',
      confirmLabel: 'Видалити',
    }).subscribe(() => {
      // 
    });
  }
}