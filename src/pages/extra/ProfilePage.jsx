import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Eye, EyeOff, Check, AlertCircle, Edit2, ShieldCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { listReports } from '../../services/reportsApi';
import { updateProfile } from '../../services/authApi';
import { getPresignedUrl, uploadFileToS3 } from '../../services/uploadsApi';
import { getApiErrorMessage } from '../../services/api';
import { useAsyncData } from '../../hooks/useAsyncData';

// Medidor de contraseña
const calculatePasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length > 7) score += 1;
  if (password.length > 11) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4); // Max 4
};

const getStrengthDetails = (score) => {
  switch (score) {
    case 0: return { label: 'Muy débil', color: 'bg-danger/20', fill: 'bg-danger', width: '20%' };
    case 1: return { label: 'Débil', color: 'bg-danger/40', fill: 'bg-danger', width: '40%' };
    case 2: return { label: 'Aceptable', color: 'bg-warning/40', fill: 'bg-warning', width: '60%' };
    case 3: return { label: 'Buena', color: 'bg-success/60', fill: 'bg-success', width: '80%' };
    case 4: return { label: 'Excelente', color: 'bg-primary/60', fill: 'bg-primary', width: '100%' };
    default: return { label: '', color: 'bg-border', fill: 'bg-transparent', width: '0%' };
  }
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { data } = useAsyncData(() => listReports({ limit: 100 }), []);
  const all = Array.isArray(data) ? data : data?.items || data?.data || [];
  const resolved = all.filter((r) => r.status === 'resolved').length;
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'US';

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  
  // Visibilidad de contraseñas
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);

  const pwdStrength = calculatePasswordStrength(pwdData.newPassword);
  const strengthDetails = getStrengthDetails(pwdStrength);

  const handleAvatarPick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    try {
      const presigned = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        purpose: 'profile',
      });
      const avatarUrl = await uploadFileToS3(file, presigned);
      const nextProfile = {
        name: formData.name || user?.name || '',
        phone: formData.phone || user?.phone || '',
        avatarKey: presigned.key,
        avatarUrl,
      };
      const updated = await updateProfile(nextProfile);
      updateCurrentUser(updated);
      setFormData((prev) => ({ ...prev, avatarKey: presigned.key, avatarUrl }));
    } catch (err) {
      alert(getApiErrorMessage(err));
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      // Actualizamos UI via refresh por ahora
      window.location.reload(); 
    } catch (err) {
      alert(getApiErrorMessage(err));
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
      const { updatePassword } = await import('../../services/authApi');
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
  <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-0 animate-fade-in">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Avatar & Stats Column */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="rounded-[2rem] overflow-hidden shadow-xl border-border-light bg-secondary-bg/20 backdrop-blur-md">
          <div className="h-24 bg-gradient-to-r from-primary via-primary-light to-accent"></div>
          <CardContent className="px-6 pb-6 text-center -mt-12">
            <div className="relative inline-block mb-4">
              <div className="h-28 w-28 rounded-[2rem] bg-card-bg border-4 border-card-bg flex items-center justify-center mx-auto shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                <span className="text-5xl font-bold text-primary font-display relative z-10">{initials}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-full border-4 border-card-bg flex items-center justify-center hover:bg-primary-dark hover:scale-105 transition-all shadow-md group">
                <Camera className="h-4 w-4 text-white group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-text-primary font-display mb-1">{user?.name || 'Usuario'}</h3>
            <p className="text-sm text-text-secondary font-medium mb-4">{user?.role === 'admin' ? 'Administrador' : 'Ciudadano Registrado'}</p>
            
            <div className="flex justify-center mb-6">
              <Badge variant={user?.trustScore >= 80 ? 'success' : user?.trustScore < 20 ? 'danger' : 'accent'} className="shadow-sm py-1.5 px-3">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                {user?.trustScore >= 80 ? 'Ciudadano Ejemplar' : user?.trustScore < 20 ? 'En Observación' : 'Ciudadano Activo'}
              </Badge>
            </div>
            
            <div className="space-y-4 pt-5 border-t border-border-light/50 text-left">
              {[
                { label: 'Reportes Totales', value: String(all.length) },
                { label: 'Reportes Resueltos', value: String(resolved) },
                { label: 'Precisión de Ubicación', value: '100%' },
                { label: 'Nivel de Confianza', value: `${user?.trustScore || 50} pts` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary font-medium">{item.label}</span>
                  <span className="font-bold text-text-primary bg-secondary-bg px-2.5 py-1 rounded-lg">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] shadow-xl border-border-light bg-secondary-bg/20 backdrop-blur-md">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Logros Destacados</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { icon: '🏅', label: 'Primer Reporte', desc: 'Dando los primeros pasos' },
              { icon: '⚡', label: 'Reporte Rápido', desc: 'Enviado en menos de 2 min' },
              { icon: '🎯', label: 'Precisión Perfecta', desc: '+95% de exactitud GPS' },
            ].map((ach, i) => (
              <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-secondary-bg/50 border border-border-light hover:border-border hover:shadow-md transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-white/50 flex items-center justify-center text-2xl shadow-sm border border-white/20">
                  {ach.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{ach.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{ach.desc}</p>
                </div>
                <Input label="Correo Electrónico" type="email" defaultValue={user?.email || ''} readOnly leftIcon={<Mail className="h-4 w-4" />} />

      {/* Info & Security Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Personal Info Display */}
        <Card className="rounded-[2rem] shadow-xl border-border-light bg-secondary-bg/20 backdrop-blur-md">
          <CardHeader className="flex flex-row justify-between items-center border-b border-border-light/50 pb-5">
            <CardTitle>Información Personal</CardTitle>
            <Button variant="primary" size="sm" onClick={() => setShowEditModal(true)} className="rounded-full shadow-lg shadow-primary/20 px-4" leftIcon={<Edit2 className="h-4 w-4" />}>
              Editar
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Nombre Completo</label>
                <div className="flex items-center gap-3 text-text-primary font-medium bg-secondary-bg/40 p-3 rounded-xl border border-border-light/50">
                  <User className="h-5 w-5 text-text-muted" />
                  {user?.name || 'No especificado'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Teléfono</label>
                <div className="flex items-center gap-3 text-text-primary font-medium bg-secondary-bg/40 p-3 rounded-xl border border-border-light/50">
                  <Phone className="h-5 w-5 text-text-muted" />
                  {user?.phone || 'No especificado'}
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Correo Electrónico</label>
                <div className="flex items-center gap-3 text-text-primary font-medium bg-secondary-bg/40 p-3 rounded-xl border border-border-light/50">
                  <Mail className="h-5 w-5 text-text-muted" />
                  {user?.email || 'No especificado'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="rounded-[2rem] shadow-xl border-border-light bg-secondary-bg/20 backdrop-blur-md">
          <CardHeader className="border-b border-border-light/50 pb-5">
            <CardTitle>Seguridad de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            
            <AnimatePresence mode="wait">
              {!showPasswordForm ? (
                <motion.div 
                  key="pwd-summary"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-secondary-bg/40 border border-border-light hover:border-border transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">Contraseña</p>
                      <p className="text-xs mt-0.5 text-text-muted">Protege el acceso a tu cuenta usando una contraseña segura</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(true)} className="rounded-full w-full sm:w-auto">
                    Cambiar Contraseña
                  </Button>
                </motion.div>
              ) : (
                <motion.form 
                  key="pwd-form"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handlePasswordSubmit} 
                  className="space-y-5 p-6 rounded-[1.5rem] bg-secondary-bg/40 border border-border-light shadow-inner overflow-hidden"
                >
                  <div>
                    <h4 className="text-lg font-bold text-text-primary mb-1">Actualizar Contraseña</h4>
                    <p className="text-xs text-text-muted mb-4">Ingresa tu contraseña actual y la nueva que deseas usar.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Current Pwd */}
                    <div className="relative">
                      <Input 
                        label="Contraseña Actual" 
                        type={showCurrentPwd ? "text" : "password"} 
                        required
                        value={pwdData.currentPassword}
                        onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})}
                      />
                      <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-4 top-9 text-text-muted hover:text-text-primary transition-colors">
                        {showCurrentPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* New Pwd */}
                    <div className="relative">
                      <Input 
                        label="Nueva Contraseña" 
                        type={showNewPwd ? "text" : "password"} 
                        required
                        value={pwdData.newPassword}
                        onChange={e => setPwdData({...pwdData, newPassword: e.target.value})}
                      />
                      <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-4 top-9 text-text-muted hover:text-text-primary transition-colors">
                        {showNewPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      
                      {/* Password Strength Meter */}
                      {pwdData.newPassword.length > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Fortaleza</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${strengthDetails.color.replace('bg-', 'text-').replace('/20', '').replace('/40', '').replace('/60', '')}`}>
                              {strengthDetails.label}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-border-light rounded-full overflow-hidden flex gap-1">
                            <motion.div 
                              className={`h-full rounded-full ${strengthDetails.fill}`} 
                              initial={{ width: 0 }}
                              animate={{ width: strengthDetails.width }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Confirm Pwd */}
                    <div className="relative">
                      <Input 
                        label="Confirmar Nueva Contraseña" 
                        type={showConfPwd ? "text" : "password"} 
                        required
                        value={pwdData.confirmPassword}
                        onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})}
                      />
                      <button type="button" onClick={() => setShowConfPwd(!showConfPwd)} className="absolute right-4 top-9 text-text-muted hover:text-text-primary transition-colors">
                        {showConfPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-border-light/50">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowPasswordForm(false)} className="rounded-full">Cancelar</Button>
                    <Button size="sm" type="submit" isLoading={pwdLoading} className="rounded-full shadow-lg shadow-primary/20">Guardar Contraseña</Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </CardContent>
        </Card>
      </div>
    </div>

    {/* EDIT PROFILE MODAL */}
    <AnimatePresence>
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowEditModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card-bg rounded-[2rem] shadow-2xl overflow-hidden border border-border-light/20"
          >
            <div className="p-6 border-b border-border-light/50 bg-secondary-bg/40 flex justify-between items-center">
              <h3 className="text-xl font-bold text-text-primary font-display flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-primary" /> Editar Perfil
              </h3>
            </div>
            
            <form className="p-6 space-y-5" onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <Input 
                  label="Nombre Completo" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  leftIcon={<User className="h-4 w-4" />} 
                  autoFocus
                />
                <Input 
                  label="Número de Teléfono" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  leftIcon={<Phone className="h-4 w-4" />} 
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light/50">
                <Button variant="ghost" size="sm" type="button" onClick={() => { setShowEditModal(false); setFormData({name: user?.name, phone: user?.phone}); }} className="rounded-full">Cancelar</Button>
                <Button size="sm" type="submit" isLoading={loading} className="rounded-full shadow-lg shadow-primary/20 px-6">Guardar Cambios</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

  </div>
  );
};

export default ProfilePage;
