/* eslint-disable @typescript-eslint/no-explicit-any */
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IntegrationsService } from './integrations.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { IntegrationGroupModel } from './integrations.model';
import { tapResponse } from '@ngrx/operators';

interface IntegrationsState {
  integrationGroups: IntegrationGroupModel[];
  getIntegrationGroupsLoading: boolean;
  getIntegrationGroupsError: any;
}

const initialState: IntegrationsState = {
  integrationGroups: [],
  getIntegrationGroupsLoading: false,
  getIntegrationGroupsError: null,
};

export const IntegrationsStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(IntegrationsService)) => ({
    getIntegrationGroups: rxMethod<void>(
      pipe(
        tap(
          () => patchState(store, { getIntegrationGroupsLoading: true }),
          switchMap(() =>
            service.getIntegrationGroups().pipe(
              tapResponse({
                next: data => patchState(store, { integrationGroups: data.data, getIntegrationGroupsLoading: false }),
                error: () =>
                  patchState(store, {
                    getIntegrationGroupsError: 'Fail',
                    getIntegrationGroupsLoading: false,
                  }),
              }),
            ),
          ),
        ),
      ),
    ),
    //
  })),
);
