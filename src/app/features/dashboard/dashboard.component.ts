import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/notifications/notification.service';
import { IconComponent } from "../../shared/components/icons/icons.component";
import { FormFieldComponent } from "../../shared/components/form-field/form-field.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [IconComponent, FormFieldComponent],
})
export class DashboardComponent {
  private readonly notify = inject(NotificationService);

  submit(): void {
    this.notify.success('Sucees alert');
  }
}