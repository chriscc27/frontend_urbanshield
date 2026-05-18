import React from 'react';
import { User, Mail, Phone, MapPin, Camera, Star } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const ProfilePage = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <div>
      <h2 className="text-2xl font-bold text-text-primary font-display">Mi Perfil</h2>
      <p className="text-text-secondary text-sm mt-1">Gestiona tu información y configuración de cuenta.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Avatar Card */}
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="h-24 w-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto shadow-sm">
                <span className="text-4xl font-bold text-primary font-display">JP</span>
              </div>
              <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary rounded-full border-2 border-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-text-primary font-display">Juan Pérez</h3>
            <p className="text-sm text-text-secondary mb-4">Ciudadano Activo</p>
            <div className="flex justify-center gap-2 mb-5">
              <Badge variant="primary" dot>Verificado</Badge>
              <Badge variant="accent">Nivel 3</Badge>
            </div>
            <div className="space-y-3 pt-4 border-t border-border-light text-left">
              {[
                { label: 'Reportes Totales', value: '12' },
                { label: 'Resueltos', value: '8' },
                { label: 'Precisión GPS', value: '94%' },
                { label: 'Confianza', value: '★★★★ Alto' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="font-semibold text-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Logros</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { icon: '🏅', label: 'Primer Reporte', desc: 'Primeros pasos' },
              { icon: '⚡', label: 'Reporte Rápido', desc: 'En menos de 2 min' },
              { icon: '🎯', label: 'GPS Preciso', desc: '+95% de exactitud' },
            ].map((ach, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted border border-border-light hover:border-border transition-colors">
                <span className="text-xl">{ach.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{ach.label}</p>
                  <p className="text-xs text-text-muted">{ach.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      <div className="md:col-span-2 space-y-5">
        <Card>
          <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nombre Completo" defaultValue="Juan Pérez" leftIcon={<User className="h-4 w-4" />} />
                <Input label="Teléfono" defaultValue="+1 234 567 890" leftIcon={<Phone className="h-4 w-4" />} />
              </div>
              <Input label="Correo Electrónico" type="email" defaultValue="juan.perez@example.com" leftIcon={<Mail className="h-4 w-4" />} />
              <Input label="Dirección Principal" defaultValue="Av. Principal 123, Zona Centro" leftIcon={<MapPin className="h-4 w-4" />} />
              <div className="pt-4 flex justify-end gap-3 border-t border-border-light">
                <Button variant="ghost" size="sm">Cancelar</Button>
                <Button size="sm">Guardar Cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Seguridad de la Cuenta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Contraseña', desc: 'Última actualización hace 3 meses', action: 'Cambiar', variant: 'muted' },
              { label: 'Autenticación 2FA', desc: 'No configurada — Recomendado activarla', action: 'Activar', variant: 'primary' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border-light hover:border-border transition-colors">
                <div>
                  <p className="font-semibold text-text-primary text-sm">{item.label}</p>
                  <p className={`text-xs mt-0.5 ${item.variant === 'primary' ? 'text-warning' : 'text-text-muted'}`}>{item.desc}</p>
                </div>
                <Button variant={item.variant} size="xs">{item.action}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default ProfilePage;
