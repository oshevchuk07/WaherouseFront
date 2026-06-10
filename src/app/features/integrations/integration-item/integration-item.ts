import { Component, input, output } from '@angular/core';
import type { IntegrationItemModel } from '../integrations.model';

@Component({
  templateUrl: './integration-item.html',
  selector: 'app-integration-item',
})
export class IntegrationItemComponent {
  readonly item = input.required<IntegrationItemModel>();
  editItem = output<IntegrationItemModel>();

  editService(): void {
    this.editItem.emit(this.item());
  }
}
