import React from 'react';
import { AlertTriangle, Activity, CheckCircle, Clock, TrendingUp, Users, Flame, ShieldAlert, Waves, Car, Construction } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { INCIDENTS, EMERGENCY_STATS, RECENT_ACTIVITY } from '../../data/mockData';
import Badge from '../../components/ui/Badge';

const getStatusBadge = (status) => {
  switch (status) {
    case 'En Progreso': return <Badge variant="warning" dot>{status}</Badge>;
    case 'Resuelto':    return <Badge variant="success" dot>{status}</Badge>;
    case 'Pendiente':   return <Badge variant="danger" dot>{status}</Badge>;
    case 'Despachado':  return <Badge variant="accent" dot>{status}</Badge>;
    default:            return <Badge dot>{status}</Badge>;
  }
};

const AdminDashboard = () => {
  const chartBars = [30, 45, 20, 60, 85, 40, 55, 75, 90, 65, 50, 40];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display">Dashboard Analítico</h2>
          <p className="text-text-muted text-sm">Visión general del estado de emergencias · Actualizado hace 2 min</p>
        </div>
        <Link to="/admin/map">
          <button className="flex items-center gap-2 px-4 py-2 bg-danger/8 border border-danger/20 rounded-xl text-danger text-sm font-medium hover:bg-danger/12 transition-colors">
            <span className="h-2 w-2 bg-danger rounded-full animate-pulse-subtle" />
            Ver Mapa en Vivo
          </button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Incidentes Activos',    value: EMERGENCY_STATS.activeIncidents, change: '+12%', icon: AlertTriangle, color: 'text-danger',  bg: 'bg-danger/8 border-danger/15' },
          { label: 'Tiempo Resp. Promedio', value: EMERGENCY_STATS.avgResponseTime, change: '-2min', icon: Clock,         color: 'text-warning', bg: 'bg-warning/8 border-warning/15' },
          { label: 'Resueltos Hoy',         value: EMERGENCY_STATS.resolvedToday,   change: '+5%',  icon: CheckCircle,   color: 'text-success', bg: 'bg-success/8 border-success/15' },
          { label: 'Unidades Desplegadas',  value: `${EMERGENCY_STATS.deployedUnits}/${EMERGENCY_STATS.totalUnits}`, change: 'Activas', icon: Users, color: 'text-primary', bg: 'bg-primary/8 border-primary/15' },
        ].map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.04]">
              <kpi.icon className="h-24 w-24 text-text-primary" />
            </div>
            <CardContent className="p-5 relative z-10">
              <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">{kpi.label}</p>
              <p className={`text-3xl font-bold font-display ${kpi.color}`}>{kpi.value}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${kpi.color}`}>
                <TrendingUp className="h-3 w-3" />
                {kpi.change}
              </div>
              {/* Color accent strip */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 border-b ${kpi.bg}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Tendencia de Incidentes por Hora</CardTitle>
                  <p className="text-xs text-text-muted mt-1">Últimas 24 horas</p>
                </div>
                <select className="text-xs bg-muted border border-border-light rounded-lg px-2 py-1 text-text-secondary outline-none focus:ring-1 focus:ring-primary/30">
                  <option>Hoy</option><option>Esta semana</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-text-muted pr-2">
                  {[100, 75, 50, 25, 0].map(v => <span key={v}>{v}</span>)}
                </div>
                <div className="ml-8 flex items-end justify-between gap-1.5 h-52 border-b border-l border-border pt-2 px-2">
                  {chartBars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                      <div
                        className="w-full rounded-t-sm transition-all duration-200 group-hover:brightness-110 cursor-pointer"
                        style={{
                          height: `${h}%`,
                          background: h > 70 ? '#E76F51' : h > 50 ? '#DDA15E' : '#4C9F70',
                          opacity: 0.8
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white border border-text-primary/10 text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-medium">
                          {h} inc.
                        </div>
                      </div>
                      <span className="text-[10px] text-text-muted text-center mt-1">{i * 2}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zones */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader><CardTitle>Zonas Críticas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { zone: 'Centro Histórico', count: 18, level: 'Crítico', color: 'text-danger', bg: 'bg-danger/8', bar: 90 },
                { zone: 'Zona Sur — Comercial', count: 12, level: 'Crítico', color: 'text-danger', bg: 'bg-danger/8', bar: 60 },
                { zone: 'Barrio Norte', count: 8, level: 'Moderado', color: 'text-warning', bg: 'bg-warning/8', bar: 40 },
                { zone: 'Av. Circunvalación', count: 7, level: 'Moderado', color: 'text-warning', bg: 'bg-warning/8', bar: 35 },
                { zone: 'Distrito Este', count: 3, level: 'Estable', color: 'text-success', bg: 'bg-success/8', bar: 15 },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl border border-border-light hover:border-border hover:bg-hover transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-text-primary">{item.zone}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>{item.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary-bg rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color === 'text-danger' ? 'bg-danger' : item.color === 'text-success' ? 'bg-success' : 'bg-warning'}`}
                        style={{ width: `${item.bar}%` }} />
                    </div>
                    <span className="text-xs text-text-muted font-medium">{item.count} inc.</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Incidentes Prioritarios</CardTitle>
                <Link to="/admin/reports" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">Ver todos →</Link>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/60 text-xs uppercase tracking-wider font-semibold text-text-muted border-b border-border-light">
                    <th className="p-3 pl-5 text-left">ID / Tipo</th>
                    <th className="p-3 text-left hidden sm:table-cell">Ubicación</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 pr-5 text-right hidden md:table-cell">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {INCIDENTS.slice(0, 5).map((inc) => (
                    <tr key={inc.id} className="hover:bg-hover transition-colors">
                      <td className="p-3 pl-5">
                        <p className="font-mono text-xs font-bold text-text-muted">{inc.id}</p>
                        <p className="font-semibold text-text-primary text-sm">{inc.type}</p>
                      </td>
                      <td className="p-3 text-sm text-text-secondary hidden sm:table-cell max-w-[180px] truncate">{inc.location}</td>
                      <td className="p-3">{getStatusBadge(inc.status)}</td>
                      <td className="p-3 pr-5 text-xs text-text-muted text-right hidden md:table-cell">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(inc.date).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Por Categoría</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { icon: Flame,        label: 'Incendio',       count: 8,  color: 'text-danger',   bar: 'bg-danger' },
                { icon: Waves,        label: 'Inundación',     count: 5,  color: 'text-blue-500', bar: 'bg-blue-400' },
                { icon: ShieldAlert,  label: 'Delito',         count: 14, color: 'text-purple-500',bar: 'bg-purple-400' },
                { icon: Car,          label: 'Accidente',      count: 11, color: 'text-warning',  bar: 'bg-warning' },
                { icon: Construction, label: 'Infraestructura',count: 4,  color: 'text-primary',  bar: 'bg-primary' },
              ].map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <cat.icon className={`h-4 w-4 flex-shrink-0 ${cat.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-primary font-medium">{cat.label}</span>
                      <span className="text-text-muted">{cat.count}</span>
                    </div>
                    <div className="h-1.5 bg-secondary-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.bar}`} style={{ width: `${(cat.count / 14) * 100}%`, opacity: 0.75 }} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-danger animate-pulse-subtle" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {RECENT_ACTIVITY.slice(0, 4).map((act, i) => (
                <div key={act.id} className={`px-5 py-3 flex items-center gap-3 ${i < 3 ? 'border-b border-border-light' : ''}`}>
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${act.type === 'danger' ? 'bg-danger' : act.type === 'success' ? 'bg-success' : 'bg-warning'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary truncate">{act.text}</p>
                    <p className="text-[10px] text-text-muted">{act.time}</p>
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

export default AdminDashboard;
