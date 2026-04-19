import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { loadUserFromStorage } from './store/auth/auth.actions';
import { selectToken } from './store/auth/auth.selectors';
import { cargarFavoritos } from './store/favoritos/favoritos.actions';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NavbarComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadUserFromStorage());

    this.store
      .select(selectToken)
      .pipe(
        filter((token) => !!token),
        take(1),
      )
      .subscribe(() => {
        this.store.dispatch(cargarFavoritos());
      });
  }
}
