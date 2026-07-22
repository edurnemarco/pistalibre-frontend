import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'convocatorias/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'instituciones/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'artista/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
