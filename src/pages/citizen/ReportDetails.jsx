import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, Calendar, AlertTriangle, ShieldCheck,
  CheckCircle, Radio, Image as ImageIcon
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const timelineSteps = [
  { id: 1, time: '14:30', title: 'Reporte creado', desc: 'Ciudadano envió el reporte al sistema.', type: 'user', done: true },
  { id: 2, time: '14:32', title: 'Recibido por Control', desc: 'Centro de Control analizó el reporte y validó la ubicación.', type: 'system', done: true },
  { id: 3, time: '14:35', title: 'Unidad despachada', desc: 'Unidad de Bomberos B-14 despachada a la ubicación GPS.', type: 'action', done: true },
  { id: 4, time: '14:45', title: 'En el lugar', desc: 'Unidad confirmó arribo. Labores de contención iniciadas.', type: 'update', done: true },
  { id: 5, time: '—', title: 'Resolución pendiente', desc: 'Esperando confirmación de cierre del incidente.', type: 'pending', done: false },
];

const ReportDetails = () => {
  const { id } = useParams();

  const report = {
    id: id || 'INC-0001',
    title: 'Incendio en contenedor de basura',
    category: 'Incendio',
    status: 'En Progreso',
    priority: 'Alta',
    date: '25 Oct 2023, 14:30',
    location: 'Av. Principal 123, Zona Centro',
    coords: '-17.7833° S, -63.1821° W',
    description: 'Hay un incendio activo en un contenedor de basura ubicado en la avenida principal. El fuego se está acercando a vehículos estacionados en la acera. Hay humo visible desde varias cuadras de distancia.',
  };

  const statusBadge = report.status === 'En Progreso'
    ? <Badge variant="warning" dot>{report.status}</Badge>
    : <Badge variant="success" dot>{report.status}</Badge>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link to="/reports" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-1">
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Reportes
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-text-muted bg-secondary-bg px-2 py-0.5 rounded-lg border border-border-light">{report.id}</span>
            {statusBadge}
            <Badge variant="danger">{report.priority}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-display">{report.title}</h1>
          <p className="text-text-secondary text-sm mt-1 flex items-center gap-1.5">
            <span>Categoría:</span>
            <span className="font-semibold text-text-primary">{report.category}</span>
          </p>
        </div>
        <Button variant="muted" leftIcon={<AlertTriangle className="h-4 w-4" />} size="sm">
          Añadir Información
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── Main Content ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Metadata */}
          <Card>
            <CardHeader><CardTitle>Detalles del Incidente</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <p className="text-text-primary leading-relaxed">{report.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border-light">
                {[
                  { icon: Calendar, label: 'Fecha y Hora', value: report.date, color: 'text-primary' },
                  { icon: MapPin, label: 'Ubicación', value: report.location, color: 'text-accent' },
                  { icon: Radio, label: 'Coordenadas GPS', value: report.coords, color: 'text-success' },
                  { icon: Clock, label: 'Última Actualización', value: 'Hace 10 minutos', color: 'text-warning' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary-bg/40 border border-border-light">
                    <div className="h-9 w-9 rounded-lg bg-primary-bg/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-text-primary">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader><CardTitle>Evidencia Fotográfica</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {/* Placeholder images */}
                <div className="aspect-square rounded-xl bg-secondary-bg/60 border border-border-light flex flex-col items-center justify-center text-text-muted hover:border-border hover:bg-secondary-bg/80 transition-all cursor-pointer group">
                  <ImageIcon className="h-8 w-8 mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-xs">Foto 1</p>
                </div>
                <div className="aspect-square rounded-xl border-2 border-dashed border-border-light flex flex-col items-center justify-center text-text-muted hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                  <span className="text-2xl mb-1">+</span>
                  <p className="text-xs">Añadir</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Timeline ─── */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle>Línea de Tiempo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border-light" />

                <div className="space-y-5">
                  {timelineSteps.map((step) => (
                    <div key={step.id} className="relative flex items-start gap-4 pl-10">
                      {/* Node */}
                      <div className={`absolute left-0 top-0 h-9 w-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                        step.done
                          ? step.type === 'action'
                            ? 'bg-danger/20 border-danger text-danger'
                            : step.type === 'system'
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-success/20 border-success text-success'
                          : 'bg-secondary-bg border-border text-text-muted'
                      }`}>
                        {step.done
                          ? step.type === 'action' ? <ShieldCheck className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
                          : <Clock className="h-4 w-4" />
                        }
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-5 last:pb-0 ${!step.done ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-text-muted">{step.time}</span>
                          {step.done && <span className="h-1 w-1 rounded-full bg-text-muted" />}
                        </div>
                        <p className="text-sm font-semibold text-text-primary">{step.title}</p>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
