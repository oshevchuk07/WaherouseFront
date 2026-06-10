import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import type { IntegrationItemModel } from '../integrations.model';
import { IntegrationsService } from '../integrations.service';
import { NotificationService } from '../../../core/notifications/notification.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { IconComponent } from '../../../shared/components/icons/icons.component';

@Component({
  templateUrl: './integration-item.dialog.html',
  imports: [ReactiveFormsModule, FormFieldComponent, IconComponent],
})
export class IntegrationItemDialogComponent {
  readonly data = inject<{ item: IntegrationItemModel; catId: number | string }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<IntegrationItemDialogComponent>);
  readonly integrationsService = inject(IntegrationsService);
  private readonly notify = inject(NotificationService);

  private readonly fb = inject(FormBuilder);

  readonly saving = signal(false);
  readonly previewUrl = signal<string | null>(this.data.item?.logoImage ?? null);
  readonly selectedFile = signal<File | null>(null);

  readonly isEdit = !!this.data.item?.id;

  readonly integrationForm = this.fb.nonNullable.group({
    name: [this.data.item?.name ?? '', Validators.required],
    url: [this.data.item?.url ?? '', Validators.required],
    description: [this.data.item?.description ?? ''],
    isActive: [this.data.item?.isActive ?? true],
  });

  getFieldError(controlName: string): string {
    const control = this.integrationForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.hasError('required')) return 'This field is required';
    return 'Invalid value';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.preventDefault();
    this.selectedFile.set(null);

    if (this.data.item?.id && this.data.item?.logoImage) {
      this.integrationsService
        .removeServiceImage(this.data.item.id)
        .pipe(takeUntilDestroyed())
        .subscribe({ next: () => this.previewUrl.set(null) });
    } else {
      this.previewUrl.set(null);
    }
  }

  save(): void {
    if (this.integrationForm.invalid) {
      this.integrationForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const payload = {
      ...this.integrationForm.getRawValue(),
      categoryId: this.data.catId,
    };

    const request$ = this.isEdit
      ? this.integrationsService.updateService(String(this.data.item!.id), payload)
      : this.integrationsService.addService(payload);

    request$.subscribe({
      next: res => {
        const id = this.isEdit ? String(this.data.item!.id) : res.data?.id ? String(res.data.id) : undefined;

        if (this.selectedFile() && id) {
          const formData = new FormData();
          formData.append('file', this.selectedFile()!);

          this.integrationsService.uploadServiceImage(id, formData).subscribe({
            next: uploaded => {
              this.notify.success(this.isEdit ? 'Service updated' : 'Service added');
              this.dialogRef.close(uploaded.data);
            },
            error: () => {
              this.notify.error('Failed to upload image');
              this.saving.set(false);
            },
          });
        } else {
          this.notify.success(this.isEdit ? 'Service updated' : 'Service added');
          this.dialogRef.close(res.data);
        }
      },
      error: () => {
        this.notify.error(this.isEdit ? 'Failed to update service' : 'Failed to add service');
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
