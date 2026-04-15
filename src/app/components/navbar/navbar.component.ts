import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from '../../store/auth/auth.actions';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../store/auth/auth.selectors';
import { AuthState, User } from '../../store/auth/auth.state';

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

  constructor(private store: Store<{ auth: AuthState }>) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.user$ = this.store.select(selectUser);
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
