import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlanEditorDialogComponent } from '../plan-editor/plan-editor.component';

@Component({
  templateUrl: './plan-configurator.component.html',
})
export class PlanConfiguratorComponent {
  private readonly dialog = inject(MatDialog);

  addNewPlan(): void {
    this.dialog.open(PlanEditorDialogComponent);
  }
}
