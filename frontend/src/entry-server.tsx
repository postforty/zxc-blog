import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { RouterProvider, createStaticHandler, createStaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from './components/common/theme-provider';
import { PostProvider } from './contexts/PostContext';
import { CommentProvider } = './contexts/CommentContext';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes'; // Import the routes array from the new routes.tsx file

export async function render(url: string) {
  const handler = createStaticHandler(routes);
  const fetchRequest = new Request(url);
  const routerContext = await handler.query(fetchRequest);

  const staticRouter = createStaticRouter(handler.dataRoutes, routerContext);

  const helmetContext = {};

  const app = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <PostProvider>
              <CommentProvider>
                <RouterProvider router={staticRouter} />
              </CommentProvider>
            </PostProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  return { app, routerContext, helmetContext };
}