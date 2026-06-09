import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { PlansService } from '../../plans/plans.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import type { User } from '../../../core/models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { IconComponent } from '../../../shared/components/icons/icons.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './edit-user.dialog.html',
  imports: [ReactiveFormsModule, FormFieldComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserDialogComponent {
  protected readonly data = inject<User>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  private readonly usersService = inject(UsersService);
  private readonly plansService = inject(PlansService);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly plans = toSignal(this.plansService.getActivePlans(), { initialValue: [] });
  readonly saving = signal(false);

  readonly editForm = this.fb.nonNullable.group({
    firstName: [this.data.firstName ?? '', Validators.required],
    lastName: [this.data.lastName ?? '', Validators.required],
    email: [this.data.email ?? '', [Validators.required, Validators.email]],
    planId: [String(this.data.planId ?? '')],
  });

  getFieldError(controlName: string): string {
    const control = this.editForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Enter a valid email address';

    return 'Invalid field value';
  }

  save(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const { firstName, lastName, email, planId } = this.editForm.getRawValue();

    const requests: Record<string, Observable<unknown>> = {
      updateUser: this.usersService.update(this.data.id, { firstName, lastName, email }),
    };

    const newPlanId = planId ? Number(planId) : null;
    if (newPlanId && newPlanId !== this.data.planId) {
      requests['assignPlan'] = this.usersService.assignPlan(this.data.id, {
        planId: newPlanId,
        paymentType: 'MONTHLY',
      });
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.notify.success('User updated successfully');
        this.dialogRef.close(true);
      },
      error: () => {
        this.notify.error('Failed to update user');
        this.saving.set(false);
        this.dialogRef.close(false);
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
