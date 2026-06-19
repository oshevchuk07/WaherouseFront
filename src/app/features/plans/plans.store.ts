import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import type { PlanItemModel } from './plan.models';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { PlansService } from './plans.service';

interface PlansState {
  planList: PlanItemModel[];
  planListLoading: boolean;
  planListError: string | null;
}

const initialState: PlansState = {
  planList: [],
  planListLoading: false,
  planListError: null,
};

export const PlansStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(PlansService)) => ({
    loadPlanList: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { planListLoading: true, planListError: null })),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next: data => patchState(store, { planList: data, planListLoading: false }),
              error: () =>
                patchState(store, {
                  planListError: 'Fail',
                  planListLoading: false,
                }),
            }),
          ),
        ),
      ),
    ),
  })),
);
