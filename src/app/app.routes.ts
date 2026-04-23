import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { ConvocatoriaComponent } from './pages/convocatoria/convocatoria.component';
import { InstitucionPublicoComponent } from './pages/institucion-publico/institucion-publico.component';
import { InstitucionComponent } from './pages/institucion/institucion.component';
import { LoginComponent } from './pages/login/login.component';
import { OportunidadesComponent } from './pages/oportunidades/oportunidades.component';
import { PerfilPublicoComponent } from './pages/perfil-publico/perfil-publico.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'oportunidades', pathMatch: 'full' },
  { path: 'oportunidades', component: OportunidadesComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  {
    path: 'institucion-dashboard',
    component: InstitucionComponent,
    canActivate: [authGuard],
  },
  { path: 'artista/:id', component: PerfilPublicoComponent, pathMatch: 'full' },
  { path: 'instituciones/:id', component: InstitucionPublicoComponent },
  { path: 'convocatorias/:id', component: ConvocatoriaComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'oportunidades' },
];
