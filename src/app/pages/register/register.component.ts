import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { register } from '../../store/auth/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../store/auth/auth.selectors';
import { AuthState } from '../../store/auth/auth.state';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  tipo: 'artista' | 'institucion' = 'artista';
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  disciplinasAbiertas = false;

  disciplinasOpciones = [
    'pintura',
    'ilustración',
    'escultura',
    'fotografía',
    'videoarte',
    'cine',
    'danza',
    'artes escénicas',
    'música',
    'gestión cultural',
    'investigación',
    'instalación',
    'grabado',
    'diseño',
    'escritura',
    'multidisciplinar',
  ].sort((a, b) => a.localeCompare(b, 'es'));

  formArtista: FormGroup;
  formInstitucion: FormGroup;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private fb: FormBuilder,
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    this.formArtista = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellidos: ['', [Validators.required, Validators.minLength(2)]],
        disciplinas: [[], Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', Validators.required],
      },
      { validators: this.passwordsMatch },
    );

    this.formInstitucion = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        ciudad: ['', Validators.required],
        region: ['', Validators.required],
        pais: ['ES', Validators.required],
        web: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', Validators.required],
      },
      { validators: this.passwordsMatch },
    );
  }

  passwordsMatch(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  setTipo(tipo: 'artista' | 'institucion') {
    this.tipo = tipo;
  }

  toggleDesplegable() {
    this.disciplinasAbiertas = !this.disciplinasAbiertas;
  }

  toggleDisciplina(disciplina: string) {
    const current: string[] = this.formArtista.get('disciplinas')?.value || [];
    const updated = current.includes(disciplina)
      ? current.filter((d) => d !== disciplina)
      : [...current, disciplina];
    this.formArtista.get('disciplinas')?.setValue(updated);
  }
  agregarDisciplinaPersonalizada(input: HTMLInputElement) {
    const d = input.value.trim().toLowerCase();
    if (d && !this.disciplinasOpciones.includes(d)) {
      this.disciplinasOpciones = [...this.disciplinasOpciones, d].sort((a, b) =>
        a.localeCompare(b, 'es'),
      );
      this.toggleDisciplina(d);
    }
    input.value = '';
  }

  isDisciplinaSelected(disciplina: string): boolean {
    return (this.formArtista.get('disciplinas')?.value || []).includes(
      disciplina,
    );
  }

  get disciplinasSeleccionadas(): string[] {
    return this.formArtista.get('disciplinas')?.value || [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.field')) {
      this.disciplinasAbiertas = false;
    }
  }

  onSubmit() {
    if (this.tipo === 'artista') {
      if (this.formArtista.invalid) return;
      const { nombre, apellidos, email, password } = this.formArtista.value;
      this.store.dispatch(
        register({ nombre, apellidos, email, password, tipo: 'artista' }),
      );
    } else {
      if (this.formInstitucion.invalid) return;
      const { nombre, ciudad, region, pais, web, email, password } =
        this.formInstitucion.value;
      this.store.dispatch(
        register({
          nombre,
          ciudad,
          region,
          pais,
          web,
          email,
          password,
          tipo: 'institucion',
        }),
      );
    }
  }
}
