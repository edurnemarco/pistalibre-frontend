import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { InstitucionComponent } from './pages/institucion/institucion.component';
import { LoginComponent } from './pages/login/login.component';
import { OportunidadesComponent } from './pages/oportunidades/oportunidades.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'oportunidades', pathMatch: 'full' },
  { path: 'oportunidades', component: OportunidadesComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'oportunidades' },
  { path: 'instituciones/:id', component: InstitucionComponent },
];
