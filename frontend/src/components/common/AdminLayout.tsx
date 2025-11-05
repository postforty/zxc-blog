
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin</h2>
        </div>
        <nav className="flex-1">
          <ul>
            <li><NavLink to="/admin" end className="block p-4 hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</NavLink></li>
            <li><NavLink to="/admin/posts" className="block p-4 hover:bg-gray-200 dark:hover:bg-gray-700">Posts</NavLink></li>
            <li><NavLink to="/admin/comments" className="block p-4 hover:bg-gray-200 dark:hover:bg-gray-700">Comments</NavLink></li>
            <li><NavLink to="/admin/users" className="block p-4 hover:bg-gray-200 dark:hover:bg-gray-700">Users</NavLink></li>
            <li><NavLink to="/admin/settings" className="block p-4 hover:bg-gray-200 dark:hover:bg-gray-700">Settings</NavLink></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink to="/" className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Home className="h-4 w-4" />
            Go to Blog
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
