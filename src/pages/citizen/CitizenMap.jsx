import React, { useMemo, useState } from 'react';
import { ShieldAlert, ThumbsUp, ThumbsDown, CheckCircle, Crosshair, Map as MapIcon, Maximize, Clock, MapPin, User, ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getMapMarkers } from '../../services/locationApi';
import { voteReport, getPublicReport } from '../../services/reportsApi';
import { getApiErrorMessage } from '../../services/api';
import { usePolling } from '../../hooks/usePolling';
import { useAsyncData } from '../../hooks/useAsyncData';
import AwsLocationMap from '../../components/common/AwsLocationMap';

const CitizenMap = () => {
  const { data, loading, refetch } = usePolling(() => getMapMarkers(), [], 15000);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votedMap, setVotedMap] = useState({});

  // Filtrar solo los relevantes para el ciudadano (no cancelados)
  const markers = useMemo(() => {
    const list = Array.isArray(data) ? data : data?.markers || [];
    return list.map((m) => {
      const reportId = m.id || m.reportId;
      return {
        id: reportId,
        title: m.title || m.category || 'Incidente',
        category: m.category,
        priority: m.priority || 'medium',
        status: m.status || 'pending',
        lat: m.lat ?? m.latitude,
        lng: m.lng ?? m.longitude,
        upvotes: m.upvotesCount || 0,
        downvotes: m.downvotesCount || 0,
      };
    }).filter(m => 
      m.lat != null && m.lng != null && m.status !== 'cancelled' && m.status !== 'resolved'
    );
  }, [data]);

  const handleVote = async (reportId, type) => {
    setVoting(true);
    try {
      await voteReport(reportId, type);
      setVotedMap(prev => ({ ...prev, [reportId]: type }));
    } catch (error) {
      console.error(error);
      alert(getApiErrorMessage(error));
    } finally {
      setVoting(false);
    }
  };

  const markerPoints = useMemo(() => markers.map((marker) => ({
    latitude: marker.lat,
    longitude: marker.lng,
    color: marker.priority === 'critical' ? '#dc2626' : marker.status === 'verified' ? '#16a34a' : '#f59e0b',
    rawData: marker,
  })), [markers]);

  return (
    <div className="relative h-full min-h-[calc(100vh-8rem)] w-full overflow-hidden bg-primary-bg rounded-3xl border border-border-light shadow-sm">
      
      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-[color-mix(in_srgb,var(--color-card-bg)_95%,transparent)] backdrop-blur-md rounded-2xl shadow-lg border border-border p-4 pointer-events-auto w-full max-w-sm">
          <h3 className="font-bold text-text-primary font-display mb-1 flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MapIcon className="h-4 w-4 text-accent" />
            </span>
            Radar de la Comunidad
          </h3>
          <p className="text-xs text-text-secondary">Valida reportes para ayudar a la comunidad y gana puntos de confianza.</p>
          
          <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger shadow-sm shadow-danger/50"></span> Crítico</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning shadow-sm shadow-warning/50"></span> Pendiente</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success shadow-sm shadow-success/50"></span> Verificado</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <Button variant="secondary" size="icon" className="shadow-md bg-[color-mix(in_srgb,var(--color-card-bg)_90%,transparent)] backdrop-blur-sm">
            <Crosshair className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <AwsLocationMap 
        centerOnUserLocation={true}
        className="absolute inset-0"
        center={[-63.18, -17.78]}
        zoom={13}
        markers={markerPoints}
        showNavigation={false}
        onMarkerClick={(markerData) => {
          setSelectedReport(markerData);
          setShowDetails(false);
        }}
      />

      {/* Popup Validation UI */}
      <AnimatePresence>
        {selectedReport && !showDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4 pointer-events-auto"
          >
            <div className="bg-[color-mix(in_srgb,var(--color-card-bg)_95%,transparent)] backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.15)] border-0 p-5">
              <ReportPopupContent 
                reportId={selectedReport.id} 
                onClose={() => setSelectedReport(null)} 
                votedMap={votedMap} 
                onVote={handleVote} 
                voting={voting}
                onShowDetails={() => setShowDetails(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Details Modal */}
      <AnimatePresence>
        {showDetails && selectedReport && (
          <ReportDetailsModal 
            reportId={selectedReport.id} 
            onClose={() => setShowDetails(false)}
            votedMap={votedMap}
            onVote={handleVote}
            voting={voting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportPopupContent = ({ reportId, onClose, votedMap, onVote, voting, onShowDetails }) => {
  const { data: report, loading } = useAsyncData(() => getPublicReport(reportId), [reportId]);

  if (loading || !report) {
    return <div className="p-4 text-center text-sm text-text-muted">Cargando detalles del reporte...</div>;
  }

  const upvotes = Array.isArray(report.upvotes) ? report.upvotes.length : 0;
  const downvotes = Array.isArray(report.downvotes) ? report.downvotes.length : 0;

  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={report.priority === 'critical' ? 'danger' : 'warning'} dot>
              {report.status === 'verified' ? 'Verificado' : 'Requiere Validación'}
            </Badge>
            {(upvotes > 0 || downvotes > 0) && (
              <div className="flex items-center gap-2 text-[10px] font-bold bg-secondary-bg px-2 py-0.5 rounded-full border border-border">
                {upvotes > 0 && <span className="text-success flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {upvotes}</span>}
                {downvotes > 0 && <span className="text-danger flex items-center gap-1"><ThumbsDown className="h-3 w-3" /> {downvotes}</span>}
              </div>
            )}
          </div>
          <h4 className="font-bold text-text-primary text-lg leading-tight">{report.title}</h4>
          <p className="text-xs text-text-muted font-mono mt-1">ID: {report.reportId.slice(0,8)}</p>
        </div>
        <button 
          onClick={onClose}
          className="h-8 w-8 rounded-full bg-secondary-bg flex items-center justify-center hover:bg-border transition-colors text-text-secondary flex-shrink-0"
        >
          ✕
        </button>
      </div>

      <div className="bg-secondary-bg/50 p-3 rounded-xl mb-4 border border-border-light text-sm">
        <p className="text-text-primary mb-2 line-clamp-3">{report.description || 'Sin descripción'}</p>
        
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
          <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
            {report.reporterName?.[0] || 'C'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-muted">Reportado por <span className="font-medium text-text-secondary">{report.reporterName || 'Ciudadano'}</span></span>
            <div className="mt-0.5">
              <Badge variant={report.reporterTrustScore >= 80 ? 'success' : report.reporterTrustScore < 20 ? 'danger' : 'accent'} className="text-[9px] py-0 px-1.5 h-3.5 border-none">
                {report.reporterTrustScore >= 80 ? 'Ciudadano Ejemplar' : report.reporterTrustScore < 20 ? 'En Observación' : 'Ciudadano Activo'} ({report.reporterTrustScore ?? 50} pts)
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {votedMap[report.reportId] ? (
        <div className="bg-success/10 border border-success/20 rounded-xl p-3 flex items-center gap-3 text-success">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">¡Gracias por validar! Tu Trust Score subirá.</span>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">¿Sigues viendo este incidente en esta ubicación?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="success" 
              isLoading={voting}
              onClick={() => onVote(report.reportId, 'upvote')}
              leftIcon={<ThumbsUp className="h-4 w-4" />}
            >
              Sí, está ahí
            </Button>
            <Button 
              variant="danger" 
              isLoading={voting}
              onClick={() => onVote(report.reportId, 'downvote')}
              leftIcon={<ThumbsDown className="h-4 w-4" />}
            >
              Es falso
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border-light">
        <Button variant="secondary" className="w-full text-xs font-semibold bg-white/50 hover:bg-white" onClick={onShowDetails} rightIcon={<Maximize className="h-3.5 w-3.5" />}>
          Ver más detalles
        </Button>
      </div>
    </>
  );
};

const ReportDetailsModal = ({ reportId, onClose, votedMap, onVote, voting }) => {
  const { data: report, loading } = useAsyncData(() => getPublicReport(reportId), [reportId]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading || !report) return null;

  const upvotes = Array.isArray(report.upvotes) ? report.upvotes.length : 0;
  const downvotes = Array.isArray(report.downvotes) ? report.downvotes.length : 0;

  // Parse images if it's an array or comma separated string
  let images = [];
  if (report.images && Array.isArray(report.images)) {
    images = report.images;
  } else if (report.imageUrl) {
    if (report.imageUrl.includes(',')) {
      images = report.imageUrl.split(',').map(url => url.trim());
    } else {
      images = [report.imageUrl];
    }
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getHeaderGradient = () => {
    if (report.priority === 'critical') return 'from-red-600 via-red-500 to-rose-600';
    
    const cat = (report.category || '').toLowerCase();
    if (cat.includes('robo') || cat.includes('asalto') || cat.includes('delito') || cat.includes('seguridad')) {
      return 'from-slate-900 via-indigo-900 to-indigo-700';
    }
    if (cat.includes('accidente') || cat.includes('choque') || cat.includes('vial')) {
      return 'from-orange-600 via-amber-500 to-yellow-500';
    }
    if (cat.includes('incendio') || cat.includes('fuego') || cat.includes('explosión')) {
      return 'from-red-700 via-red-500 to-orange-500';
    }
    if (cat.includes('bloqueo') || cat.includes('manifestación') || cat.includes('marcha')) {
      return 'from-zinc-800 via-zinc-600 to-gray-500';
    }
    if (cat.includes('salud') || cat.includes('médica') || cat.includes('rescate')) {
      return 'from-blue-700 via-blue-500 to-cyan-500';
    }
    
    return 'from-[#2F5D50] via-primary to-accent';
  };

  const headerGradient = getHeaderGradient();

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }} 
          animate={{ y: 0, scale: 1 }} 
          exit={{ y: 20, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] bg-card-bg sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border-0 outline-none ring-0"
        >
          {/* Header Dinámico (Sin Imagen) */}
          <div className={`relative pt-12 sm:pt-8 pb-6 px-6 sm:px-8 w-full bg-gradient-to-br ${headerGradient} flex-shrink-0 overflow-hidden`}>
            <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors text-white border border-white/20 shadow-lg"
            >
              ✕
            </button>
            <div className="relative z-20 flex justify-between items-end">
              <div>
                <Badge variant={report.priority === 'critical' ? 'danger' : 'warning'} className="mb-3 shadow-sm border-white/20 bg-white/20 backdrop-blur-md text-white">
                  {report.status === 'verified' ? 'Verificado' : 'Requiere Validación'}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight tracking-tight drop-shadow-md">{report.title}</h2>
              </div>
              <div className="hidden sm:flex bg-black/20 backdrop-blur-md rounded-xl p-2.5 items-center gap-4 border border-white/20 text-white font-bold text-sm shadow-xl">
                <span className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4 text-success" /> {upvotes}</span>
                <span className="flex items-center gap-1.5"><ThumbsDown className="h-4 w-4 text-danger" /> {downvotes}</span>
              </div>
            </div>
          </div>

          {/* Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-7 custom-scrollbar bg-card-bg">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary-bg/50 border border-border-light shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Reportado el</p>
                  <p className="text-sm font-semibold text-text-primary">{new Date(report.createdAt).toLocaleString('es-BO')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary-bg/50 border border-border-light shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Ubicación</p>
                  <p className="text-sm font-semibold text-text-primary truncate">{report.location || `${report.lat}, ${report.lng}`}</p>
                </div>
              </div>
            </div>

            {/* Evidencia Fotográfica (Carrusel) */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" /> Evidencia Fotográfica
                </h3>
                <div className="relative w-full h-48 sm:h-72 rounded-2xl overflow-hidden bg-black group border border-border-light shadow-inner">
                  <img 
                    src={images[currentImageIndex]} 
                    alt={`Evidencia ${currentImageIndex + 1}`} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setExpandedImage(images[currentImageIndex])}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                        {images.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} 
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  <button 
                    onClick={() => setExpandedImage(images[currentImageIndex])}
                    className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" /> Descripción del Incidente
              </h3>
              <div className="bg-secondary-bg rounded-2xl p-5 border border-border-light shadow-inner">
                <p className="text-text-primary leading-relaxed text-sm">{report.description || 'El ciudadano no proporcionó una descripción adicional para este reporte.'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Línea de Tiempo
              </h3>
              <div className="bg-secondary-bg/30 rounded-2xl p-5 border border-border-light">
                <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-border">
                  <div className="relative">
                    <span className="absolute -left-6 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center border-4 border-card-bg shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <p className="text-sm font-bold text-text-primary">Reporte Creado</p>
                    <p className="text-xs text-text-secondary mt-0.5">{new Date(report.createdAt).toLocaleString('es-BO')}</p>
                  </div>
                  {report.status === 'verified' && (
                    <div className="relative">
                      <span className="absolute -left-6 h-6 w-6 rounded-full bg-success/20 flex items-center justify-center border-4 border-card-bg shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-success" />
                      </span>
                      <p className="text-sm font-bold text-text-primary">Validado por la Comunidad</p>
                      <p className="text-xs text-text-secondary mt-0.5">Alcanzó los votos necesarios de confianza</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center font-bold text-primary text-lg shadow-sm border border-border-light">
                  {report.reporterName?.[0] || 'C'}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Reportado por</p>
                  <p className="font-semibold text-text-primary">{report.reporterName || 'Ciudadano Anónimo'}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={report.reporterTrustScore >= 80 ? 'success' : 'accent'} className="shadow-sm font-bold px-3 py-1">
                  Trust Score: {report.reporterTrustScore ?? 50} pts
                </Badge>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="p-4 sm:p-5 border-t border-border bg-secondary-bg/40 flex-shrink-0">
            {votedMap[report.reportId] ? (
              <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center justify-center gap-3 text-success shadow-sm">
                <CheckCircle className="h-6 w-6" />
                <span className="text-sm font-bold">Validación registrada exitosamente</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="success" 
                  className="flex-1 py-4 text-sm font-bold shadow-lg shadow-success/20 hover:-translate-y-0.5 transition-transform"
                  isLoading={voting}
                  onClick={() => onVote(report.reportId, 'upvote')}
                  leftIcon={<ThumbsUp className="h-5 w-5" />}
                >
                  Confirmar (Sí está ahí)
                </Button>
                <Button 
                  variant="danger" 
                  className="flex-1 py-4 text-sm font-bold shadow-lg shadow-danger/20 hover:-translate-y-0.5 transition-transform"
                  isLoading={voting}
                  onClick={() => onVote(report.reportId, 'downvote')}
                  leftIcon={<ThumbsDown className="h-5 w-5" />}
                >
                  Rechazar (Es falso)
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox Modal for Expanded Image */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setExpandedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 z-[80] h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20"
              onClick={() => setExpandedImage(null)}
            >
              ✕
            </button>
            <img 
              src={expandedImage} 
              alt="Evidencia Ampliada" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CitizenMap;
