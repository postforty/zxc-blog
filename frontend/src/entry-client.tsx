import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import './index.css'
import './i18n';

import { ThemeProvider } from './components/common/theme-provider'
import { PostProvider } from './contexts/PostContext'
import { CommentProvider } from './contexts/CommentContext'
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes'; // Import the routes array from the new routes.tsx file

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

const initialData = window.__INITIAL_DATA__;

const router = createBrowserRouter(routes, {
  hydrationData: initialData,
});

ReactDOM.hydrateRoot(document.getElementById('root')!,
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <PostProvider>
            <CommentProvider>
              <RouterProvider router={router} />
            </CommentProvider>
          </PostProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
)