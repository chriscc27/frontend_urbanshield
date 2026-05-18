import React, { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle, MoreVertical } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const reports = [
  { id: 'R-101', cat: 'Incendio', emoji: '🔥', loc: 'Zona Sur, Av. 5', time: 'Hace 5m', status: 'Nuevo', priority: 'Crítica', reporter: 'Juan P.' },
  { id: 'R-102', cat: 'Delito', emoji: '🚨', loc: 'Centro Histórico', time: 'Hace 12m', status: 'Despachado', priority: 'Alta', reporter: 'Ana M.' },
  { id: 'R-103', cat: 'Inundación', emoji: '🌊', loc: 'Barrio Norte', time: 'Hace 45m', status: 'En Progreso', priority: 'Media', reporter: 'Carlos R.' },
  { id: 'R-104', cat: 'Accidente', emoji: '🚗', loc: 'Puente Este', time: 'Hace 2h', status: 'Resuelto', priority: 'Alta', reporter: 'Luis S.' },
  { id: 'R-105', cat: 'Infraestructura', emoji: '🏗️', loc: 'Av. Circunvalación', time: 'Hace 5h', status: 'Resuelto', priority: 'Baja', reporter: 'María T.' },
  { id: 'R-106', cat: 'Bloqueo vial', emoji: '🚧', loc: 'Plaza Central Norte', time: 'Hace 8m', status: 'Nuevo', priority: 'Media', reporter: 'Pedro V.' },
];

const statusBadge = {
  'Nuevo':       <Badge variant="danger" dot>Nuevo</Badge>,
  'Despachado':  <Badge variant="warning" dot>Despachado</Badge>,
  'En Progreso': <Badge variant="primary" dot>En Progreso</Badge>,
  'Resuelto':    <Badge variant="success" dot>Resuelto</Badge>,
};

const priorityBadge = (p) => {
  const map = { 'Crítica': 'danger', 'Alta': 'warning', 'Media': 'accent', 'Baja': 'muted' };
  return <Badge variant={map[p] || 'default'}>{p}</Badge>;
};

const AdminReports = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display">Gestión de Reportes</h2>
          <p className="text-text-secondary text-sm mt-1">Administra, asigna y resuelve incidencias de la ciudad.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="muted" size="sm">Exportar CSV</Button>
          <Button variant="accent" size="sm">Generar Informe</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex-1 max-w-sm w-full">
            <Input placeholder="Buscar por ID, ubicación..." leftIcon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} className="py-2" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="text-sm bg-white border border-border text-text-secondary rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/25 shadow-sm flex-1 sm:flex-none">
              <option>Todos los estados</option>
              <option>Nuevo</option>
              <option>Despachado</option>
              <option>En Progreso</option>
              <option>Resuelto</option>
            </select>
            <Button variant="muted" size="sm" leftIcon={<SlidersHorizontal className="h-4 w-4" />}>Filtros</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider font-semibold text-text-muted border-b border-border-light bg-muted/60">
                <th className="px-5 py-3 text-left">ID / Categoría</th>
                <th className="px-4 py-3 text-left">Prioridad</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Ubicación</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Reportado por</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right pr-5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-hover transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{report.emoji}</span>
                      <div>
                        <p className="font-mono text-xs font-bold text-text-muted">{report.id}</p>
                        <p className="font-semibold text-text-primary">{report.cat}</p>
                        <p className="text-xs text-text-muted">{report.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{priorityBadge(report.priority)}</td>
                  <td className="px-4 py-4 text-text-secondary text-sm hidden md:table-cell">{report.loc}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {report.reporter[0]}
                      </div>
                      <span className="text-text-secondary text-sm">{report.reporter}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{statusBadge[report.status]}</td>
                  <td className="px-4 py-4 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {report.status !== 'Resuelto' && (
                        <Button variant="success" size="xs" leftIcon={<CheckCircle className="h-3 w-3" />}>Resolver</Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border-light bg-muted/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">Mostrando 1–6 de 42 reportes</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="xs" disabled>Anterior</Button>
            <Button variant="primary" size="xs" className="h-7 w-7 p-0">1</Button>
            <Button variant="ghost" size="xs" className="h-7 w-7 p-0">2</Button>
            <Button variant="ghost" size="xs" className="h-7 w-7 p-0">3</Button>
            <Button variant="ghost" size="xs">Siguiente</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminReports;
