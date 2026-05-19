import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, UploadCloud, AlertCircle, Check } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { createReport } from '../../services/reportsApi';
import { getPresignedUrl, uploadFileToS3 } from '../../services/uploadsApi';
import { getApiErrorMessage } from '../../services/api';
import { PRIORITY_TO_API } from '../../utils/reportFormatters';
import AwsLocationMap from '../../components/common/AwsLocationMap';

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
  const fileInputRef = useRef(null);
  const [selectedCat, setSelectedCat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [gpsActive, setGpsActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '',
    location: '',
    latitude: -17.7833,
    longitude: -63.1821,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setGpsActive(true);
      },
      () => setError('No se pudo obtener tu ubicación. Activa el GPS e intenta de nuevo.'),
      { enableHighAccuracy: true },
    );
  };

  const addFiles = (list) => {
    const incoming = Array.from(list || []).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    );
    setFiles((prev) => [...prev, ...incoming].slice(0, 5));
  };

  const uploadImages = async () => {
    const urls = [];
    const keys = [];
    for (const file of files) {
      const presigned = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      const publicUrl = await uploadFileToS3(file, presigned);
      if (publicUrl) urls.push(publicUrl);
      if (presigned.key) keys.push(presigned.key);
    }
    return { imageUrl: urls[0] || null, imageKeys: keys };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Client-side validation ──────────────────────────────────────────────
    if (!selectedCat) {
      setError('Selecciona una categoría de incidente');
      return;
    }
    if (!form.title || form.title.trim().length < 5) {
      setError('El título debe tener al menos 5 caracteres');
      return;
    }
    if (form.title.trim().length > 200) {
      setError('El título no puede superar los 200 caracteres');
      return;
    }
    if (!form.description || form.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return;
    }
    if (form.description.trim().length > 2000) {
      setError('La descripción no puede superar los 2000 caracteres');
      return;
    }
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Latitud inválida. Usa el botón "Mi ubicación" para obtener tu posición.');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Longitud inválida. Usa el botón "Mi ubicación" para obtener tu posición.');
      return;
    }
    // ────────────────────────────────────────────────────────────────────────

    setIsSubmitting(true);
    setError('');
    try {
      const media = files.length ? await uploadImages() : { imageUrl: null, imageKeys: [] };
      await createReport({
        title: form.title.trim(),
        category: selectedCat,
        description: form.description.trim(),
        latitude: lat,
        longitude: lng,
        location: form.location?.trim() || undefined,
        priority: form.priority ? PRIORITY_TO_API[form.priority] : undefined,
        imageUrl: media.imageUrl || undefined,
        imageKeys: media.imageKeys.length ? media.imageKeys : undefined,
      });
      setShowSuccess(true);
      setTimeout(() => navigate('/reports'), 2500);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-lg mx-auto mt-16 animate-fade-in">
        <div className="surface-card rounded-2xl p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6 glow-primary animate-pulse">
            <Check className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary font-display mb-3">Reporte enviado</h2>
          <p className="text-text-secondary">Tu reporte fue registrado. Las autoridades han sido notificadas.</p>
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

      {error && (
        <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">{error}</p>
      )}

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
              <Input name="title" value={form.title} onChange={handleChange} label="Título descriptivo" placeholder="Incendio en contenedor de basura" required />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="block w-full rounded-xl text-text-primary text-sm bg-secondary-bg/60 border border-border-light placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 hover:border-border transition-all py-2.5 px-4 resize-none"
                  rows={4}
                  placeholder="Describe detalladamente lo que está ocurriendo..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Nivel de Urgencia</label>
                <select name="priority" value={form.priority} onChange={handleChange} className="block w-full rounded-xl text-text-primary text-sm bg-secondary-bg/60 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 hover:border-border transition-all py-2.5 px-4">
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
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
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
                {files.length > 0 && (
                  <p className="text-xs text-primary mt-2">{files.length} archivo(s) seleccionado(s)</p>
                )}
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
                <Badge variant={gpsActive ? 'success' : 'muted'} dot>{gpsActive ? 'GPS activo' : 'GPS pendiente'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                leftIcon={<MapPin className="h-4 w-4" />}
                placeholder="Dirección aproximada"
              />

              {/* Map */}
              <div className="flex-1 min-h-[380px] rounded-xl overflow-hidden relative map-placeholder border border-border-light">
                <AwsLocationMap
                  className="absolute inset-0"
                  center={[form.longitude, form.latitude]}
                  zoom={14}
                  markers={[
                    {
                      latitude: Number(form.latitude),
                      longitude: Number(form.longitude),
                      color: '#dc2626',
                      popupHtml: '<strong>Ubicación seleccionada</strong><br/>Ajusta el punto usando Mi ubicación',
                    },
                  ]}
                  centerOnUserLocation={true}
                  userLocationZoom={15}
                />

                <div className="absolute top-3 left-3 right-3 z-20 glass rounded-xl px-3 py-2 text-center pointer-events-none">
                  <p className="text-xs font-medium text-text-primary">El mapa se centra automáticamente en tu ubicación</p>
                </div>

                <div className="absolute bottom-3 left-3 z-20 glass rounded-xl px-3 py-2 pointer-events-none">
                  <p className="text-[10px] text-text-muted font-mono">
                    {Math.abs(form.latitude).toFixed(4)}° {form.latitude < 0 ? 'S' : 'N'}, {Math.abs(form.longitude).toFixed(4)}° {form.longitude < 0 ? 'W' : 'E'}
                  </p>
                </div>

                <div className="absolute bottom-3 right-3 z-20">
                  <Button type="button" variant="secondary" size="sm" leftIcon={<MapPin className="h-3.5 w-3.5" />} className="text-xs shadow-md" onClick={useMyLocation}>
                    Mi ubicación
                  </Button>
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
