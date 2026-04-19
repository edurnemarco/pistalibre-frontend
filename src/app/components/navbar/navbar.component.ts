import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { logout } from '../../store/auth/auth.actions';
import {
  selectIsAuthenticated,
  selectUser,
  selectUserTipo,
} from '../../store/auth/auth.selectors';
import { AuthState, User } from '../../store/auth/auth.state';
import { selectFavoritos } from '../../store/favoritos/favoritos.selectors';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<User | null>;
  userTipo$: Observable<string | undefined>;
  tieneFavoritosUrgentes$: Observable<boolean>;

  constructor(private store: Store<{ auth: AuthState }>) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.user$ = this.store.select(selectUser);
    this.userTipo$ = this.store.select(selectUserTipo);
    this.tieneFavoritosUrgentes$ = this.store.select(selectFavoritos).pipe(
      map((favoritos) => {
        const hoy = new Date();
        return favoritos.some((f) => {
          if (!f.convocatoria) return false;
          const dias = Math.ceil(
            (new Date(f.convocatoria.fecha_limite).getTime() - hoy.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return dias >= 0 && dias <= 7;
        });
      }),
    );
  }
  onLogout() {
    this.store.dispatch(logout());
  }
}
