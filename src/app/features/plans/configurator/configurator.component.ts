import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { PlanEditorDialogComponent } from '../plan-editor/plan-editor.component';
import { PlansStore } from '../plans.store';
import { CommonModule } from '@angular/common';
import type { PlanItemModel } from '../plan.models';
import { MatTableModule } from '@angular/material/table';
import { IconComponent } from '../../../shared/components/icons/icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { take } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  templateUrl: './configurator.component.html',
  imports: [CommonModule, MatTableModule, IconComponent, MatMenuModule],
  providers: [PlansStore],
})
export class PlanConfiguratorComponent implements OnInit {
  private readonly dialog = inject(DialogService);
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

  readonly objectKeys = Object.keys;

  ngOnInit(): void {
    this.plansStore.loadPlanList();
  }

  addNewPlan(): void {
    this.dialog
      .openWide(PlanEditorDialogComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.plansStore.loadPlanList();
        }
      });
  }

  editPlanItem(item: PlanItemModel): void {
    this.dialog
      .openWide(PlanEditorDialogComponent, item)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.plansStore.loadPlanList();
        }
      });
  }

  getTotalCount(features: Record<string, unknown[]>): number {
    return Object.values(features).reduce((sum, arr) => sum + arr.length, 0);
  }
}
