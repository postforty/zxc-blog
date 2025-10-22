import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n';

import { ThemeProvider } from './components/common/theme-provider'
import { PostProvider } from './contexts/PostContext'
import { CommentProvider } from './contexts/CommentContext'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'
import EditorPage from './pages/EditorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'editor', element: <EditorPage /> },
      { path: 'editor/:id', element: <EditorPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PostProvider>
        <CommentProvider>
          <RouterProvider router={router} />
        </CommentProvider>
      </PostProvider>
    </ThemeProvider>
  </React.StrictMode>,
)