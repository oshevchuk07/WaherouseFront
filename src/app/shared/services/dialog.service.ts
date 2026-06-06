import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogData, PromptDialogData } from '../components/dialogs/dialog.types';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog.component';
import { PromptDialogComponent } from '../components/dialogs/prompt-dialog.component';

const BASE_CONFIG = {
  width: '440px',
  panelClass: 'ui-dialog-panel',
  backdropClass: 'ui-dialog-backdrop',
  disableClose: true,
};

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly matDialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.matDialog.open(ConfirmDialogComponent, {
      ...BASE_CONFIG,
      data,
    }).afterClosed();
  }

  prompt(data: PromptDialogData): Observable<string | null> {
    return this.matDialog.open(PromptDialogComponent, {
      ...BASE_CONFIG,
      data,
    }).afterClosed();
  }
}