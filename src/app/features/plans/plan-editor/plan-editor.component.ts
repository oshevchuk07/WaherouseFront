import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconComponent } from '../../../shared/components/icons/icons.component';
import { PlansService } from '../plans.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import type { PlanItemModel } from '../plan.models';
import type { IntegrationGroupModel, IntegrationItemModel } from '../../integrations/integrations.model';
import { IntegrationsService } from '../../integrations/integrations.service';
import { IntegrationsSelectionDialog } from '../../integrations/integrations-selection/integrations-selection.dialog';
import { DialogService } from '../../../shared/services/dialog.service';

// todo: refactor it
@Component({
  templateUrl: './plan-editor.component.html',
  imports: [IconComponent, FormFieldComponent, ReactiveFormsModule],
})
export class PlanEditorDialogComponent implements OnInit {
  private readonly data = inject<PlanItemModel>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PlanEditorDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly plansService = inject(PlansService);
  private readonly notify = inject(NotificationService);
  private readonly integrationsService = inject(IntegrationsService);
  private readonly dialog = inject(DialogService);

  readonly form = this.fb.nonNullable.group({});

  saving = signal(false);

  readonly editForm = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    description: [this.data?.description ?? '', Validators.required],
    subtitle: [this.data?.subtitle ?? '', Validators.required],
    isActive: [this.data?.isActive ?? true, Validators.required],
    isPopular: [this.data?.isPopular ?? true, Validators.required],
    oldMonthlyPrice: [this.data?.oldMonthlyPrice ?? 0, Validators.required],
    monthlyPrice: [this.data?.monthlyPrice ?? 0, Validators.required],
    oldYearlyPrice: [this.data?.oldYearlyPrice ?? 0, Validators.required],
    yearlyPrice: [this.data?.yearlyPrice ?? 0, Validators.required],
  });

  selectedPlatforms: IntegrationItemModel[] = [];
  selectedLogisticas: IntegrationItemModel[] = [];
  selectedMarketplaces: IntegrationItemModel[] = [];
  selectedErp: IntegrationItemModel[] = [];

  categoryList: IntegrationGroupModel[] = [];
  selectedCategoryList: IntegrationGroupModel[] = [];

  ngOnInit(): void {
    this.integrationsService.fetchIntegrations();
    this.categoryList = this.integrationsService.integrations();

    // if (this.data?.advantages) {
    //   const advantages = JSON.parse(this.data.advantages);
    //   this.selectedPlatforms = advantages?.platforms as IntegrationItemModel[] | [];
    //   this.selectedMarketplaces = advantages?.markets as IntegrationItemModel[] | [];
    //   this.selectedLogisticas = advantages?.logistics as IntegrationItemModel[] | [];
    //   this.selectedErp = advantages?.erp as IntegrationItemModel[] | [];

    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   const selectedServices = this.data?.features?.map((el: any) => el.serviceId);
    //   this.selectedCategoryList = selectedServices ?? [];
    // }
  }

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
      console.error('Form invalid');
      return;
    }

    if (this.data) {
      this.plansService
        .updateTariffItem(this.data.id, this.editForm.getRawValue())
        // .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.notify.success('Plan created');
          },
          error: () => {
            this.notify.error('Unable to create plan');
          },
          complete: () => {
            this.saving.set(false);
            this.dialogRef.close();
          },
        });
    } else {
      this.plansService
        .addPlanItem(this.editForm.getRawValue())
        // .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.notify.success('Plan created');
          },
          error: () => {
            this.notify.error('Unable to create plan');
          },
          complete: () => {
            this.saving.set(false);
            this.dialogRef.close();
          },
        });
    }

    this.saving.set(true);
  }

  editItegrationsCollection(): void {
    this.dialog.openWide(IntegrationsSelectionDialog);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
