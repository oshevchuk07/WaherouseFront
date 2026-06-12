import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { TemplateItem } from './template.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { IconComponent } from '../../shared/components/icons/icons.component';

@Component({
  selector: 'app-template-edit-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormFieldComponent, IconComponent],
  template: `
    <div class="ui-dialog min-w-[420px]">
      <!-- Header -->
      <div class="ui-dialog__header">
        <h2 class="ui-dialog__title">{{ isEdit ? 'Edit item' : 'Add item' }}</h2>
        <button class="ui-dialog__close" (click)="cancel()" aria-label="Close">
          <app-icon name="close_ring_light" [size]="32" />
        </button>
      </div>

      <!-- Body -->
      <div class="ui-dialog__body flex flex-col gap-4" [formGroup]="form">
        <div class="flex gap-3">
          <app-form-field label="Name" class="flex-1" [error]="getError('name')">
            <input class="ui-input" type="text" placeholder="Item name" formControlName="name" />
          </app-form-field>

          <app-form-field label="Category" class="flex-1">
            <select class="ui-select" formControlName="category">
              <option value="">— Select —</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Logistics">Logistics</option>
              <option value="Other">Other</option>
            </select>
          </app-form-field>
        </div>

        <app-form-field label="Description">
          <textarea class="ui-textarea" rows="3" placeholder="Optional description" formControlName="description"></textarea>
        </app-form-field>

        <app-form-field label="Status">
          <select class="ui-select" formControlName="status">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </app-form-field>

        <label class="ui-checkbox">
          <input type="checkbox" formControlName="isActive" />
          <span>Enabled</span>
        </label>
      </div>

      <!-- Footer -->
      <div class="ui-dialog__footer">
        <button class="ui-btn-secondary" (click)="cancel()">Cancel</button>
        <button class="ui-btn-primary" [disabled]="saving()" (click)="save()">
          @if (saving()) {
            <span class="material-icons text-base animate-spin">refresh</span>
            Saving...
          } @else {
            {{ isEdit ? 'Save changes' : 'Add item' }}
          }
        </button>
      </div>
    </div>
  `,
})
export class TemplateEditDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<TemplateEditDialogComponent>);
  protected readonly data = inject<TemplateItem | null>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly isEdit = !!this.data?.id;
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    category: [this.data?.category ?? ''],
    description: [this.data?.description ?? ''],
    status: [this.data?.status ?? 'active'],
    isActive: [this.data?.isActive ?? true],
  });

  getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.touched || !ctrl.errors) return '';
    if (ctrl.hasError('required')) return 'This field is required';
    return 'Invalid value';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Simulate async save
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.dialogRef.close(this.form.getRawValue());
    }, 600);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
