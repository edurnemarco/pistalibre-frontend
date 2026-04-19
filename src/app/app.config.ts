import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';
import { ConvocatoriasEffects } from './store/convocatorias/convocatorias.effects';
import { convocatoriasReducer } from './store/convocatorias/convocatorias.reducer';

import { FavoritosEffects } from './store/favoritos/favoritos.effects';
import { favoritosReducer } from './store/favoritos/favoritos.reducer';

import { AlertasEffects } from './store/alertas/alertas.effects';
import { alertasReducer } from './store/alertas/alertas.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      auth: authReducer,
      convocatorias: convocatoriasReducer,
      favoritos: favoritosReducer,
      alertas: alertasReducer,
    }),
    provideEffects([
      AuthEffects,
      ConvocatoriasEffects,
      FavoritosEffects,
      AlertasEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
  ],
};
