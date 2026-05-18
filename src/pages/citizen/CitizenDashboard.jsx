import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, CheckCircle, Activity, Plus, Flame, Waves, Car, ShieldAlert, Construction, Clock, Bell } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { INCIDENTS, RECENT_ACTIVITY } from '../../data/mockData';

const categoryIconMap = {
  'Incendio':         { icon: Flame,        color: 'text-danger',     bg: 'bg-danger/8 border-danger/15' },
  'Inundación':       { icon: Waves,        color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-100' },
  'Delito':           { icon: ShieldAlert,  color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
  'Accidente':        { icon: Car,          color: 'text-warning',    bg: 'bg-warning/8 border-warning/15' },
  'Bloqueo vial':     { icon: Construction, color: 'text-accent-dark',bg: 'bg-accent/8 border-accent/15' },
  'Infraestructura urbana': { icon: Activity, color: 'text-primary',  bg: 'bg-primary/8 border-primary/15' },
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'En Progreso': return <Badge variant="warning" dot>{status}</Badge>;
    case 'Resuelto':    return <Badge variant="success" dot>{status}</Badge>;
    case 'Pendiente':   return <Badge variant="danger" dot>{status}</Badge>;
    case 'Despachado':  return <Badge variant="accent" dot>{status}</Badge>;
    default:            return <Badge dot>{status}</Badge>;
  }
};

const CitizenDashboard = () => {
  const recentReports = INCIDENTS.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-text-muted text-sm">Buenos días,</p>
          <h2 className="text-2xl font-bold text-text-primary font-display">Juan Pérez 👋</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <Button variant="secondary" size="sm" leftIcon={<Bell className="h-4 w-4" />} className="relative">
              Alertas
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
            </Button>
          </Link>
          <Link to="/report/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Nuevo Reporte</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: AlertTriangle, label: 'Tus Reportes',    value: '12', color: 'text-primary',   bg: 'bg-primary/8 border-primary/15' },
          { icon: CheckCircle,   label: 'Resueltos',       value: '8',  color: 'text-success',   bg: 'bg-success/8 border-success/15' },
          { icon: Activity,      label: 'En Progreso',     value: '3',  color: 'text-warning',   bg: 'bg-warning/8 border-warning/15' },
          { icon: MapPin,        label: 'Alertas Cercanas',value: '2',  color: 'text-danger',    bg: 'bg-danger/8 border-danger/15' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-xl border ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary font-display">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Widget */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Mapa de Incidentes en tu Zona</CardTitle>
                <span className="flex items-center gap-2 text-xs text-danger font-medium">
                  <span className="h-2 w-2 rounded-full bg-danger animate-pulse-subtle" />En vivo
                </span>
              </div>
            </CardHeader>
            <div className="relative min-h-[380px] map-placeholder">
              {/* Roads */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-border/80" />
              <div className="absolute top-0 bottom-0 left-1/3 w-px bg-border/80" />

              {/* User Location */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-5 rounded-full bg-primary/10 animate-ping" />
                  <div className="h-5 w-5 bg-primary rounded-full border-2 border-white shadow-lg relative z-10" />
                </div>
              </div>

              {/* Markers */}
              <div className="absolute top-[25%] left-[28%] h-4 w-4 bg-danger rounded-full border-2 border-white shadow-md" />
              <div className="absolute bottom-[30%] right-[25%] h-4 w-4 bg-warning rounded-full border-2 border-white shadow-md" />
              <div className="absolute top-[60%] right-[40%] h-4 w-4 bg-primary rounded-full border-2 border-white shadow-md" />

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-border rounded-xl p-3 shadow-sm">
                {[
                  { c: 'bg-primary', l: 'Tu ubicación' },
                  { c: 'bg-danger', l: 'Incidente Crítico' },
                  { c: 'bg-warning', l: 'En progreso' },
                ].map((leg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary mb-1 last:mb-0">
                    <div className={`h-2.5 w-2.5 rounded-full ${leg.c}`} />
                    {leg.l}
                  </div>
                ))}
              </div>

              {/* Zoom */}
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {['+', '−'].map((z, i) => (
                  <div key={i} className="h-8 w-8 bg-white border border-border rounded-lg flex items-center justify-center text-text-primary text-sm font-bold cursor-pointer hover:bg-hover transition-colors shadow-sm">{z}</div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="flex-1">
            <CardHeader><CardTitle>Tus Reportes Recientes</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-4">
              {recentReports.map((incident) => {
                const config = categoryIconMap[incident.type] || { icon: Activity, color: 'text-text-muted', bg: 'bg-muted border-border' };
                const Icon = config.icon;
                return (
                  <Link to={`/reports/${incident.id}`} key={incident.id}>
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-hover transition-colors border border-transparent hover:border-border-light cursor-pointer">
                      <div className={`h-9 w-9 rounded-xl border ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="text-sm font-semibold text-text-primary truncate">{incident.type}</p>
                          {getStatusBadge(incident.status)}
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 flex-shrink-0" />{incident.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link to="/reports">
                <Button variant="ghost" className="w-full mt-2 text-sm text-primary hover:text-primary-dark">Ver todos mis reportes →</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-danger animate-pulse-subtle" />
                Actividad en la Ciudad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {RECENT_ACTIVITY.map((act, i) => (
                <div key={act.id} className={`px-5 py-3 flex items-center gap-3 ${i < RECENT_ACTIVITY.length - 1 ? 'border-b border-border-light' : ''}`}>
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${act.type === 'danger' ? 'bg-danger' : act.type === 'success' ? 'bg-success' : 'bg-warning'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary truncate">{act.text}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
