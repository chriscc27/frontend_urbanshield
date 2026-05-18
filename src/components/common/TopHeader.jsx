import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopHeader = ({ onMenuClick, title }) => (
  <header className="h-14 flex-shrink-0 surface-header flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
    {/* Left */}
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

    {/* Right */}
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <Link
        to="/notifications"
        className="relative p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-hover transition-colors"
      >
        <Bell style={{ width: '18px', height: '18px' }} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full border-2 border-white" />
      </Link>

      {/* User chip */}
      <Link
        to="/profile"
        className="flex items-center gap-2.5 pl-3 pr-2.5 py-1.5 rounded-xl border border-border hover:border-border-strong hover:bg-hover transition-all duration-150 cursor-pointer"
      >
        <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">JP</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-text-primary leading-none">Juan Pérez</p>
          <p className="text-[10px] text-text-muted mt-0.5">Ciudadano</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden sm:block" />
      </Link>
    </div>
  </header>
);

export default TopHeader;
