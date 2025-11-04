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
import ProfilePage from './pages/ProfilePage'
import AdminLayout from './components/common/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import PostManagementPage from './pages/admin/PostManagementPage'
import CommentManagementPage from './pages/admin/CommentManagementPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import SettingsPage from './pages/admin/SettingsPage'

import { AuthProvider } from './contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'editor', element: <EditorPage /> },
      { path: 'editor/:id', element: <EditorPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'posts', element: <PostManagementPage /> },
      { path: 'comments', element: <CommentManagementPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <PostProvider>
          <CommentProvider>
            <RouterProvider router={router} />
          </CommentProvider>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)