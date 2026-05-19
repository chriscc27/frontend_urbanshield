import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, CheckCircle, Activity, Plus, Flame, Waves, Car, ShieldAlert, Construction, Clock, Bell } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { listReports, getNearbyReports } from '../../services/reportsApi';
import { useAsyncData } from '../../hooks/useAsyncData';
import { usePolling } from '../../hooks/usePolling';
import { useAuth } from '../../context/AuthContext';
import { formatReportForList, getStatusBadgeVariant, getCategoryMeta } from '../../utils/reportFormatters';
import AwsLocationMap from '../../components/common/AwsLocationMap';

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
  const { user } = useAuth();

  // Personal reports — used for stats + sidebar list
  const { data, loading, error } = useAsyncData(() => listReports({ limit: 50 }), []);
  const allReports = data?.data || [];
  const recentReports = allReports.slice(0, 4).map(formatReportForList);

  // All nearby reports for the map — polling every 15s, visible to everyone
  const DEFAULT_LAT = -17.7833;
  const DEFAULT_LNG = -63.1821;
  const { data: nearbyData, lastUpdated: mapUpdated } = usePolling(
    () => getNearbyReports({ latitude: DEFAULT_LAT, longitude: DEFAULT_LNG, radiusKm: 50, limit: 100 }),
    [],
    15000,
  );
  const nearbyReports = nearbyData?.data || [];

  const stats = useMemo(() => ({
    total: allReports.length,
    resolved: allReports.filter((r) => r.status === 'resolved').length,
    inProgress: allReports.filter((r) => ['in_progress', 'dispatched'].includes(r.status)).length,
    pending: allReports.filter((r) => r.status === 'pending').length,
  }), [allReports]);

  // Map markers from nearby reports (all users)
  const mapMarkers = nearbyReports
    .filter((report) => report.latitude != null && report.longitude != null)
    .map((report) => {
      const incident = formatReportForList(report);
      return {
        latitude: report.latitude,
        longitude: report.longitude,
        color: incident.statusRaw === 'resolved' ? '#16a34a' : incident.statusRaw === 'in_progress' || incident.statusRaw === 'dispatched' ? '#f59e0b' : '#dc2626',
        popupHtml: `<strong>${incident.title}</strong><br/>${incident.type} — ${incident.location}`,
      };
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {error && <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-text-muted text-sm">Buenos días,</p>
          <h2 className="text-2xl font-bold text-text-primary font-display">{user?.name || 'Ciudadano'} 👋</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <Button variant="secondary" size="sm" leftIcon={<Bell className="h-4 w-4" />} className="relative">
              Alertas
              {stats.pending > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                  {stats.pending > 9 ? '9+' : stats.pending}
                </span>
              )}
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
          { icon: AlertTriangle, label: 'Tus Reportes', value: String(stats.total), color: 'text-primary', bg: 'bg-primary/8 border-primary/15' },
          { icon: CheckCircle, label: 'Resueltos', value: String(stats.resolved), color: 'text-success', bg: 'bg-success/8 border-success/15' },
          { icon: Activity, label: 'En Progreso', value: String(stats.inProgress), color: 'text-warning', bg: 'bg-warning/8 border-warning/15' },
          { icon: MapPin, label: 'Pendientes', value: String(stats.pending), color: 'text-danger', bg: 'bg-danger/8 border-danger/15' },
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
                  <span className="h-2 w-2 rounded-full bg-danger animate-pulse-subtle" />
                  En vivo
                  {mapUpdated && (
                    <span className="text-text-muted font-normal">
                      · {mapUpdated.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </span>
              </div>
            </CardHeader>
            <div className="relative min-h-[380px] overflow-hidden map-placeholder">
              <div className="absolute inset-0 z-0">
                <AwsLocationMap
                  className="absolute inset-0"
                  center={[-63.18, -17.78]}
                  zoom={12}
                  markers={mapMarkers}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="flex-1">
            <CardHeader><CardTitle>Tus Reportes Recientes</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-4">
              {loading && <p className="text-sm text-text-muted px-2">Cargando reportes...</p>}
              {!loading && recentReports.length === 0 && (
                <p className="text-sm text-text-muted px-2">Aún no tienes reportes registrados.</p>
              )}
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
              {recentReports.length === 0 ? (
                <p className="px-5 py-4 text-sm text-text-muted">Sin actividad reciente.</p>
              ) : (
                recentReports.map((act, i) => (
                  <div
                    key={act.id}
                    className={`px-5 py-3 flex items-center gap-3 ${i < recentReports.length - 1 ? 'border-b border-border-light' : ''}`}
                  >
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${act.status === 'Resuelto' ? 'bg-success' : 'bg-danger'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{act.title}</p>
                      <p className="text-xs text-text-muted">{act.date}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;

