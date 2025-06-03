import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  ListTodo, 
  PieChart, 
  Menu, 
  X, 
  Clock,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Chamados', href: '/tickets', icon: Ticket },
    { name: 'Tarefas', href: '/tasks', icon: ListTodo },
    { name: 'Relatórios', href: '/reports', icon: PieChart },
    { name: 'Horas', href: '/time', icon: Clock },
    { name: 'Configurações', href: '/settings', icon: Settings }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex bg-black bg-opacity-25" 
             style={{ display: isMobileMenuOpen ? 'flex' : 'none' }}>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />              </button>
            </div>
            <div className="flex flex-shrink-0 items-center px-4">
              <img src="/pwa-192x192.png" alt="TaskTrack" className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold text-blue-600">TaskTrack</h1>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`${
                        isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-4 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <img src="/pwa-192x192.png" alt="TaskTrack" className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold text-blue-600">TaskTrack</h1>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow lg:hidden">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <h1 className="self-center text-xl font-semibold text-blue-600">TaskTrack</h1>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;