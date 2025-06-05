import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isDarkMode = useStore(state => state.isDarkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);
  const isSidebarOpen = useStore(state => state.isSidebarOpen);
  const toggleSidebar = useStore(state => state.toggleSidebar);

  // Navigation principale
  const mainNavigation = [
    { name: 'Accueil', path: '/' },
    { name: 'Artistes', path: '/artists' },
    { name: 'Production', path: '/production' },
    { name: 'Planning', path: '/timetable' },
    { name: 'Hospitalité', path: '/hospitality' },
    { name: 'Administration', path: '/admin' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 z-20 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <span className={`text-primary-600 font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>
              GO-PROD
            </span>
            {!isSidebarOpen && (
              <span className="text-primary-600 font-bold text-xl">GP</span>
            )}
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {mainNavigation.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
                {!isSidebarOpen && <span>{item.name.charAt(0)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom sidebar actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <span>Réduire</span>
            ) : (
              <span>≡</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md h-16 fixed top-0 right-0 left-0 z-10 flex items-center justify-between px-4">
          <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`} />
          
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={toggleDarkMode}
              aria-label="Changer de thème"
            >
              {isDarkMode ? (
                <span>☀️</span>
              ) : (
                <span>🌙</span>
              )}
            </button>

            {/* User profile */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center p-1"
                aria-label="Menu utilisateur"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                  U
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="pt-16 p-4 h-full overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout; 