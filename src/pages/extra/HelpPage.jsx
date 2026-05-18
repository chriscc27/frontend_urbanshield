import React, { useState } from 'react';
import { HelpCircle, MessageCircle, FileText, Phone, ChevronDown, ChevronRight, Search } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const faqs = [
  { q: '¿Cómo reporto un incidente?', a: 'Ve a "Nuevo Reporte", selecciona la categoría del incidente, completa la descripción y activa tu GPS para compartir la ubicación exacta. El reporte llega a las autoridades en segundos.' },
  { q: '¿Cuánto tarda la respuesta a un reporte?', a: 'El tiempo promedio de respuesta es de 14 minutos. Los incidentes críticos (Incendio, Emergencia Médica) tienen prioridad absoluta en el sistema.' },
  { q: '¿Puedo subir fotos al reportar?', a: 'Sí, puedes subir hasta 5 imágenes en formatos PNG, JPG o WEBP. Las evidencias fotográficas aceleran significativamente la respuesta de las autoridades.' },
  { q: '¿Cómo sé el estado de mi reporte?', a: 'Puedes ver el estado en tiempo real en "Mis Reportes". Recibirás notificaciones push y por email cada vez que el estado cambie.' },
  { q: '¿La aplicación funciona sin internet?', a: 'Actualmente la plataforma requiere conexión a internet. Estamos trabajando en un modo offline básico para reportes de emergencia.' },
];

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-primary font-display">Centro de Ayuda</h2>
        <p className="text-text-secondary text-sm mt-1">Encuentra respuestas o contacta con nuestro equipo.</p>
      </div>

      <Input placeholder="Busca tu pregunta aquí..." leftIcon={<Search className="h-4 w-4" />} className="py-3" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Documentación', desc: 'Guías y tutoriales', color: 'text-primary', bg: 'bg-primary/8 border-primary/15' },
          { icon: Phone, label: 'Líneas de Emergencia', desc: 'Bomberos, Policía, Amb.', color: 'text-danger', bg: 'bg-danger/8 border-danger/15' },
          { icon: MessageCircle, label: 'Soporte Técnico', desc: 'Respuesta en 24h', color: 'text-accent-dark', bg: 'bg-accent/8 border-accent/15' },
        ].map((item, i) => (
          <Card key={i} hover className={`border ${item.bg.split(' ')[1]}`}>
            <CardContent className="p-5 text-center">
              <div className={`h-12 w-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3 border`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-text-primary text-sm mb-1">{item.label}</h3>
              <p className="text-xs text-text-secondary">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <HelpCircle className="h-5 w-5 text-primary" />
            Preguntas Frecuentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b last:border-b-0 border-border-light">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-hover transition-colors"
              >
                <span className="text-sm font-semibold text-text-primary">{faq.q}</span>
                {openFaq === i
                  ? <ChevronDown className="h-4 w-4 text-primary flex-shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-text-muted flex-shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 animate-fade-in">
                  <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5 text-accent-dark" />
            Contactar a Soporte Técnico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Asunto" placeholder="Ej: No puedo subir imágenes al reporte" />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Mensaje</label>
              <textarea
                className="block w-full rounded-xl text-text-primary text-sm bg-white border border-border placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 hover:border-border-strong transition-all py-2.5 px-4 resize-none shadow-sm"
                rows={4}
                placeholder="Describe tu problema con el mayor detalle posible..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" type="button">Cancelar</Button>
              <Button type="submit" size="sm">Enviar Mensaje</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
