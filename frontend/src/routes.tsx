import React, { Suspense } from 'react';
import { getPosts, getPostById } from './api/posts';

import Layout from './components/common/Layout';
import AdminLayout from './components/common/AdminLayout';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const PostDetailPage = React.lazy(() => import('./pages/PostDetailPage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));
const PostManagementPage = React.lazy(() => import('./pages/admin/PostManagementPage'));
const CommentManagementPage = React.lazy(() => import('./pages/admin/CommentManagementPage'));
const UserManagementPage = React.lazy(() => import('./pages/admin/UserManagementPage'));
const SettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>,
        loader: async () => {
          const posts = await getPosts();
          return { posts };
        },
      },
      {
        path: 'posts/:id',
        element: <Suspense fallback={<div>Loading...</div>}><PostDetailPage /></Suspense>,
        loader: async ({ params }) => {
          const post = await getPostById(params.id as string);
          return { post };
        },
      },
      { path: 'editor', element: <Suspense fallback={<div>Loading...</div>}><EditorPage /></Suspense> },
      { path: 'editor/:id', element: <Suspense fallback={<div>Loading...</div>}><EditorPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<div>Loading...</div>}><ProfilePage /></Suspense> },
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Suspense fallback={<div>Loading...</div>}><DashboardPage /></Suspense> },
      { path: 'posts', element: <Suspense fallback={<div>Loading...</div>}><PostManagementPage /></Suspense> },
      { path: 'comments', element: <Suspense fallback={<div>Loading...</div>}><CommentManagementPage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<div>Loading...</div>}><UserManagementPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<div>Loading...</div>}><SettingsPage /></Suspense> },
    ]
  }
];