import React, { useState } from 'react';
import { User, Mail, Phone, Camera } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { listReports } from '../../services/reportsApi';
import { updateProfile, updatePassword } from '../../services/authApi';
import { getApiErrorMessage } from '../../services/api';
import { useAsyncData } from '../../hooks/useAsyncData';

const ProfilePage = () => {
  const { user, login } = useAuth(); // login actually updates context? authContext might have a refreshProfile method. Wait, in AuthContext, we can just do window.location.reload() or we assume the page will re-render.
  const { data } = useAsyncData(() => listReports({ limit: 100 }), []);
  const all = data?.data || [];
  const resolved = all.filter((r) => r.status === 'resolved').length;
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'US';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      alert('Perfil actualizado con éxito');
      setIsEditing(false);
      window.location.reload(); // Simple way to refresh AuthContext
    } catch (err) {
      alert(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      return alert('Las contraseñas nuevas no coinciden');
    }
    setPwdLoading(true);
    try {
      await updatePassword({ currentPassword: pwdData.currentPassword, newPassword: pwdData.newPassword });
      alert('Contraseña actualizada con éxito');
      setShowPasswordForm(false);
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(getApiErrorMessage(err));
    } finally {
      setPwdLoading(false);
    }
  };

  return (
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
                <span className="text-4xl font-bold text-primary font-display">{initials}</span>
              </div>
              <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary rounded-full border-2 border-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-text-primary font-display">{user?.name || 'Usuario'}</h3>
            <p className="text-sm text-text-secondary mb-4">{user?.role === 'admin' ? 'Administrador' : 'Ciudadano'}</p>
            <div className="flex justify-center gap-2 mb-5">
              <Badge variant={user?.trustScore >= 80 ? 'success' : user?.trustScore < 20 ? 'danger' : 'accent'} dot>
                {user?.trustScore >= 80 ? 'Ciudadano Ejemplar' : user?.trustScore < 20 ? 'En Observación' : 'Ciudadano Activo'}
              </Badge>
            </div>
            <div className="space-y-3 pt-4 border-t border-border-light text-left">
              {[
                { label: 'Reportes Totales', value: String(all.length) },
                { label: 'Resueltos', value: String(resolved) },
                { label: 'Precisión GPS', value: '100%' },
                { label: 'Confianza', value: `${user?.trustScore || 50} pts` },
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
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Información Personal</CardTitle>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Nombre Completo" 
                  value={isEditing ? formData.name : (user?.name || '')} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={!isEditing} 
                  leftIcon={<User className="h-4 w-4" />} 
                />
                <Input 
                  label="Teléfono" 
                  value={isEditing ? formData.phone : (user?.phone || '—')} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  readOnly={!isEditing} 
                  leftIcon={<Phone className="h-4 w-4" />} 
                />
              </div>
              <Input label="Correo Electrónico" type="email" defaultValue={user?.email || ''} readOnly leftIcon={<Mail className="h-4 w-4" />} />
              
              {isEditing && (
                <div className="pt-4 flex justify-end gap-3 border-t border-border-light">
                  <Button variant="ghost" size="sm" type="button" onClick={() => { setIsEditing(false); setFormData({name: user?.name, phone: user?.phone}); }}>Cancelar</Button>
                  <Button size="sm" type="submit" isLoading={loading}>Guardar Cambios</Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Seguridad de la Cuenta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {showPasswordForm ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 p-4 rounded-xl bg-muted border border-border-light">
                <Input 
                  label="Contraseña Actual" 
                  type="password" 
                  required
                  value={pwdData.currentPassword}
                  onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})}
                />
                <Input 
                  label="Nueva Contraseña" 
                  type="password" 
                  required
                  value={pwdData.newPassword}
                  onChange={e => setPwdData({...pwdData, newPassword: e.target.value})}
                />
                <Input 
                  label="Confirmar Nueva Contraseña" 
                  type="password" 
                  required
                  value={pwdData.confirmPassword}
                  onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowPasswordForm(false)}>Cancelar</Button>
                  <Button size="sm" type="submit" isLoading={pwdLoading}>Actualizar Contraseña</Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border-light hover:border-border transition-colors">
                <div>
                  <p className="font-semibold text-text-primary text-sm">Contraseña</p>
                  <p className="text-xs mt-0.5 text-text-muted">Protege el acceso a tu cuenta</p>
                </div>
                <Button variant="muted" size="xs" onClick={() => setShowPasswordForm(true)}>Cambiar</Button>
              </div>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border-light hover:border-border transition-colors">
              <div>
                <p className="font-semibold text-text-primary text-sm">Autenticación 2FA</p>
                <p className="text-xs mt-0.5 text-warning">No configurada — Recomendado activarla</p>
              </div>
              <Button variant="primary" size="xs">Activar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  );
};

export default ProfilePage;
