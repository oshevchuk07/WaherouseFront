import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './plan-editor.component.html',
})
export class PlanEditorDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PlanEditorDialogComponent>);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({});
}
