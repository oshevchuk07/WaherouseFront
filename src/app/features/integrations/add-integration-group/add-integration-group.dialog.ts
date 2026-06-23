import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../core/notifications/notification.service';
import { IntegrationsService } from '../integrations.service';
import { IconComponent } from '../../../shared/components/icons/icons.component';
import { IntegrationsStore } from '../integrations.store';

@Component({
  selector: 'app-add-integration-group-dialog',
  templateUrl: './add-integration-group.dialog.html',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, IconComponent],
})
export class AddIntegrationGroupDialogComponent implements OnInit {
  private integrationsService = inject(IntegrationsService);
  private dialogRef = inject(MatDialogRef<AddIntegrationGroupDialogComponent>);
  private notification = inject(NotificationService);
  private readonly integrationStore = inject(IntegrationsStore);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected data = inject<{ item?: any }>(MAT_DIALOG_DATA, { optional: true });

  name = new FormControl('', [Validators.required]);
  saving = signal(false);

  ngOnInit(): void {
    if (this.data?.item) {
      this.name.patchValue(this.data.item?.name || '');
    }

    this.integrationStore.getIntegrationGroups();
  }

  submit(): void {
    if (this.name.invalid || this.saving()) return;

    this.saving.set(true);
    const isEdit = !!this.data?.item?.id;
    const id = this.data?.item?.id;
    const nameValue = this.name.value ?? '';

    const request$ = isEdit
      ? this.integrationsService.updateCategory(id!, { name: nameValue })
      : this.integrationsService.addCategory({ name: nameValue });

    request$.subscribe({
      next: res => {
        this.saving.set(false);

        this.notification.warning(isEdit ? 'Integration group updated!' : 'Integration group created!');
        this.dialogRef.close(res);
      },
      error: () => {
        this.saving.set(false);
        this.notification.warning(isEdit ? 'The group cannot be updated' : 'The group could not be created');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
