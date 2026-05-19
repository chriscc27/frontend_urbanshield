import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth, getApiErrorMessage } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [showPwd, setShowPwd] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({ email: '', password: '' });

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const loggedUser = await login(form);
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') navigate(from, { replace: true });
      else navigate(loggedUser.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">

      {/* ── Left Brand Panel ───────────────────────────────── */}
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
            Tu ciudad,<br />más segura<br />
            <span style={{ color: '#D6A663' }}>y conectada.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Plataforma inteligente de gestión de emergencias urbanas.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '2.4k', label: 'Resueltos' },
            { value: '14min', label: 'Respuesta' },
            { value: '98%', label: 'Precisión GPS' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
              <p className="text-xs text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form ─────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-primary-bg">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">Urban<span className="text-primary">Shield</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary font-display">Bienvenido de nuevo</h1>
            <p className="text-text-secondary text-sm mt-2">Ingresa a tu cuenta para continuar</p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input name="email" value={form.email} onChange={handleChange} label="Correo Electrónico" type="email" placeholder="tu@email.com" required leftIcon={<Mail className="h-4 w-4" />} />
            <Input
              name="password"
              value={form.password}
              onChange={handleChange}
              label="Contraseña"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPwd(v => !v)} className="hover:text-primary transition-colors cursor-pointer">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/30 focus:ring-offset-0" />
                <span className="text-text-secondary">Recordarme</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-dark transition-colors text-sm">¿Olvidaste tu contraseña?</a>
            </div>

            <Button type="submit" className="w-full mt-2 shadow-md shadow-primary/15" size="md" isLoading={isLoading} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Iniciar Sesión
            </Button>
          </form>

          
<p className="mt-8 text-center text-sm text-text-secondary">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
