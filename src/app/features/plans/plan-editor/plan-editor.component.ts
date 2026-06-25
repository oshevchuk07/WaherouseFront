import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconComponent } from '../../../shared/components/icons/icons.component';
import { PlansService } from '../plans.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import type { PlanItemModel } from '../plan.models';
import { IntegrationsService } from '../../integrations/integrations.service';
import { IntegrationsSelectionDialog } from '../../integrations/integrations-selection/integrations-selection.dialog';
import { DialogService } from '../../../shared/services/dialog.service';
import { KeyValuePipe } from '@angular/common';
import { forkJoin, of, switchMap, take } from 'rxjs';
import type { IntegrationItemModel } from '../../integrations/integrations.model';

type FeaturesMap = Record<string, IntegrationItemModel[]>;

@Component({
  templateUrl: './plan-editor.component.html',
  imports: [IconComponent, FormFieldComponent, ReactiveFormsModule, KeyValuePipe],
})
export class PlanEditorDialogComponent {
  readonly data = inject<PlanItemModel>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PlanEditorDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly plansService = inject(PlansService);
  private readonly notify = inject(NotificationService);
  private readonly integrationsService = inject(IntegrationsService);
  private readonly dialog = inject(DialogService);

  readonly saving = signal(false);
  readonly isEditMode = !!this.data?.id;

  readonly form = this.fb.nonNullable.group({});

  readonly currentIntegrations = signal<PlanItemModel>(this.data);

  readonly selectedIds = signal<number[]>(
    this.data?.features ? Object.values(this.data.features).flatMap(items => items.map(item => item.id)) : [],
  );
  readonly selectedFeatures = signal<FeaturesMap>((this.data?.features as FeaturesMap) ?? {});

  readonly selectedCount = computed(() => this.selectedIds().length);

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

  getFieldError(controlName: string): string {
    const control = this.editForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.hasError('required')) return 'This field is required';

    return 'Invalid field value';
  }

  save(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.editForm.getRawValue();
    const ids = this.selectedIds();

    if (this.isEditMode) {
      forkJoin([
        this.plansService.updateTariffItem(this.data.id, formValue),
        this.integrationsService.bulkReplaceServices(this.data.id, ids),
      ]).subscribe({
        next: () => this.notify.success('Plan updated'),
        error: () => {
          this.notify.error('Unable to update plan');
          this.saving.set(false);
        },
        complete: () => {
          this.saving.set(false);
          this.dialogRef.close();
        },
      });
    } else {
      this.plansService
        .addPlanItem(formValue)
        .pipe(switchMap(newPlan => (ids.length > 0 ? this.integrationsService.bulkReplaceServices(newPlan.id, ids) : of(null))))
        .subscribe({
          next: () => this.notify.success('Plan created'),
          error: () => {
            this.notify.error('Unable to create plan');
            this.saving.set(false);
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
    this.dialog
      .openWide(IntegrationsSelectionDialog, { selectedIds: this.selectedIds() })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: { ids: number[]; grouped: FeaturesMap } | null) => {
        if (result) {
          this.selectedIds.set(result.ids);
          this.selectedFeatures.set(result.grouped);
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
