import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShieldAlert, Crosshair, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getMapMarkers, searchPlaces } from '../../services/locationApi';
import { usePolling } from '../../hooks/usePolling';
import { formatReportForList } from '../../utils/reportFormatters';
import { getApiErrorMessage } from '../../services/api';
import AwsLocationMap from '../../components/common/AwsLocationMap';

const POLL_MS = 15000;

const AdminMap = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAlertsOpen, setIsAlertsOpen] = useState(true);
  const { data, loading, error, lastUpdated, refetch } = usePolling(() => getMapMarkers(), [], POLL_MS);

  const markers = useMemo(() => {
    const list = Array.isArray(data) ? data : data?.markers || [];
    return list.map((m) => {
      // Backend (location.service.js) returns: { id, latitude, longitude, category, status, priority, title }
      // It might also return a full report if used elsewhere, so we handle both
      const reportId = m.id || m.reportId;
      const lat = m.lat ?? m.latitude;
      const lng = m.lng ?? m.longitude;
      
      return {
        id: reportId,
        text: `${m.title || m.category || 'Incidente'}`,
        priority: m.priority || 'medium',
        status: m.status || 'pending',
        lat: lat,
        lng: lng,
      };
    }).filter(m => m.lat != null && m.lng != null);
  }, [data]);

  const filtered = markers.filter((m) => {
    if (activeFilter === 'critical') return m.priority === 'critical';
    if (activeFilter === 'active') return m.status !== 'resolved';
    return true;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const markerPoints = useMemo(() => filtered.map((marker) => ({
    latitude: marker.lat,
    longitude: marker.lng,
    color: marker.priority === 'critical' ? '#dc2626' : marker.status === 'resolved' ? '#16a34a' : '#f59e0b',
    popupHtml: `<strong>${marker.id}</strong><br/>${marker.text}`,
  })), [filtered]);

  // handle search input with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return undefined;
    }
    const timerId = setTimeout(async () => {
      try {
        const res = await searchPlaces(searchQuery);
        setSuggestions(res || []);
        setShowSuggestions(true);
      } catch (e) {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const onSelectSuggestion = (s) => {
    setShowSuggestions(false);
    setSearchQuery(s.label || '');
  };

  return (
    <div className="relative h-full min-h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-primary-bg">
      {error && (
        <p className="absolute top-3 left-1/2 -translate-x-1/2 z-30 text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-1 shadow-sm">
          {getApiErrorMessage(error)}
        </p>
      )}

      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="w-full max-w-md bg-[color-mix(in_srgb,var(--color-card-bg)_95%,transparent)] backdrop-blur-md rounded-2xl shadow-lg border border-border overflow-hidden pointer-events-auto">
          <div className="p-4 border-b border-border-light">
            <h3 className="font-bold text-text-primary font-display flex items-center gap-2 text-sm">
              <span className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-primary" />
              </span>
              Centro de Monitoreo
            </h3>
          </div>
            <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Filtros Rápidos</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Todos', value: 'all', style: 'bg-primary text-white border-primary' },
                  { label: 'Críticos', value: 'critical', style: 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/15' },
                  { label: 'Activos', value: 'active', style: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/15' },
                ].map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setActiveFilter(f.value)}
                    className={`px-3 py-1.5 text-xs rounded-full font-medium border transition-colors ${activeFilter === f.value ? f.style : 'bg-muted text-text-secondary border-border-light hover:bg-hover'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Input
                placeholder="Buscar ubicación o ID..."
                leftIcon={<Search className="h-4 w-4" />}
                className="py-2 text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute mt-1 left-0 right-0 bg-[var(--color-card-bg)] border border-border rounded-md shadow-lg z-30 max-h-60 overflow-auto">
                  {suggestions.map((s, i) => (
                    <div key={i} role="button" tabIndex={0} onClick={() => onSelectSuggestion(s)} onKeyDown={() => onSelectSuggestion(s)} className="px-3 py-2 text-sm hover:bg-hover cursor-pointer">
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-text-muted">
                  {loading ? 'Actualizando...' : `${filtered.length} incidentes en mapa`}
                </p>
                <div className="flex items-center gap-2">
                  {lastUpdated && (
                    <span className="text-[10px] text-text-muted">
                      {lastUpdated.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={refetch}
                    className="p-1 rounded-lg hover:bg-hover text-text-muted hover:text-primary transition-colors"
                    title="Actualizar ahora"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <Button variant="secondary" size="icon" className="shadow-md">
            <Crosshair className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 bg-[color-mix(in_srgb,var(--color-card-bg)_95%,transparent)] backdrop-blur-md rounded-2xl shadow-lg border border-border overflow-hidden pointer-events-auto flex flex-col max-h-80 transition-all duration-300" style={{ width: '300px' }}>
        <div className="p-3 bg-danger/8 border-b border-danger/15 flex justify-between items-center cursor-pointer" onClick={() => setIsAlertsOpen(!isAlertsOpen)}>
          <span className="font-bold text-danger text-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger animate-pulse-subtle" />
            Alertas Recientes
          </span>
          <button className="text-danger hover:text-danger-dark">
            {isAlertsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
        {isAlertsOpen && (
          <div className="overflow-y-auto flex-1">
            {filtered.slice(0, 8).map((log) => (
              <div key={log.id} className="p-3 border-b border-border-light hover:bg-hover transition-colors text-sm last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-text-primary text-xs">{log.id}</span>
                </div>
                <p className={`text-xs ${log.priority === 'critical' ? 'text-danger' : 'text-warning'}`}>{log.text}</p>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <p className="p-4 text-xs text-text-muted text-center">Sin incidentes activos</p>
            )}
          </div>
        )}
      </div>

        <div className="absolute inset-0 z-0 overflow-hidden rounded-none">
          <AwsLocationMap centerOnUserLocation={true}
            className="absolute inset-0"
            center={[-63.18, -17.78]}
            zoom={12}
            markers={markerPoints}
            showNavigation={false}
          />
          <div className="absolute top-4 right-4 z-30">
            <div className="bg-[color-mix(in_srgb,var(--color-card-bg)_90%,transparent)] text-xs px-2 py-1 rounded-full border border-border flex items-center gap-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Amazon Location</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminMap;
 
