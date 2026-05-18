import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Map as MapIcon, Activity, ChevronRight, Flame, Waves, Car, ShieldAlert, Construction, Quote, Radio } from 'lucide-react';
import Button from '../../components/ui/Button';
import { TESTIMONIALS } from '../../data/mockData';

const liveIncidents = [
  { type: 'Incendio', icon: Flame, location: 'Mercado Central, Zona 1', time: 'Hace 2 min', status: 'Crítico', color: 'text-danger', bg: 'bg-danger/8', border: 'border-danger/15' },
  { type: 'Accidente', icon: Car, location: 'Av. Circunvalación km 5', time: 'Hace 8 min', status: 'En atención', color: 'text-warning', bg: 'bg-warning/8', border: 'border-warning/15' },
  { type: 'Inundación', icon: Waves, location: 'Barrio Norte, Calle 4', time: 'Hace 15 min', status: 'Monitoreando', color: 'text-primary', bg: 'bg-primary/8', border: 'border-primary/15' },
  { type: 'Bloqueo Vial', icon: Construction, location: 'Plaza Central Norte', time: 'Hace 22 min', status: 'En progreso', color: 'text-accent', bg: 'bg-accent/8', border: 'border-accent/15' },
];

const LandingPage = () => (
  <div className="flex flex-col min-h-screen bg-primary-bg">

    {/* ── Hero ───────────────────────────────────────────────── */}
    <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Soft background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Live badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Sistema Activo — 42 Incidentes Monitoreados
        </span>

        <h1 className="text-5xl md:text-7xl font-bold font-display text-text-primary tracking-tight leading-[1.1] mb-6">
          La Ciudad Protegida,<br className="hidden md:block" />
          <span className="text-gradient">Inteligente y Conectada</span>
        </h1>

        <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
          UrbanShield conecta ciudadanos y autoridades para reportar, monitorear y resolver emergencias urbanas en tiempo real.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link to="/register">
            <Button size="lg" rightIcon={<ChevronRight className="h-5 w-5" />} className="text-base px-8 shadow-lg shadow-primary/20">
              Reportar una Emergencia
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="secondary" size="lg" className="text-base px-8">
              Panel de Autoridades
            </Button>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border shadow-sm">
          {[
            { value: '2.4k+', label: 'Reportes Resueltos' },
            { value: '14min', label: 'Tiempo Respuesta Prom.' },
            { value: '120+', label: 'Zonas Monitoreadas' },
            { value: '98%', label: 'Precisión Geográfica' },
          ].map((stat, i) => (
            <div key={i} className="bg-white px-6 py-4 text-center">
              <p className="text-2xl font-bold text-primary font-display">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Live Incidents ─────────────────────────────────────── */}
    <section className="py-16 bg-secondary-bg border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-danger animate-pulse-subtle" />
            <h2 className="text-xl font-bold text-text-primary font-display">Incidentes en Tiempo Real</h2>
          </div>
          <Link to="/login" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveIncidents.map((inc, i) => {
            const Icon = inc.icon;
            return (
              <div key={i} className={`bg-white border ${inc.border} rounded-2xl p-4 hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 cursor-pointer`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-9 w-9 rounded-xl ${inc.bg} border ${inc.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${inc.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{inc.type}</p>
                    <p className="text-xs text-text-muted">{inc.time}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-3">{inc.location}</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${inc.bg} ${inc.color} border ${inc.border}`}>
                  {inc.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Features ───────────────────────────────────────────── */}
    <section id="features" className="py-28 bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Capacidades</span>
          <h2 className="text-4xl font-bold text-text-primary font-display mt-3">Diseñado para la Respuesta Rápida</h2>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg">
            Herramientas de gestión de emergencias de nivel profesional, accesibles desde cualquier dispositivo.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: AlertTriangle, color: 'text-primary', bg: 'bg-primary/8 border-primary/15', title: 'Reportes Ciudadanos', desc: 'Cualquier ciudadano puede reportar incidentes con fotos, descripción y ubicación GPS precisa en segundos.' },
            { icon: MapIcon, color: 'text-accent-dark', bg: 'bg-accent/8 border-accent/15', title: 'Mapeo GIS Inteligente', desc: 'Visualización interactiva de emergencias con mapas de calor y clústeres para identificar zonas de alto riesgo.' },
            { icon: Activity, color: 'text-danger', bg: 'bg-danger/8 border-danger/15', title: 'Monitoreo en Tiempo Real', desc: 'Panel avanzado para autoridades con actualizaciones en vivo, asignación de recursos y trazabilidad completa.' },
          ].map((f, i) => (
            <div key={i} className={`bg-white rounded-2xl p-8 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>
              <div className={`h-14 w-14 ${f.bg} border rounded-2xl flex items-center justify-center mb-6`}>
                <f.icon className={`h-7 w-7 ${f.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3 font-display">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Map Preview ────────────────────────────────────────── */}
    <section className="py-28 bg-secondary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <span className="text-accent-dark text-sm font-semibold uppercase tracking-widest">Sistema GIS</span>
            <h2 className="text-4xl font-bold text-text-primary font-display mt-3 mb-6">Visualización Táctica de Emergencias</h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Sistema de información geográfica que ofrece una vista clara y accionable de todas las incidencias urbanas.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                { color: 'bg-danger', text: 'Incidentes críticos en tiempo real' },
                { color: 'bg-accent', text: 'Rutas de evacuación y recursos' },
                { color: 'bg-primary', text: 'Zonas seguras preestablecidas' },
                { color: 'bg-warning', text: 'Mapa de calor de actividad' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-text-primary">
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${item.color}`} />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link to="/admin">
              <Button variant="outline" size="lg">Acceder al Panel GIS →</Button>
            </Link>
          </div>

          {/* Map Mock */}
          <div className="lg:w-1/2 w-full order-1 lg:order-2">
            <div className="aspect-[4/3] rounded-2xl border border-border shadow-xl overflow-hidden relative map-placeholder">
              {/* Roads */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-border" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-border/60" />
              <div className="absolute top-0 bottom-0 left-1/3 w-px bg-border" />
              <div className="absolute top-0 bottom-0 right-1/4 w-px bg-border/60" />

              {/* Danger cluster */}
              <div className="absolute top-[30%] left-[35%]">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-danger/10 animate-ping" />
                  <div className="h-6 w-6 bg-danger rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold z-10 relative">3</div>
                </div>
              </div>
              <div className="absolute bottom-[35%] right-[28%] h-4 w-4 bg-primary rounded-full border-2 border-white shadow-md" />
              <div className="absolute top-[55%] right-[38%] h-4 w-4 bg-warning rounded-full border-2 border-white shadow-md" />

              {/* Overlay */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-border rounded-xl p-3 shadow-sm">
                <p className="text-[10px] text-text-muted font-medium">ZONA ACTIVA</p>
                <p className="text-sm font-bold text-text-primary">Zona Centro</p>
                <p className="text-xs text-danger font-medium mt-0.5">● 3 críticos</p>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-border rounded-xl p-3 shadow-sm">
                {[{ c: 'bg-danger', l: 'Crítico' }, { c: 'bg-warning', l: 'Activo' }, { c: 'bg-primary', l: 'Estable' }].map((leg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary mb-1 last:mb-0">
                    <div className={`h-2.5 w-2.5 rounded-full ${leg.c}`} />
                    {leg.l}
                  </div>
                ))}
              </div>

              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {['+', '−'].map((z, i) => (
                  <div key={i} className="h-8 w-8 bg-white border border-border rounded-lg flex items-center justify-center text-text-primary font-bold text-sm cursor-pointer hover:bg-hover transition-colors shadow-sm">
                    {z}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Testimonials ───────────────────────────────────────── */}
    <section className="py-28 bg-primary-bg border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary font-display">Lo que dicen los profesionales</h2>
          <p className="mt-3 text-text-secondary">Testimonios de quienes confían en UrbanShield</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-8 border border-border hover:shadow-md hover:border-primary/20 transition-all duration-150">
              <Quote className="h-8 w-8 text-primary/25 mb-4" />
              <p className="text-text-primary leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ────────────────────────────────────────────────── */}
    <section className="py-28 bg-secondary-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-display mb-6">
          Únete a la red de seguridad ciudadana
        </h2>
        <p className="text-text-secondary text-xl mb-10 max-w-2xl mx-auto">
          Regístrate gratis y comienza a contribuir a una ciudad más segura. Cada reporte marca la diferencia.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="text-base px-10 shadow-lg shadow-primary/20">Crear Cuenta Gratis</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="text-base px-10">Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;
