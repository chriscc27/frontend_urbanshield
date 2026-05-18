import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, LogOut, X } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ links, isOpen, setIsOpen }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => setIsOpen(false)}
      />
    )}

    {/* Sidebar panel — dark forest green */}
    <aside className={clsx(
      "fixed top-0 left-0 h-full w-64 z-50 flex flex-col",
      "transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      "surface-sidebar"
    )}>
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)' }}
      />

      {/* Logo */}
      <div className="relative h-16 flex items-center justify-between px-5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center transition-all group-hover:bg-white/25">
            <Shield className="text-white" style={{ width: '18px', height: '18px' }} />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white">
            Urban<span className="text-accent-light">Shield</span>
          </span>
        </Link>
        <button
          className="lg:hidden p-1.5 rounded-lg text-sidebar-muted hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto py-5 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: 'rgba(159, 186, 175, 0.8)' }}>
          Navegación
        </p>
        <ul className="space-y-0.5">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.exact}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                  isActive
                    ? "nav-active"
                    : "text-sidebar-muted hover:bg-white/10 hover:text-white"
                )}
              >
                <link.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom user card */}
      <div className="relative px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">JP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Juan Pérez</p>
            <p className="text-[10px]" style={{ color: 'rgba(159,186,175,0.8)' }}>Ciudadano Activo</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
          style={{ color: 'rgba(231,111,81,0.9)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(231,111,81,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  </>
);

export default Sidebar;
