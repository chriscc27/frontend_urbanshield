import React from 'react';
import { Menu, Bell, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const TopHeader = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'US';

  const roleLabel = user?.role === 'admin' ? 'Administrador' : 'Ciudadano';
  const profilePath = user?.role === 'admin' ? '/admin/profile' : '/profile';
  const notificationsPath = user?.role === 'admin' ? '/admin/notifications' : '/notifications';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-14 flex-shrink-0 surface-header flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover transition-colors"
        >
          <Menu style={{ width: '20px', height: '20px' }} />
        </button>
        {title && (
          <h1 className="text-sm font-semibold text-text-primary font-display hidden sm:block tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={notificationsPath}
          className="relative p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-hover transition-colors"
        >
          <Bell style={{ width: '18px', height: '18px' }} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-pulse-subtle">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <Link
          to={profilePath}
          className="flex items-center gap-2.5 pl-3 pr-2.5 py-1.5 rounded-xl border border-border hover:border-border-strong hover:bg-hover transition-all duration-150 cursor-pointer"
        >
          <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-text-primary leading-none">{user?.name || 'Usuario'}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{roleLabel}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden sm:block" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut style={{ width: '18px', height: '18px' }} />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
