import { inject } from "@angular/core";
import { AuthUser } from "../models/user.model"
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { RxMethod, rxMethod } from "@ngrx/signals/rxjs-interop"
import { AuthService, LoginPayload } from "./auth.service";
import { Router } from "@angular/router";
import { pipe, of } from "rxjs";
import { switchMap, tap, catchError } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

const getErrorMessage = (err: { status: number }): string =>
  err.status === 401 ? 'Невірний email або пароль' : 'Помилка сервера. Спробуйте пізніше';


export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login: rxMethod<LoginPayload>(
      switchMap(payload => {
        patchState(store, { loading: true, error: null });

        return authService.login(payload).pipe(
          tapResponse({
            next: ({ access_token, user }: { access_token: string; user: AuthUser }) => {
              authService.saveToken(access_token);
              patchState(store, { user, loading: false });
              router.navigateByUrl('/app/dashboard');
            },
            error: (err: { status: number }) =>
              patchState(store, { error: getErrorMessage(err), loading: false }),
          })
        )
      })
    ),
    loadProfile: rxMethod<void>(
      switchMap(() =>
        authService.getProfile().pipe(
          tapResponse({
            next: (user: AuthUser) => patchState(store, { user }),
            error: () => {
              authService.logout();
              router.navigateByUrl('/login');
            },
          })
        )
      )
    ),

    logout() {
      authService.logout();
      patchState(store, initialState);
      router.navigateByUrl('/login');
    },
  }))
)