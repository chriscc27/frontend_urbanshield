import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, UploadCloud, Check, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
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
  { value: 'incendio', label: 'Incendio', emoji: '🔥', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
  { value: 'inundacion', label: 'Inundación', emoji: '🌊', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  { value: 'delito', label: 'Delito / Robo', emoji: '🚨', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { value: 'accidente', label: 'Accidente de Tránsito', emoji: '🚗', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
  { value: 'bloqueo', label: 'Bloqueo Vial', emoji: '🚧', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  { value: 'infraestructura', label: 'Falla Urbana', emoji: '🏗️', color: 'bg-gray-500/10 border-gray-500/20 text-gray-400' },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

const CreateReport = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Wizard state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  // Form state
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

  useEffect(() => {
    if (step === 2 && !gpsActive) {
      useMyLocation(); // Auto-locate when reaching map step
    }
  }, [step]);

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

  const nextStep = () => {
    setError('');
    if (step === 1 && !selectedCat) {
      setError('Por favor selecciona el tipo de emergencia.');
      return;
    }
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!form.title || form.title.trim().length < 5) {
      setError('El título debe tener al menos 5 caracteres');
      return;
    }
    if (!form.description || form.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const media = files.length ? await uploadImages() : { imageUrl: null, imageKeys: [] };
      await createReport({
        title: form.title.trim(),
        category: selectedCat,
        description: form.description.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        location: form.location?.trim() || undefined,
        priority: form.priority ? PRIORITY_TO_API[form.priority] : undefined,
        imageUrl: media.imageUrl || undefined,
        imageKeys: media.imageKeys.length ? media.imageKeys : undefined,
      });
      setShowSuccess(true);
      setTimeout(() => navigate('/reports'), 3500);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md mx-auto mt-20"
      >
        <div className="surface-card rounded-2xl p-12 text-center border border-success/20 shadow-lg shadow-success/10 relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mx-auto w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6"
          >
            <Check className="h-12 w-12 text-success" />
          </motion.div>
          <h2 className="text-3xl font-bold text-text-primary font-display mb-3">¡Reporte Enviado!</h2>
          <p className="text-text-secondary text-sm">Tu reporte ha sido registrado con éxito y las autoridades correspondientes han sido notificadas.</p>
          
          <motion.div 
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-success/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-text-primary font-display flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-danger/15 border border-danger/25 flex items-center justify-center">
              <AlertCircle className="h-4.5 w-4.5 text-danger" />
            </span>
            Nueva Emergencia
          </h2>
          <div className="text-sm font-medium text-text-muted">Paso {step} de 3</div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 w-full bg-secondary-bg/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary" 
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </motion.div>
      )}

      <div className="relative overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait" custom={direction}>
          
          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute w-full"
            >
              <Card className="border-border-light bg-secondary-bg/20 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-center text-xl">¿Qué está sucediendo?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {CATEGORIES.map((cat) => (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        key={cat.value}
                        onClick={() => setSelectedCat(cat.value)}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-200 ${
                          selectedCat === cat.value
                            ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10'
                            : 'bg-secondary-bg/40 border-border hover:bg-secondary-bg/80'
                        }`}
                      >
                        <span className="text-4xl filter drop-shadow-md">{cat.emoji}</span>
                        <span className={`font-semibold text-sm ${selectedCat === cat.value ? 'text-primary-light' : 'text-text-secondary'}`}>
                          {cat.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute w-full h-full"
            >
              <Card className="h-[500px] flex flex-col border-border-light bg-secondary-bg/20 backdrop-blur-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>¿Dónde es la emergencia?</CardTitle>
                    <Badge variant={gpsActive ? 'success' : 'muted'} dot>{gpsActive ? 'GPS activo' : 'Buscando...'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    leftIcon={<MapPin className="h-4 w-4" />}
                    placeholder="Escribe una referencia (ej. Frente al parque)"
                  />
                  <div className="flex-1 rounded-2xl overflow-hidden relative border border-border-light shadow-inner">
                    <AwsLocationMap
                      className="absolute inset-0"
                      center={[form.longitude, form.latitude]}
                      zoom={15}
                      markers={[{
                        latitude: Number(form.latitude),
                        longitude: Number(form.longitude),
                        color: '#dc2626',
                      }]}
                      centerOnUserLocation={true}
                      onMapClick={(loc) => setForm((prev) => ({ ...prev, latitude: loc.latitude, longitude: loc.longitude }))}
                    />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                      <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                        Toca el mapa para mover el pin
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 z-20">
                      <Button type="button" variant="primary" size="sm" onClick={useMyLocation} className="shadow-lg backdrop-blur-sm bg-primary/90">
                        <MapPin className="h-4 w-4 mr-2" /> Centrar Mapa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: DETAILS & UPLOAD */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute w-full"
            >
              <div className="space-y-4">
                <Card className="border-border-light bg-secondary-bg/20 backdrop-blur-md">
                  <CardHeader><CardTitle>Detalles Finales</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input name="title" value={form.title} onChange={handleChange} label="Título corto" placeholder="Ej. Accidente fuerte en la avenida" required />
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Descripción de la situación</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="block w-full rounded-xl text-text-primary text-sm bg-secondary-bg/60 border border-border-light placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 py-3 px-4 resize-none"
                        rows={3}
                        placeholder="Describe qué pasó, si hay heridos, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Nivel de Urgencia</label>
                      <select name="priority" value={form.priority} onChange={handleChange} className="block w-full rounded-xl text-text-primary text-sm bg-secondary-bg/60 border border-border-light focus:outline-none focus:ring-2 focus:ring-primary/50 py-3 px-4">
                        <option value="">Selecciona urgencia...</option>
                        <option value="critica">🔴 Crítica — Riesgo de vida</option>
                        <option value="alta">🟠 Alta — Atención inmediata</option>
                        <option value="media">🟡 Media — Importante</option>
                        <option value="baja">🟢 Baja — Informativo</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border-light bg-secondary-bg/20 backdrop-blur-md">
                  <CardContent className="pt-6">
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                        dragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <UploadCloud className={`mx-auto h-8 w-8 mb-2 ${dragging ? 'text-primary' : 'text-text-muted'}`} />
                      <p className="text-sm font-medium text-text-primary">Evidencia Fotográfica (Opcional)</p>
                      <p className="text-xs text-text-muted mt-1">Arrastra fotos aquí o haz clic</p>
                      {files.length > 0 && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-primary/20 text-primary-light px-3 py-1 rounded-full text-xs font-bold">
                          <Check className="h-3 w-3" /> {files.length} archivos
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex justify-between items-center pt-4 border-t border-border-light">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={prevStep} leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Atrás
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
            Cancelar
          </Button>
        )}

        {step < 3 ? (
          <Button type="button" variant="primary" onClick={nextStep} rightIcon={<ChevronRight className="h-4 w-4" />}>
            Siguiente
          </Button>
        ) : (
          <Button type="button" variant="danger" size="md" isLoading={isSubmitting} onClick={handleSubmit} rightIcon={<Check className="h-4 w-4" />}>
            Enviar Reporte
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateReport;
