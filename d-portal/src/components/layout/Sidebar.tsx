// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Megaphone,
  X,
  FileText
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin', 'manager', 'member']
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      path: '/tasks',
      roles: ['admin', 'manager', 'member']
    },
    {
      name: 'Team',
      icon: Users,
      path: '/team',
      roles: ['admin', 'manager', 'member']
    },
    {
      name: 'Chat',
      icon: MessageSquare,
      path: '/chat',
      roles: ['admin', 'manager', 'member']
    },
    {
      name: 'Attendance',
      icon: Calendar,
      path: '/attendance',
      roles: ['admin', 'manager', 'member']
    },
    {
      name: 'Performance',
      icon: TrendingUp,
      path: '/performance',
      roles: ['admin', 'manager', 'member']
    },
    {
      name: 'Announcements',
      icon: Megaphone,
      path: '/announcements',
      roles: ['admin', 'manager', 'member']
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'member')
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">DISHA Portal</h1>
              <p className="text-xs text-gray-500">Team Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* User Info Card */}
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Logged in as</p>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
