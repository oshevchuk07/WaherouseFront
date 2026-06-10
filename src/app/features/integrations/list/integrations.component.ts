import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { IntegrationsService } from '../integrations.service';
import { MatDialog } from '@angular/material/dialog';
import { AddIntegrationGroupDialogComponent } from '../add-integration-group/add-integration-group.dialog';
import { IntegrationItemComponent } from '../integration-item/integration-item';
import type { IntegrationGroupModel, IntegrationItemModel } from '../integrations.model';
import { IntegrationItemDialogComponent } from '../integration-item-dialog/integration-item.dialog';

@Component({
  selector: 'app-integrations-list',
  templateUrl: './integrations.component.html',
  imports: [IntegrationItemComponent],
})
export class IntegrationsListComponent implements OnInit {
  private integrationsService = inject(IntegrationsService);
  private readonly dialog = inject(MatDialog);

  integrationsList = this.integrationsService.integrations;
  isLoading = this.integrationsService.isIntegrationsLoading;

  ngOnInit(): void {
    this.fetchIntegrations();
  }

  private fetchIntegrations(): void {
    this.integrationsService.fetchIntegrations();
  }

  addNewGroup(): void {
    this.dialog
      .open(AddIntegrationGroupDialogComponent)
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.integrationsService.fetchIntegrations();
        }
      });
  }

  editGroup(item: IntegrationGroupModel): void {
    this.dialog
      .open(AddIntegrationGroupDialogComponent, { data: { item: item } })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.fetchIntegrations();
        }
      });
  }

  editIntegration(item: IntegrationItemModel): void {
    this.dialog.open(IntegrationItemDialogComponent, { data: item });
  }

  addIntegration(item: IntegrationGroupModel): void {
    this.dialog
      .open(IntegrationItemDialogComponent, { data: { catId: item.id } })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.fetchIntegrations();
        }
      });
  }
}
