import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { IntegrationsService } from '../integrations.service';
import { MatDialog } from '@angular/material/dialog';
import { AddIntegrationGroupDialogComponent } from '../add-integration-group/add-integration-group.dialog';

@Component({
  selector: 'app-integrations-list',
  templateUrl: './integrations.component.html',
})
export class IntegrationsListComponent implements OnInit {
  private integrationsService = inject(IntegrationsService);
  private readonly dialog = inject(MatDialog);

  integrationsList = this.integrationsService.integrations;
  isLoading = this.integrationsService.isIntegrationsLoading;

  ngOnInit(): void {
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
}
