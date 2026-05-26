# Pistalibre — Frontend

Frontend Angular de Pistalibre, plataforma web de convocatorias artísticas para conectar artistas e instituciones culturales.

## URL de producción

https://pistalibre-frontend.vercel.app

## Repositorios

- Backend: https://github.com/edurnemarco/pistalibre-api
- Frontend: https://github.com/edurnemarco/pistalibre-frontend

## Requisitos

Node.js 22
npm

## Instalación en local

1. Instalar dependencias
   npm install
2. Arrancar el servidor de desarrollo
   ng serve

La aplicación queda disponible en http://localhost:4200.
Por defecto apunta al backend local http://127.0.0.1:8000/api. Para apuntar al backend de producción editar
src/environments/environment.development.ts:

typescriptexport const environment = {
production: false,
apiUrl: 'https://pistalibre-backend.onrender.com/api',
};

## Build de producción

ng build --configuration production

El resultado se genera en dist/pistalibre-frontend/browser.

## Despliegue en producción

El frontend está desplegado en Vercel. Se redespliega automáticamente con cada push a la rama main. La configuración de build en Vercel es:

Build Command: ng build --configuration production
Output Directory: dist/pistalibre-frontend/browser

## Variable de entorno en Vercel:

NG_APP_API_URL=https://pistalibre-backend.onrender.com
