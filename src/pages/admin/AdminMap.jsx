import React, { useState } from 'react';
import { Layers, Search, ShieldAlert, Crosshair, Maximize } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminMap = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="h-full flex flex-col relative -m-4 sm:-m-6 lg:-m-8">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">

        {/* Search & Filter Panel */}
        <div className="w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-border overflow-hidden pointer-events-auto">
          <div className="p-4 border-b border-border-light">
            <h3 className="font-bold text-text-primary font-display mb-3 flex items-center gap-2 text-sm">
              <span className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-primary" />
              </span>
              Centro de Monitoreo
            </h3>
            <Input placeholder="Buscar ubicación o ID..." leftIcon={<Search className="h-4 w-4" />} className="py-2 text-sm" />
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Filtros Rápidos</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Todos', value: 'all', style: 'bg-primary text-white border-primary' },
                  { label: 'Críticos', value: 'critical', style: 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/15' },
                  { label: 'Activos', value: 'active', style: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/15' },
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={`px-3 py-1.5 text-xs rounded-full font-medium border transition-colors ${activeFilter === f.value ? f.style : 'bg-muted text-text-secondary border-border-light hover:bg-hover'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Capas de Mapa</p>
              <div className="space-y-2">
                {['Unidades de Respuesta', 'Incidentes Reportados', 'Mapa de Calor (Riesgo)'].map((l, i) => (
                  <label key={l} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 2} className="rounded border-border text-primary focus:ring-primary/30 focus:ring-offset-0" />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {[Layers, Crosshair, Maximize].map((Icon, i) => (
            <Button key={i} variant="secondary" size="icon" className="shadow-md">
              <Icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </div>

      {/* Activity Stream */}
      <div className="absolute bottom-6 right-6 z-10 w-76 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-border overflow-hidden pointer-events-auto flex flex-col max-h-80" style={{ width: '300px' }}>
        <div className="p-3 bg-danger/8 border-b border-danger/15 flex justify-between items-center">
          <span className="font-bold text-danger text-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger animate-pulse-subtle" />
            Alertas Recientes
          </span>
        </div>
        <div className="overflow-y-auto flex-1">
          {[
            { id: 'R-101', text: 'Incendio reportado en Zona Sur', time: 'Hace 1m', type: 'danger' },
            { id: 'U-05', text: 'Unidad B-14 despachada', time: 'Hace 2m', type: 'warning' },
            { id: 'R-098', text: 'Incidente de tránsito resuelto', time: 'Hace 15m', type: 'success' },
            { id: 'R-102', text: 'Nuevo reporte de inundación', time: 'Hace 22m', type: 'danger' },
          ].map((log, i) => (
            <div key={i} className="p-3 border-b border-border-light hover:bg-hover transition-colors text-sm last:border-b-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-text-primary text-xs">{log.id}</span>
                <span className="text-xs text-text-muted">{log.time}</span>
              </div>
              <p className={`text-xs ${log.type === 'danger' ? 'text-danger' : log.type === 'success' ? 'text-success' : 'text-warning'}`}>
                {log.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 map-placeholder w-full h-full">
        {/* Danger cluster */}
        <div className="absolute top-1/3 left-1/3 group cursor-pointer">
          <div className="h-14 w-14 rounded-full bg-danger/10 flex items-center justify-center animate-ping absolute inset-0" />
          <div className="h-14 w-14 rounded-full bg-danger/8 flex items-center justify-center relative">
            <div className="h-8 w-8 rounded-full bg-danger border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">3</div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-border-strong rounded-xl p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            <p className="text-xs font-bold text-danger mb-1">Zona Crítica</p>
            <p className="text-xs text-text-secondary">3 Incidentes activos.</p>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/3 h-4 w-4 bg-primary rounded-full border-2 border-white shadow-md" />
        <div className="absolute top-1/2 right-1/4">
          <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center">
            <div className="h-3 w-3 bg-warning rounded-full border border-white" />
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/4">
          <div className="px-2.5 py-1 bg-primary/90 rounded-lg text-[10px] font-bold text-white shadow-md flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-subtle" />
            Unidad P-04
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;
