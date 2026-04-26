# Pistalibre — Frontend

Frontend Angular de Pistalibre, plataforma web de convocatorias artísticas para conectar artistas e instituciones culturales.

## Requisitos previos

- Node.js 18 o superior
- Angular CLI 19: `npm install -g @angular/cli`
- Backend Laravel arrancado en `http://127.0.0.1:8000`

## Instalación

1. Descomprimir el proyecto y acceder a la carpeta

   cd pistalibre-frontend

2. Instalar dependencias

   npm install

3. Configurar la URL de la API

   Abrir `src/environments/environment.development.ts` y verificar que la URL apunta al backend:

   export const environment = {
   production: false,
   apiUrl: 'http://127.0.0.1:8000/api'
   };

4. Arrancar el servidor de desarrollo

   ng serve

   La aplicación queda disponible en http://localhost:4200.

## Usuarios de prueba

- Artista: ane@pistalibre.com / password123
- Institución: tramaestudio@gmail.com / tramatrama
- Admin: admin@pistalibre.com / admin123

## Estructura del proyecto

src/
app/
components/ → navbar, footer
pages/ → oportunidades, login, register, perfil, admin...
services/ → llamadas a la API REST
store/ → estado global con NgRx
guards/ → authGuard, guestGuard
directives/ → scroll-reveal
environments/ → URLs de entorno
styles.scss → variables y estilos globales

## Notas

- El backend Laravel debe estar corriendo antes de arrancar el frontend.
- El token de autenticación se guarda en localStorage y persiste entre sesiones.

## Repositorio relacionado

- Backend Laravel: https://github.com/edurnemarco/pistalibre-api

## Autor

Edurne Marco — TFM Máster Universitario en Desarrollo de sitios y aplicaciones web, UOC 2026
