import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import type { ConfirmDialogData } from './dialog.types';
import { IconComponent } from '../icons/icons.component';

const VARIANT_STYLES = {
  danger: { icon: 'trash', iconClass: 'text-red-400', btnClass: 'ui-btn-danger' },
  warning: { icon: 'warning', iconClass: 'text-amber-400', btnClass: 'ui-btn-warning' },
  info: { icon: 'info', iconClass: 'text-blue-400', btnClass: 'ui-btn-primary' },
};

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="ui-dialog">
      <!-- Header -->
      <div class="ui-dialog__header">
        <div class="flex items-center gap-3">
          <app-icon [name]="styles.icon" [size]="22" [cssClass]="styles.iconClass" />
          <h2 class="ui-dialog__title">{{ data.title }}</h2>
        </div>
        <button class="ui-dialog__close" (click)="cancel()">
          <app-icon name="close_ring_light" [size]="32" />
        </button>
      </div>

      <!-- Body -->
      <div class="ui-dialog__body">
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ data.message }}</p>
      </div>

      <!-- Footer -->
      <div class="ui-dialog__footer">
        <button class="ui-btn-secondary" (click)="cancel()">
          {{ data.cancelLabel ?? 'Cancel' }}
        </button>
        <button [class]="styles.btnClass" (click)="confirm()">
          {{ data.confirmLabel ?? 'Confirm' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);

  readonly styles = VARIANT_STYLES[this.data.variant ?? 'info'];

  confirm(): void {
    this.ref.close(true);
  }
  cancel(): void {
    this.ref.close(false);
  }
}
