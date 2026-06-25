import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntegrationsService } from '../integrations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { IntegrationGroupModel, IntegrationItemModel } from '../integrations.model';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icons/icons.component';

@Component({
  templateUrl: './integrations-selection.dialog.html',
  imports: [CommonModule, IconComponent],
})
export class IntegrationsSelectionDialog {
  private readonly dialogRef = inject(MatDialogRef<IntegrationsSelectionDialog>);
  private readonly data = inject<{ selectedIds: number[] }>(MAT_DIALOG_DATA);
  private readonly integrationsService = inject(IntegrationsService);

  readonly groupList = signal<IntegrationGroupModel[]>([]);
  readonly selectedIds = signal<Set<number>>(new Set(this.data?.selectedIds ?? []));

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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  submit(): void {
    const ids = this.selectedIds();

    const grouped = this.groupList().reduce<Record<string, IntegrationItemModel[]>>((acc, group) => {
      const selected = group.integrations.filter(i => ids.has(i.id));
      if (selected.length > 0) {
        acc[group.name.toLowerCase()] = selected;
      }
      return acc;
    }, {});

    this.dialogRef.close({ ids: Array.from(ids), grouped });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
