import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { computed } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import type { User } from '../../core/models/user.model';
import type { UpdateUserPayload } from './users.service';
import { UsersService } from './users.service';

interface UsersState {
  users: User[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  search: string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  saving: false,
  error: null,
  search: '',
};

export const UsersStore = signalStore(
  withState(initialState),
  withComputed(({ users, search }) => ({
    filteredUsers: computed(() => {
      const q = search().toLowerCase();
      if (!q) return users();
      return users().filter(
        u =>
          u.email.toLowerCase().includes(q) ||
          (u.firstName ?? '').toLowerCase().includes(q) ||
          (u.lastName ?? '').toLowerCase().includes(q),
      );
    }),
    totalCount: computed(() => users().length),
  })),
  withMethods((store, service = inject(UsersService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next: users => patchState(store, { users, loading: false }),
              error: () =>
                patchState(store, {
                  error: 'Не вдалося завантажити користувачів',
                  loading: false,
                }),
            }),
          ),
        ),
      ),
    ),

    updateUser: rxMethod<{ id: number; payload: UpdateUserPayload }>(
      pipe(
        tap(() => patchState(store, { saving: true, error: null })),
        switchMap(({ id, payload }) =>
          service.update(id, payload).pipe(
            tapResponse({
              next: updated => {
                const users = store.users().map(u => (u.id === updated.id ? updated : u));
                patchState(store, { users, saving: false });
              },
              error: () =>
                patchState(store, {
                  error: 'Не вдалося оновити користувача',
                  saving: false,
                }),
            }),
          ),
        ),
      ),
    ),

    removeUser: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { saving: true, error: null })),
        switchMap(id =>
          service.remove(id).pipe(
            tapResponse({
              next: () => {
                const users = store.users().filter(u => u.id !== id);
                patchState(store, { users, saving: false });
              },
              error: () =>
                patchState(store, {
                  error: 'Не вдалося видалити користувача',
                  saving: false,
                }),
            }),
          ),
        ),
      ),
    ),

    setSearch(search: string): void {
      patchState(store, { search });
    },
  })),
);
