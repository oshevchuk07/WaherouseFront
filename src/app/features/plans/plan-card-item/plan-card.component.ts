/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, inject, input, output } from '@angular/core';
import { PaymentType } from '../../../core/models/user.model';
import type { IntegrationGroupModel } from '../../integrations/integrations.model';
import { DialogService } from '../../../shared/services/dialog.service';
import { IconComponent } from '../../../shared/components/icons/icons.component';
import type { PlanItemModel } from '../plan.models';

@Component({
  templateUrl: './plan-card.component.html',
  selector: 'app-plan-cart',
  imports: [IconComponent],
})
export class PlanCardComponent {
  public readonly PaymentType = PaymentType;

  private readonly dialogService = inject(DialogService);

  item = input.required<PlanItemModel>();
  payPeriod = input<PaymentType | null>(null);
  isCurrent = input<boolean>(false);
  editMode = input<boolean>(false);
  categoryList = input<IntegrationGroupModel[]>([]);

  editItem = output<PlanItemModel>();
  startPlan = output<PlanItemModel>();

  isPopular = computed(() => this.item().isPopular);

  selectedCategoryList = computed(() => {
    // const selectedIds = this.item().planServices?.map(s => s.serviceId) ?? [];
    // if (!selectedIds.length) return [];
    // return this.filterSelectedGroups(this.categoryList(), selectedIds);
    return [] as any[];
  });

  onEditItem(): void {
    this.editItem.emit(this.item());
  }

  onStartPlan(): void {
    this.dialogService
      .confirm({
        title: 'Activate plan',
        message: `Do you want to activate the "${this.item().name}" plan?`,
        confirmLabel: 'Activate',
        variant: 'info',
      })
      .subscribe(confirmed => {
        if (confirmed) this.startPlan.emit(this.item());
      });
  }

  // private filterSelectedGroups(allGroups: IntegrationGroupModel[], selectedIds: number[]): IntegrationGroupModel[] {
  //   return allGroups
  //     .map(group => {
  //       const services = group.services.filter(s => selectedIds.includes(s.id));
  //       return services.length ? { ...group, services } : null;
  //     })
  //     .filter((g): g is IntegrationGroupModel => g !== null);
  // }
}
