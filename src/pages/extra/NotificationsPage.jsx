import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Shield } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const notifications = [
  { id: 1, type: 'alert',   icon: AlertTriangle, title: 'Alerta de Inundación',             message: 'Posible desborde en el Río Sur. Evita la zona.', time: 'Hace 5 min', isRead: false, color: 'text-danger', bg: 'bg-danger/8 border-danger/15' },
  { id: 2, type: 'update',  icon: Bell,          title: 'Actualización de Reporte INC-0001', message: 'Tu reporte cambió de estado a: En Progreso.', time: 'Hace 2h', isRead: false, color: 'text-warning', bg: 'bg-warning/8 border-warning/15' },
  { id: 3, type: 'info',    icon: Info,          title: 'Mantenimiento Programado',          message: 'Domingo 29, 02:00 AM — 2 horas de mantenimiento.', time: 'Ayer', isRead: true, color: 'text-primary', bg: 'bg-primary/8 border-primary/15' },
  { id: 4, type: 'success', icon: CheckCircle,   title: '¡Reporte Resuelto!',                message: 'INC-0003 fue cerrado exitosamente por las autoridades.', time: 'Hace 2 días', isRead: true, color: 'text-success', bg: 'bg-success/8 border-success/15' },
  { id: 5, type: 'info',    icon: Shield,        title: 'Zona de Alerta Activa',             message: 'Alerta preventiva en Barrio Norte por sismo leve.', time: 'Hace 3 días', isRead: true, color: 'text-accent-dark', bg: 'bg-accent/8 border-accent/15' },
];

const NotificationsPage = () => {
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display flex items-center gap-2.5">
            Notificaciones
            {unread > 0 && <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white text-xs font-bold">{unread}</span>}
          </h2>
          <p className="text-text-secondary text-sm mt-1">{unread} sin leer · {notifications.length} total</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">Marcar todas como leídas</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
        {['Todas', 'Sin leer', 'Alertas', 'Actualizaciones'].map((tab, i) => (
          <button key={tab} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            i === 0 ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-hover'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 divide-y divide-border-light">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className={`flex gap-4 px-5 py-4 hover:bg-hover transition-colors cursor-pointer ${!notif.isRead ? 'bg-primary/3' : ''}`}>
                <div className={`h-10 w-10 rounded-xl border ${notif.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`h-5 w-5 ${notif.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>{notif.title}</h4>
                    <span className="text-xs text-text-muted flex-shrink-0">{notif.time}</span>
                  </div>
                  <p className={`text-sm mt-1 leading-relaxed ${!notif.isRead ? 'text-text-secondary' : 'text-text-muted'}`}>{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div className="flex-shrink-0 flex items-center">
                    <span className="h-2 w-2 bg-primary rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
