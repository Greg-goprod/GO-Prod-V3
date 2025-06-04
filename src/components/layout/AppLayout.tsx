import React, { useState, useCallback, memo, ReactElement } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { EventSelector } from '../common/EventSelector';
import {
  Home, Users, Clock, Wrench, Briefcase, Car, Calendar, Coffee,
  Hotel, Navigation, UserCheck, FileText, DollarSign, ShoppingCart,
  Newspaper, Scale, Contact, Settings, Menu, X, Moon, Sun,
  ChevronDown, ChevronRight, LayoutGrid, Timer, Building, PartyPopper
} from 'lucide-react';
import clsx from 'clsx';

interface NavItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  depth?: number;
  isMainItem?: boolean;
  isBold?: boolean;
}

const NavItem: React.FC<NavItemProps> = memo(({
  to,
  icon,
  label,
  onClick,
  children,
  depth = 0,
  isMainItem = false,
  isBold = false
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const handleToggle = useCallback(() => {
    setIsOpen((prevOpen: boolean) => !prevOpen);
  }, []);

  if (children) {
    return (
      <div className="space-y-1">
        <button
          className={clsx(
            'flex items-center w-full rounded-md transition-colors',
            isMainItem ? 'font-bold uppercase text-[0.95rem]' : 'font-light text-[0.875rem]',
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700',
            depth === 0 ? 'px-3 py-2' : 'px-2 py-1.5'
          )}
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center min-w-0">
              {icon && <span className={clsx('flex-shrink-0', depth === 0 ? 'w-5 h-5' : 'w-4 h-4')}>{icon}</span>}
              <span className={clsx('ml-3 truncate', isBold && 'font-bold')}>{label}</span>
            </div>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </button>
        {isOpen && (
          <div className={clsx(
            'space-y-1',
            depth === 0 ? 'ml-4 pl-4 border-l border-gray-200 dark:border-dark-600' : 'ml-3'
          )}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as ReactElement<NavItemProps>, {
                  depth: depth + 1
                });
              }
              return child;
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to || '#'}
      className={({ isActive }: { isActive: boolean }) => clsx(
        'flex items-center rounded-md transition-colors',
        isMainItem ? 'font-bold uppercase text-[0.95rem]' : 'font-light text-[0.875rem]',
        depth === 0 ? 'px-3 py-2' : 'px-2 py-1.5',
        isActive
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700'
      )}
      onClick={onClick}
    >
      <div className="flex items-center min-w-0">
        {icon && <span className={clsx('flex-shrink-0', depth === 0 ? 'w-5 h-5' : 'w-4 h-4')}>{icon}</span>}
        <span className={clsx('ml-3 truncate', isBold && 'font-bold')}>{label}</span>
      </div>
    </NavLink>
  );
});

NavItem.displayName = 'NavItem';

export const AppLayout: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev: boolean) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className={clsx(
      'flex h-screen',
      'bg-gray-50 dark:bg-dark-900',
      'text-gray-800 dark:text-white'
    )}>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          'bg-white dark:bg-dark-800',
          'border-r border-gray-200 dark:border-dark-700',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-dark-700">
            <NavLink to="/" className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Go-Ground</span>
            </NavLink>
            <button
              className="p-1 ml-auto rounded-md lg:hidden"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-white" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavItem
              to="/"
              icon={<Home size={20} />}
              label="ACCUEIL"
              isMainItem
            />

            <NavItem
              icon={<Users size={20} />}
              label="ARTISTES"
              isMainItem
            >
              <NavItem
                to="/artists"
                icon={<Users size={16} />}
                label="Artistes"
                isBold
              />
              <NavItem
                to="/lineup"
                icon={<LayoutGrid size={16} />}
                label="Line-up"
                isBold
              />
            </NavItem>

            <NavItem
              icon={<Briefcase size={20} />}
              label="PRODUCTION"
              isMainItem
            >
              <NavItem
                to="/timetable"
                icon={<Timer size={16} />}
                label="Timetable"
                isBold
              />
              <NavItem
                to="/technique"
                icon={<Wrench size={16} />}
                label="Technique"
                isBold
              />

              <NavItem
                icon={<Building size={16} />}
                label="Ground"
                isBold
              >
                <NavItem
                  to="/missions"
                  icon={<Briefcase size={16} />}
                  label="Missions"
                />
                <NavItem
                  to="/drivers"
                  icon={<UserCheck size={16} />}
                  label="Chauffeurs"
                />
                <NavItem
                  to="/vehicles"
                  icon={<Car size={16} />}
                  label="Véhicules"
                />
                <NavItem
                  to="/shifts"
                  icon={<Calendar size={16} />}
                  label="Horaires"
                />
              </NavItem>

              <NavItem
                icon={<Coffee size={16} />}
                label="Hospitality"
                isBold
              >
                <NavItem
                  to="/backstage"
                  icon={<Users size={16} />}
                  label="Backstage"
                />
                <NavItem
                  to="/catering"
                  icon={<Coffee size={16} />}
                  label="Catering"
                />
                <NavItem
                  to="/hotels"
                  icon={<Hotel size={16} />}
                  label="Hôtels"
                />
              </NavItem>

              <NavItem
                to="/travels"
                icon={<Navigation size={16} />}
                label="Voyages"
                isBold
              />
              <NavItem
                to="/partycrew"
                icon={<PartyPopper size={16} />}
                label="Party Crew"
                isBold
              />
            </NavItem>

            <NavItem
              icon={<FileText size={20} />}
              label="ADMINISTRATION"
              isMainItem
            >
              <NavItem
                to="/booking"
                icon={<FileText size={16} />}
                label="Booking"
                isBold
              />
              <NavItem
                to="/contracts"
                icon={<FileText size={16} />}
                label="Contrats"
                isBold
              />
              <NavItem
                to="/finances"
                icon={<DollarSign size={16} />}
                label="Finances"
                isBold
              />
              <NavItem
                to="/sales"
                icon={<ShoppingCart size={16} />}
                label="Ventes"
                isBold
              />
            </NavItem>

            <NavItem
              to="/press"
              icon={<Newspaper size={20} />}
              label="PRESSE"
              isMainItem
            />

            <NavItem
              to="/rights"
              icon={<Scale size={20} />}
              label="DROITS"
              isMainItem
            />

            <NavItem
              to="/contacts"
              icon={<Contact size={20} />}
              label="CONTACTS"
              isMainItem
            />

            <NavItem
              to="/settings"
              icon={<Settings size={20} />}
              label="PARAMÈTRES"
              isMainItem
            />
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <button
              className="flex items-center justify-center w-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-md transition-colors"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {isDarkMode ? (
                <>
                  <Sun size={18} className="mr-2" />
                  <span className="text-[0.875rem] font-medium">Mode clair</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="mr-2" />
                  <span className="text-[0.875rem] font-medium">Mode sombre</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 px-6 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-dark-700"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-white" />
            </button>
            <EventSelector />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};