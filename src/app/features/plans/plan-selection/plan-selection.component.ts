import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { PlansStore } from '../plans.store';
import { PlanCardComponent } from '../plan-card-item/plan-card.component';

@Component({
  templateUrl: './plan-selection.component.html',
  imports: [PlanCardComponent],
  providers: [PlansStore],
})
export class PlanSelectionComponent implements OnInit {
  readonly plansStore = inject(PlansStore);

  ngOnInit(): void {
    this.plansStore.loadPlanList();
  }
}
