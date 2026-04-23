import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
            }),
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.error?.message || 'Error al iniciar sesión',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          if (user.tipo === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.tipo === 'institucion') {
            this.router.navigate(['/institucion-dashboard']);
          } else {
            this.router.navigate(['/oportunidades']);
          }
        }),
      ),
    { dispatch: false },
  );
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(
        ({
          nombre,
          apellidos,
          email,
          password,
          tipo,
          ciudad,
          region,
          pais,
          web,
        }) =>
          this.authService
            .register({
              nombre,
              apellidos,
              email,
              password,
              tipo,
              ciudad,
              region,
              pais,
              web,
            })
            .pipe(
              map((response) =>
                AuthActions.registerSuccess({
                  user: response.user,
                  token: response.token,
                }),
              ),
              catchError((error) =>
                of(
                  AuthActions.registerFailure({
                    error: error.error?.message || 'Error al registrarse',
                  }),
                ),
              ),
            ),
      ),
    ),
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ user }) => {
          if (user.tipo === 'institucion') {
            this.router.navigate(['/institucion-dashboard']);
          } else {
            this.router.navigate(['/oportunidades']);
          }
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        const token = localStorage.getItem('token') || '';
        return this.authService.logout(token).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        );
      }),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );

  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      map(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          return AuthActions.loadUserFromStorageSuccess({
            user: JSON.parse(user),
            token,
          });
        }
        return AuthActions.loginFailure({ error: '' });
      }),
    ),
  );
}
