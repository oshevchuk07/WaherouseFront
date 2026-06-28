import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { PlansStore } from '../plans.store';
import { PlanCardComponent } from '../plan-card-item/plan-card.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PaymentType } from '../../../core/models/user.model';

@Component({
  templateUrl: './plan-selection.component.html',
  imports: [PlanCardComponent, MatButtonToggleModule],
  providers: [PlansStore],
})
export class PlanSelectionComponent implements OnInit {
  readonly plansStore = inject(PlansStore);
  readonly PaymentType = PaymentType;

  payPeriod = signal<PaymentType>(PaymentType.MONTHLY);

  ngOnInit(): void {
    this.plansStore.loadPlanList();
  }
}
