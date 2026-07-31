import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import type { ConfirmDialogData, PromptDialogData } from '../components/dialogs/dialog.types';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog.component';
import { PromptDialogComponent } from '../components/dialogs/prompt-dialog.component';
import type { ComponentType } from '@angular/cdk/overlay';

const BASE_CONFIG = {
  width: '440px',
  panelClass: 'ui-dialog-panel',
  backdropClass: 'ui-dialog-backdrop',
  disableClose: true,
};

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, {
        ...BASE_CONFIG,
        data,
      })
      .afterClosed();
  }

  prompt(data: PromptDialogData): Observable<string | null> {
    return this.dialog
      .open(PromptDialogComponent, {
        ...BASE_CONFIG,
        data,
      })
      .afterClosed();
  }

  open<T>(component: ComponentType<T>, data?: unknown) {
    return this.dialog.open(component, {
      data,
      panelClass: 'ui-dialog-panel',
      backdropClass: 'ui-dialog-backdrop',
      maxWidth: '95vw',
      width: 'auto',
    });
  }

  openWide<T>(component: ComponentType<T>, data?: unknown) {
    return this.dialog.open(component, {
      data,
      panelClass: ['ui-dialog-panel', 'ui-dialog-panel-wide'],
      backdropClass: 'ui-dialog-backdrop',
      maxWidth: '95vw',
      width: 'auto',
    });
  }
}
