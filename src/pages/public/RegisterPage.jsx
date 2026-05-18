import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, Phone, Eye, EyeOff, Check } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { navigate('/dashboard'); }, 1200);
  };

  const benefits = [
    'Reporta incidentes desde tu teléfono',
    'Recibe alertas de emergencias cercanas',
    'Monitorea el estado de tus reportes',
    'Contribuye a una ciudad más segura',
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">

      {/* ─── Left: Benefits panel ──────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2F5D50 0%, #3A7060 60%, #4C9F70 100%)' }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Urban<span className="text-accent-light">Shield</span></span>
          </div>

          <h2 className="text-4xl font-bold text-white font-display leading-tight mb-6">
            Únete a la red<br />de seguridad<br />
            <span style={{ color: '#D6A663' }}>ciudadana.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm mb-10">
            Más de 12,000 ciudadanos activos ayudando a construir comunidades más seguras.
          </p>

          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-white/80 text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-4 rounded-xl backdrop-blur" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p className="text-xs text-white/60 mb-1">Incidente resuelto en</p>
          <p className="text-2xl font-bold font-display" style={{ color: '#D6A663' }}>14 minutos</p>
          <p className="text-xs text-white/50 mt-1">Promedio de respuesta · Última semana</p>
        </div>
      </div>

      {/* ─── Right: Registration Form ───────────────────── */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-primary-bg">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">Urban<span className="text-primary">Shield</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary font-display">Crear una cuenta</h1>
            <p className="text-text-secondary text-sm mt-2">Completa tus datos para comenzar</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Juan Pérez"
                required
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Teléfono"
                type="tel"
                placeholder="+1 234 567 890"
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              required
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contraseña"
                type={showPwd ? 'text' : 'password'}
                placeholder="Mín. 8 caracteres"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="hover:text-primary transition-colors cursor-pointer">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="Repetir contraseña"
                required
                leftIcon={<Lock className="h-4 w-4" />}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-2">
              <input
                type="checkbox"
                required
                className="rounded border-border bg-white checked:bg-primary checked:border-primary focus:ring-primary/25 focus:ring-offset-0 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Acepto los{' '}
                <a href="#" className="text-primary hover:text-primary-dark underline">Términos de Servicio</a>{' '}
                y la{' '}
                <a href="#" className="text-primary hover:text-primary-dark underline">Política de Privacidad</a>.
              </span>
            </label>

            <Button type="submit" className="w-full mt-2 shadow-md shadow-primary/15" size="md" isLoading={isLoading}>
              Crear Cuenta Gratis
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
