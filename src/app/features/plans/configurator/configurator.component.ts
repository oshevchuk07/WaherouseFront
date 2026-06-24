import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlanEditorDialogComponent } from '../plan-editor/plan-editor.component';
import { PlansStore } from '../plans.store';
import { CommonModule } from '@angular/common';
import { PlanCardComponent } from '../plan-card-item/plan-card.component';
import type { PlanItemModel } from '../plan.models';
import { MatTableModule } from '@angular/material/table';
import { IconComponent } from '../../../shared/components/icons/icons.component';

@Component({
  templateUrl: './configurator.component.html',
  imports: [CommonModule, PlanCardComponent, MatTableModule, IconComponent],
  providers: [PlansStore],
})
export class PlanConfiguratorComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  readonly plansStore = inject(PlansStore);

  readonly columns = [
    'name',
    'description',
    'active',
    'popular',
    'oldMonthPrice',
    'monthPrice',
    'oldYearlyPrice',
    'yearlyPrice',
    'integrations',
    'actions',
  ];

  ngOnInit(): void {
    this.plansStore.loadPlanList();
  }

  addNewPlan(): void {
    this.dialog.open(PlanEditorDialogComponent);
  }

  editPlanItem(item: PlanItemModel): void {
    this.dialog.open(PlanEditorDialogComponent, { data: item, panelClass: 'ui-dialog-panel', maxWidth: '95vw' });
  }
}
