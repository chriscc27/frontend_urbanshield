import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, UploadCloud, AlertCircle, Check, X, ChevronDown } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const CATEGORIES = [
  { value: 'incendio', label: 'Incendio', emoji: '🔥' },
  { value: 'inundacion', label: 'Inundación', emoji: '🌊' },
  { value: 'delito', label: 'Delito / Robo', emoji: '🚨' },
  { value: 'accidente', label: 'Accidente de Tránsito', emoji: '🚗' },
  { value: 'bloqueo', label: 'Bloqueo Vial', emoji: '🚧' },
  { value: 'infraestructura', label: 'Infraestructura Urbana', emoji: '🏗️' },
];

const CreateReport = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setShowSuccess(true); }, 1500);
    setTimeout(() => navigate('/dashboard'), 3500);
  };

  if (showSuccess) {
    return (
      <div className="max-w-lg mx-auto mt-16 animate-fade-in">
        <div className="surface-card rounded-2xl p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 glow-primary animate-pulse">
            <Check className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary font-display mb-3">¡Reporte Enviado!</h2>
          <p className="text-text-secondary">Tu reporte fue registrado. Las autoridades han sido notificadas. Redirigiendo al panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-text-primary font-display flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-xl bg-danger/15 border border-danger/25 flex items-center justify-center">
            <AlertCircle className="h-4.5 w-4.5 text-danger" style={{ width: '18px', height: '18px' }} />
          </span>
          Registrar Nueva Emergencia
        </h2>
        <p className="text-text-secondary text-sm mt-1 ml-11">Proporciona los detalles del incidente para una respuesta rápida y coordinada.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ─── Left Column ─── */}
        <div className="space-y-5">

          {/* Category Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Categoría del Incidente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCat(cat.value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all duration-150 text-left ${
                      selectedCat === cat.value
                        ? 'bg-primary/15 border-primary/50 text-primary-light'
                        : 'bg-secondary-bg/50 border-border-light text-text-secondary hover:bg-hover/30 hover:border-border hover:text-text-primary'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader><CardTitle>Detalles del Incidente</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Título descriptivo" placeholder="Ej: Incendio en contenedor de basura" />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Descripción</label>
                <textarea
                  className="block w-full rounded-xl text-text-primary text-sm bg-secondary-bg/60 border border-border-light placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 hover:border-border transition-all py-2.5 px-4 resize-none"
                  rows={4}
                  placeholder="Describe detalladamente lo que está ocurriendo, personas involucradas, riesgo estimado..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Nivel de Urgencia</label>
                <select className="block w-full rounded-xl text-text-primary text-sm bg-secondary-bg/60 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 hover:border-border transition-all py-2.5 px-4">
                  <option value="">Selecciona urgencia...</option>
                  <option value="critica">🔴 Crítica — Riesgo de vida</option>
                  <option value="alta">🟠 Alta — Atención inmediata</option>
                  <option value="media">🟡 Media — Importante</option>
                  <option value="baja">🟢 Baja — Informativo</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader><CardTitle>Evidencia Fotográfica</CardTitle></CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragging
                    ? 'border-primary/70 bg-primary/10 scale-[1.01]'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <UploadCloud className={`mx-auto h-10 w-10 mb-3 transition-colors ${dragging ? 'text-primary' : 'text-text-muted'}`} />
                <p className="text-sm font-medium text-text-primary mb-1">
                  {dragging ? 'Suelta aquí para subir' : 'Arrastra fotos o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-text-muted">PNG, JPG, WEBP — Máx. 5MB por archivo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right Column: Map ─── */}
        <div className="space-y-5">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ubicación GPS</CardTitle>
                <Badge variant="success" dot>GPS Activo</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <Input
                leftIcon={<MapPin className="h-4 w-4" />}
                placeholder="Dirección aproximada (autocompletado)"
                defaultValue="Av. Principal, cerca del parque central"
              />

              {/* Map */}
              <div className="flex-1 min-h-[380px] rounded-xl overflow-hidden relative map-placeholder border border-border-light">
                {/* Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-danger/20 animate-ping" />
                    <MapPin className="h-8 w-8 text-danger drop-shadow-lg relative z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(200,85,61,0.8))' }} />
                  </div>
                </div>

                {/* Instruction overlay */}
                <div className="absolute top-3 left-3 right-3 glass rounded-xl px-3 py-2 text-center">
                  <p className="text-xs font-medium text-text-primary">Mueve el mapa para ajustar la ubicación exacta</p>
                </div>

                {/* Coordinates */}
                <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2">
                  <p className="text-[10px] text-text-muted font-mono">
                    -17.7833° S, -63.1821° W
                  </p>
                </div>

                {/* Use current location */}
                <div className="absolute bottom-3 right-3">
                  <Button type="button" variant="secondary" size="sm" leftIcon={<MapPin className="h-3.5 w-3.5" />} className="text-xs">
                    Mi ubicación
                  </Button>
                </div>

                {/* Zoom controls */}
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {['+', '−'].map((z, i) => (
                    <div key={i} className="h-7 w-7 glass rounded flex items-center justify-center text-text-primary font-bold text-sm cursor-pointer hover:text-primary transition-colors">
                      {z}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Submit Row ─── */}
        <div className="col-span-1 lg:col-span-2 flex justify-end gap-3 pt-2 border-t border-border-light">
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
            Cancelar
          </Button>
          <Button type="submit" size="md" isLoading={isSubmitting} variant="danger">
            Enviar Reporte de Emergencia
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateReport;
