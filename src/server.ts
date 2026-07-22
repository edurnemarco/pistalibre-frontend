import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: true,
});

/**
 * Proxy del sitemap.xml hacia el backend (Laravel/Render)
 */
app.get('/sitemap.xml', async (req, res) => {
  try {
    const response = await fetch(
      'https://pistalibre-backend.onrender.com/sitemap.xml',
    );
    const xml = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(502).send('No se pudo obtener el sitemap');
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by serverless functions (Vercel, etc.)
 */
export const reqHandler = createNodeRequestHandler(app);
export default app;
