import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntegrationsService } from '../integrations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { IntegrationGroupModel } from '../integrations.model';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icons/icons.component';

@Component({
  templateUrl: './integrations-selection.dialog.html',
  imports: [MatIcon, CommonModule, IconComponent],
})
export class IntegrationsSelectionDialog {
  private readonly dialogRef = inject(MatDialogRef<IntegrationsSelectionDialog>);
  private readonly data = inject<{ selectedIds: number[] }>(MAT_DIALOG_DATA);
  private readonly integrationsService = inject(IntegrationsService);

  readonly groupList = signal<IntegrationGroupModel[]>([]);
  readonly selectedIds = signal<Set<number>>(new Set());

  constructor() {
    this.integrationsService
      .getIntegrationGroups()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: res => {
          const groups = res.data ?? [];
          const selectedIds = this.data?.selectedIds ?? [];

          const filtered = groups.reduce<IntegrationGroupModel[]>((acc, group) => {
            const activeIntegration = group.integrations
              .filter(s => s.isActive)
              .map(s => ({ ...s, isSelected: selectedIds.some(id => +id === +s.id) }));

            if (activeIntegration.length > 0) {
              acc.push({ ...group, integrations: activeIntegration });
            }
            return acc;
          }, []);

          this.groupList.set(filtered);
        },
        error: () => this.groupList.set([]),
      });
  }

  toggle(id: number): void {
    this.selectedIds.update(ids => {
      const next = new Set(ids);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  submit(): void {
    const ids = this.selectedIds();
    const selected = this.groupList()
      .flatMap(g => g.integrations)
      .filter(s => s.isActive && ids.has(s.id));

    this.dialogRef.close(selected);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
