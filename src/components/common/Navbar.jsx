import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: 'Inicio', to: '/' },
    { label: 'Características', href: '#features' },
    { label: 'Mapa en Vivo', to: '/admin/map' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-primary-bg)]/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all group-hover:bg-primary/20">
              <Shield className="text-primary" style={{ width: '20px', height: '20px' }} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-text-primary">
              Urban<span className="text-primary">Shield</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link, i) =>
              link.to ? (
                <NavLink
                  key={i}
                  to={link.to}
                  className={({ isActive }) => `px-4 py-2 text-sm rounded-lg transition-all duration-150 ${
                    isActive ? 'text-primary bg-primary/8 font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                  }`}
                >
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={i}
                  href={link.href}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-hover rounded-lg transition-all duration-150"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Iniciar Sesión</Button></Link>
            <Link to="/register"><Button variant="primary" size="sm">Registrarse</Button></Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-[var(--color-primary-bg)] animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.to || link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-text-secondary hover:text-primary hover:bg-hover rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full" size="sm">Iniciar Sesión</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full" size="sm">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
