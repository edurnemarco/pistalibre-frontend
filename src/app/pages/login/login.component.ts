import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login } from '../../store/auth/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../store/auth/auth.selectors';
import { AuthState } from '../../store/auth/auth.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  form: FormGroup;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private fb: FormBuilder,
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.store.dispatch(login({ email, password }));
  }
}
