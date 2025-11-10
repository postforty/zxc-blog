import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import authRouter from './api/auth/index.js';
import postsRouter from './api/posts/index.js';
import commentsRouter from './api/comments/index.js';
import allCommentsRouter from './api/comments/comments.router.js';
import adminRouter from './api/admin/index.js';
import statsRouter from './api/stats/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import type { ViteDevServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const app = express();
const PORT = process.env.PORT || 3001;

let vite: ViteDevServer | undefined;

// Function to escape HTML-sensitive characters for embedding JSON in HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function createServer() {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(passport.initialize());

  // API routes
  app.use('/api/auth', authRouter);
  app.use('/api/posts', postsRouter);
  app.use('/api/posts/:postId/comments', commentsRouter);
  app.use('/api/comments', allCommentsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/stats', statsRouter);

  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve(__dirname, '../../frontend'),
      configFile: path.resolve(__dirname, '../../frontend/vite.config.ts'), // Explicitly specify config file
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, '../../frontend/dist/client'), { index: false }));
  }

  // Serve Swagger docs
  app.use('/docs', express.static(path.join(__dirname, '../dist')));
  app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/redoc.html'));
  });

  // SSR middleware
  app.use(async (req: Request, res: Response, next: NextFunction) => { // Changed from app.use('*', ...)
    if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/docs')) {
      return next();
    }

    try {
      let template: string;
      let render: (url: string) => Promise<{ app: string, routerContext: any, helmetContext: any }>;

      if (!isProd && vite) {
        // Always serve fresh index.html in development
        template = await fs.readFileSync(
          path.resolve(__dirname, '../../frontend/index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(req.originalUrl, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = await fs.readFileSync(
          path.resolve(__dirname, '../../frontend/dist/client/index.html'),
          'utf-8'
        );
        render = (await import('../../frontend/dist/server/entry-server.js')).render;
      }

      const { app: appHtml, routerContext, helmetContext } = await render(req.originalUrl);

      if (routerContext.statusCode) {
        res.status(routerContext.statusCode);
      }

      if (routerContext.redirect) {
        return res.redirect(routerContext.redirect);
      }

      const { helmet } = helmetContext;

      const initialData = escapeHtml(JSON.stringify(routerContext)); // Escape the JSON string

      let html = template.replace(`<!--ssr-outlet-->`, appHtml);
      html = html.replace(
        `<script>window.__INITIAL_DATA__ = undefined;</script>`,
        `<script>window.__INITIAL_DATA__ = ${initialData};</script>`
      );
      html = html.replace(
        '</head>',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`
      );

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

createServer();
