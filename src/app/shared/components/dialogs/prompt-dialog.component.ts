import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import type { PromptDialogData } from './dialog.types';
import { FormFieldComponent } from '../form-field/form-field.component';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  imports: [FormsModule, FormFieldComponent, IconComponent],
  template: `
    <div class="ui-dialog">
      <!-- Header -->
      <div class="ui-dialog__header">
        <h2 class="ui-dialog__title">{{ data.title }}</h2>
        <button class="ui-dialog__close" (click)="cancel()">
          <app-icon name="close" [size]="18" />
        </button>
      </div>

      <!-- Body -->
      <div class="ui-dialog__body flex flex-col gap-4">
        @if (data.message) {
          <p class="text-sm text-gray-400 leading-relaxed">{{ data.message }}</p>
        }

        <app-form-field [label]="data.label" [error]="error()">
          <input
            class="ui-input"
            type="text"
            [placeholder]="data.placeholder ?? ''"
            [(ngModel)]="value"
            (ngModelChange)="onValueChange()"
            (keydown.enter)="confirm()"
            #inputRef
          />
        </app-form-field>
      </div>

      <!-- Footer -->
      <div class="ui-dialog__footer">
        <button class="ui-btn-secondary" (click)="cancel()">
          {{ data.cancelLabel ?? 'Скасувати' }}
        </button>
        <button class="ui-btn-primary" [disabled]="!!error() || !value.trim()" (click)="confirm()">
          {{ data.confirmLabel ?? 'Підтвердити' }}
        </button>
      </div>
    </div>
  `,
})
export class PromptDialogComponent {
  readonly data = inject<PromptDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<PromptDialogComponent>);

  value = this.data.initialValue ?? '';
  error = signal<string>('');

  onValueChange(): void {
    if (!this.data.validators?.length) {
      this.error.set('');
      return;
    }
    const failed = this.data.validators.find(v => !v.validate(this.value));
    this.error.set(failed?.message ?? '');
  }

  confirm(): void {
    if (this.error() || !this.value.trim()) return;
    this.ref.close(this.value.trim());
  }

  cancel(): void {
    this.ref.close(null);
  }
}
