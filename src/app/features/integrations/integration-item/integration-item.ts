import { Component, input, output } from '@angular/core';
import type { IntegrationItemModel } from '../integrations.model';
import { IconComponent } from '../../../shared/components/icons/icons.component';

@Component({
  templateUrl: './integration-item.html',
  selector: 'app-integration-item',
  imports: [IconComponent],
})
export class IntegrationItemComponent {
  readonly item = input.required<IntegrationItemModel>();
  editIntegration = output<IntegrationItemModel>();

  editService(): void {
    this.editIntegration.emit(this.item());
  }

  openExternalLink(): void {
    window.open(this.item().url, '_blank');
  }
}
