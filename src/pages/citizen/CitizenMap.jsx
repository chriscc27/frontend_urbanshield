import React, { useMemo, useState } from 'react';
import { ShieldAlert, ThumbsUp, ThumbsDown, CheckCircle, Crosshair, Map as MapIcon, Maximize } from 'lucide-react';
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
    // We attach raw data to interact with it via onMapClick
    rawData: marker,
  })), [markers]);

  return (
    <div className="relative h-full min-h-[calc(100vh-8rem)] w-full overflow-hidden bg-primary-bg rounded-3xl border border-border-light shadow-sm">
      
      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-border p-4 pointer-events-auto w-full max-w-sm">
          <h3 className="font-bold text-text-primary font-display mb-1 flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MapIcon className="h-4 w-4 text-accent" />
            </span>
            Radar de la Comunidad
          </h3>
          <p className="text-xs text-text-secondary">Valida reportes para ayudar a la comunidad y gana puntos de confianza.</p>
          
          <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger"></span> Crítico</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning"></span> Pendiente</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success"></span> Verificado</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <Button variant="secondary" size="icon" className="shadow-md bg-white/90 backdrop-blur-sm">
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
        }}
      />

      {/* Popup Validation UI */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-5">
              <ReportPopupContent 
                reportId={selectedReport.id} 
                onClose={() => setSelectedReport(null)} 
                votedMap={votedMap} 
                onVote={handleVote} 
                voting={voting}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportPopupContent = ({ reportId, onClose, votedMap, onVote, voting }) => {
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
          <h4 className="font-bold text-text-primary text-lg">{report.title}</h4>
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
    </>
  );
};

export default CitizenMap;
