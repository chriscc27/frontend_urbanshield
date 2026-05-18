import React from 'react';
import { Bell, Lock, Monitor, Moon, Eye } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Toggle = ({ defaultChecked = false }) => (
  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
    <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
    <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm peer-checked:after:translate-x-5" />
  </label>
);

const SettingsPage = () => (
  <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
    <div>
      <h2 className="text-2xl font-bold text-text-primary font-display">Configuración</h2>
      <p className="text-text-secondary text-sm mt-1">Personaliza tu experiencia en UrbanShield.</p>
    </div>

    {/* Notifications */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Bell className="h-4 w-4 text-primary" />
          </span>
          Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-5 py-4">
        {[
          { label: 'Alertas de emergencia por email', desc: 'Recibe avisos críticos en tu correo.', checked: true },
          { label: 'Notificaciones push en navegador', desc: 'Alertas en tiempo real mientras navegas.', checked: false },
          { label: 'Actualizaciones de mis reportes', desc: 'Cuando cambie el estado de un reporte.', checked: true },
          { label: 'Alertas de zonas cercanas', desc: 'Emergencias en un radio de 5km.', checked: true },
        ].map((item, i, arr) => (
          <div key={i} className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? 'border-b border-border-light' : ''}`}>
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
            <Toggle defaultChecked={item.checked} />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Appearance */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Monitor className="h-4 w-4 text-accent-dark" />
          </span>
          Apariencia
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">Tema de la aplicación</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Claro', icon: Eye, active: true },
              { label: 'Oscuro', icon: Moon, active: false },
              { label: 'Sistema', icon: Monitor, active: false },
            ].map((theme, i) => (
              <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                theme.active ? 'bg-primary/8 border-primary/30 text-primary' : 'border-border text-text-secondary hover:border-border-strong hover:bg-hover'
              }`}>
                <theme.icon className="h-5 w-5" />
                {theme.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-4 border-t border-border-light">
          <div>
            <p className="text-sm font-semibold text-text-primary">Reducir animaciones</p>
            <p className="text-xs text-text-muted mt-0.5">Para usuarios con sensibilidad al movimiento.</p>
          </div>
          <Toggle />
        </div>
      </CardContent>
    </Card>

    {/* Security */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-danger/8 border border-danger/15 flex items-center justify-center">
            <Lock className="h-4 w-4 text-danger" />
          </span>
          Privacidad y Seguridad
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-4 space-y-1">
        {[
          { label: 'Cambiar Contraseña', desc: 'Actualiza tu contraseña con frecuencia.', action: 'Actualizar', variant: 'muted' },
          { label: 'Autenticación 2FA', desc: 'Añade una capa extra de seguridad.', action: 'Configurar', variant: 'primary' },
          { label: 'Sesiones Activas', desc: '2 dispositivos conectados actualmente.', action: 'Ver', variant: 'muted' },
        ].map((item, i, arr) => (
          <div key={i} className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? 'border-b border-border-light' : ''}`}>
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
            <Button variant={item.variant} size="xs">{item.action}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default SettingsPage;
