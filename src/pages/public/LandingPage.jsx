import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, Zap, Target, Lock, CheckCircle, Users, Building, Plus, Flame, Car, ShieldAlert, Radio, Construction, Github, Linkedin } from 'lucide-react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import Button from '../../components/ui/Button';
import { ButtonColorful } from '../../components/ui/button-colorful';
import { InteractiveSelector } from '../../components/ui/interactive-selector';

// --- BUBBLE COMPONENT FOR HERO ---
const FloatingBubble = ({ title, reporter, icon: Icon, delay, x, y, type = 'primary', duration = 8 }) => {
  const theme = {
    danger: { bg: 'bg-danger/10', text: 'text-danger', glow: 'shadow-[0_0_40px_rgba(231,111,81,0.25)]', border: 'border-danger/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', glow: 'shadow-[0_0_40px_rgba(221,161,94,0.25)]', border: 'border-warning/20' },
    success: { bg: 'bg-success/10', text: 'text-success', glow: 'shadow-[0_0_40px_rgba(107,163,104,0.25)]', border: 'border-success/20' },
    primary: { bg: 'bg-primary/10', text: 'text-primary', glow: 'shadow-[0_0_40px_rgba(76,159,112,0.25)]', border: 'border-primary/20' }
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
      className={`absolute hidden lg:block z-20 ${x} ${y}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.5, delay: delay + 0.3, repeat: Infinity, repeatDelay: 3 }}
        className={`absolute inset-0 rounded-2xl ${theme.bg} z-[-1] pointer-events-none`}
      />
      <motion.div
        animate={{ y: [0, -10, 8, -4, 0], x: [0, 8, -8, 4, 0] }}
        transition={{ repeat: Infinity, duration: duration, ease: "easeInOut", delay: delay }}
        whileHover={{ scale: 1.05, cursor: "pointer" }}
        className={`glass-premium p-3.5 pr-6 rounded-2xl border ${theme.border} ${theme.glow} flex items-center gap-3.5 transition-shadow relative overflow-hidden`}
      >
        <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${theme.text}`} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-text-primary text-sm leading-tight">{title}</span>
          <span className="text-[11px] text-text-muted font-medium mt-0.5">Reportado por {reporter}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- INTERACTIVE TILT CARD ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [3, -3]);
  const rotateY = useTransform(x, [-100, 100], [-3, 3]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- STAGGER VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

// --- MAIN PAGE ---
const LandingPage = () => {
  const { scrollY } = useScroll();
  const parallaxY1 = useTransform(scrollY, [0, 2000], [0, -150]);

  // Spotlight Tracking
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const heroYOffset = useTransform(scrollY, [0, 1000], [0, 150]);

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-bg overflow-hidden font-sans relative selection:bg-primary/20">
      {/* ── GLOBAL NOISE OVERLAY ── */}
      <div className="noise-overlay" />
      
      {/* ── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section 
        className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 flex flex-col items-center text-center px-4 min-h-[90vh] overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight Mouse Orb */}
        <motion.div 
          className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full blur-[120px] pointer-events-none z-0 opacity-60 mix-blend-multiply"
          style={{ 
            left: springX, top: springY, translateX: "-50%", translateY: "-50%",
            background: "radial-gradient(circle, rgba(76,159,112,0.15) 0%, rgba(76,159,112,0) 70%)",
            y: heroYOffset
          }}
        />
        {/* Aurora Background Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4C9F70]/5 rounded-full blur-[100px] pointer-events-none z-0 aurora-orb-1 mix-blend-multiply" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] bg-[#D6A663]/5 rounded-full blur-[120px] pointer-events-none z-0 aurora-orb-2 mix-blend-multiply" />

        <FloatingBubble title="Incendio en Av. Ormachea" reporter="Junta Vecinal Obrajes" icon={AlertTriangle} delay={0.2} x="left-[3%]" y="top-[15%]" type="danger" duration={12} />
        <FloatingBubble title="Bloqueo en Plaza Murillo" reporter="Sergio Arias" icon={Target} delay={0.5} x="right-[5%]" y="top-[22%]" type="warning" duration={14} />
        <FloatingBubble title="Accidente en Av. del Poeta" reporter="Christian Coronel" icon={Activity} delay={0.8} x="left-[8%]" y="bottom-[18%]" type="danger" duration={10} />
        <FloatingBubble title="Robo en San Francisco" reporter="Alan Flores" icon={ShieldAlert} delay={1.1} x="right-[2%]" y="bottom-[25%]" type="primary" duration={15} />
        <FloatingBubble title="Emergencia Médica" reporter="Jean Marco" icon={Plus} delay={1.4} x="right-[22%]" y="top-[5%]" type="success" duration={11} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold font-display text-text-primary tracking-tighter leading-[1.05] mb-8">
              La ciudad,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F5D50] via-[#4C9F70] to-[#D6A663]">
                protegida por todos.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-medium tracking-tight">
              La plataforma definitiva que transforma a los ciudadanos en una red de inteligencia colectiva para emergencias en tiempo real.
            </p>
            
            <div className="flex justify-center mb-10">
              <Link to="/register"><ButtonColorful label="Únete a la Red" /></Link>
            </div>
            
            <div className="flex justify-center items-center gap-8 text-sm text-text-muted font-medium tracking-wide">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Sin burocracia</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Privacidad total</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. THE BOTTLENECK SECTION (Premium Glass Bento) ─────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <TiltCard className="lg:col-span-5 glass-premium rounded-[2.5rem] p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl transition-shadow duration-500 cursor-default">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                El Problema
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-display text-text-primary mb-6 leading-[1.1] tracking-tight">
                Conoces la burocracia.<br />Vamos a romperla.
              </h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Las llamadas al 911 se pierden, los reportes se duplican y las autoridades llegan tarde. Halo unifica la información ciudadana filtrando el ruido mediante validación comunitaria.
              </p>
            </div>
            <div className="relative z-10">
              <Link to="/admin">
                <Button variant="secondary" className="w-max glass-premium text-primary border border-white/80 shadow-lg hover:shadow-xl hover:bg-white transition-all rounded-xl font-bold hover:scale-105 transform">
                  Explorar el Portal de Autoridades
                </Button>
              </Link>
            </div>
            {/* Inner Aurora */}
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4C9F70]/10 rounded-full blur-[80px]" />
          </TiltCard>

          <motion.div 
            style={{ y: parallaxY1 }}
            className="lg:col-span-7 glass-premium rounded-[2.5rem] p-10 lg:p-12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12"
          >
            <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-border-light/50 pb-8 sm:pb-0 sm:pr-8 group cursor-pointer">
              <h3 className="text-6xl lg:text-7xl font-bold font-display text-text-primary mb-3 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500 text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-muted">15k+</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Ciudadanos activos validando información en tiempo real.</p>
            </div>
            <div className="flex flex-col justify-center pb-8 sm:pb-0 border-b border-border-light/50 group cursor-pointer">
              <h3 className="text-6xl lg:text-7xl font-bold font-display text-text-primary mb-3 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500 text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-muted">4.2m</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Tiempo de respuesta promedio mejorado gracias al GPS.</p>
            </div>
            <div className="flex flex-col justify-center sm:border-r border-border-light/50 pt-8 sm:pt-0 sm:pr-8 group cursor-pointer">
              <h3 className="text-6xl lg:text-7xl font-bold font-display text-text-primary mb-3 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500 text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-muted">99%</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Precisión de reportes mediante el sistema de Trust Score.</p>
            </div>
            <div className="flex flex-col justify-center pt-8 sm:pt-0 group cursor-pointer">
              <h3 className="text-6xl lg:text-7xl font-bold font-display text-text-primary mb-3 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500 text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-muted">24/7</h3>
              <p className="text-text-secondary font-medium leading-relaxed">Monitoreo ininterrumpido sin cajas negras ni desinformación.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. INTERACTIVE SHOWCASE ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 glass-premium rounded-2xl mb-8 transition-transform hover:rotate-12 cursor-pointer shadow-lg border border-white/60">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary mb-12 tracking-tight">
            Todo lo que necesitas, en un solo lugar
          </h2>
          
          <div className="w-full">
            <InteractiveSelector />
          </div>
        </div>
      </section>

      {/* ── 4. HOW HALO TRANSFORMS (Staggered Glass Cards) ───────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-text-primary leading-[1.05] tracking-tighter">
            Cómo Halo transforma<br />la seguridad
          </h2>
          <p className="text-text-secondary max-w-md text-lg leading-relaxed">
            Un flujo de trabajo optimizado para garantizar que la información fluya sin fricción desde el ciudadano hasta los cuerpos de emergencia.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: AlertTriangle, title: 'Reporte Inmediato', desc: 'Envía alertas con foto y ubicación exacta en segundos.' },
            { icon: Users, title: 'Validación Vecinal', desc: 'La comunidad confirma el incidente para evitar falsas alarmas.' },
            { icon: Zap, title: 'Despliegue Rápido', desc: 'Las autoridades reciben datos filtrados para actuar al instante.' },
            { icon: Lock, title: 'Resolución Transparente', desc: 'Haz seguimiento del caso hasta su cierre definitivo.' }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-premium rounded-3xl p-8 hover:shadow-[0_20px_40px_rgb(76,159,112,0.1)] transition-all flex flex-col h-full cursor-default group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-border-light flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-12 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display tracking-tight">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-grow">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 5. EL EQUIPO DETRÁS DE HALO ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-text-primary mb-6 tracking-tighter leading-[1.05]">
              Construido por ciudadanos,<br />para ciudadanos.
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Nacimos de la frustración de reportar y no ser escuchados. Nos unimos para crear la red de seguridad comunitaria más moderna y transparente.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { name: 'Alan Flores', role: 'Fullstack Developer', initials: 'AF' },
            { name: 'Christian Coronel', role: 'Backend / DevOps', initials: 'CC' },
            { name: 'Jean Marco', role: 'Frontend Architect', initials: 'JM' },
            { name: 'Sergio Arias', role: 'UI/UX Designer', initials: 'SA' }
          ].map((dev, idx) => (
            <motion.div 
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -15 }}
              className="glass-premium rounded-[2rem] p-8 hover:shadow-2xl transition-all text-center group cursor-pointer"
            >
              <div className="w-28 h-28 mx-auto rounded-full bg-white shadow-sm border border-white/50 flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500">
                <span className="text-3xl font-bold text-primary font-display">{dev.initials}</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary font-display tracking-tight">{dev.name}</h3>
              <p className="text-sm text-text-secondary mb-6 font-medium">{dev.role}</p>
              
              <div className="flex justify-center gap-3">
                <motion.a whileHover={{ scale: 1.2, rotate: 5 }} href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-border-light/50 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.2, rotate: -5 }} href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-border-light/50 flex items-center justify-center text-text-muted hover:text-[#0077b5] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 6. ANIMATED DARK CTA (Gradient Pan) ────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-animated-gradient rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl cursor-pointer"
        >
          {/* Glass Overlay on the CTA */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
          
          <div className="relative z-10 w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-[1.05] tracking-tighter">
              Acelera el tiempo de respuesta. Protege tu entorno.
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Únete a la plataforma que está redefiniendo cómo las ciudades manejan las emergencias en tiempo real.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-[#2F5D50] hover:bg-white/90 text-lg px-10 py-6 h-auto rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1">
                Comenzar ahora
              </Button>
            </Link>
          </div>

          <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end">
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [2, 0, 2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-sm w-full transition-transform duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center relative">
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white shadow-sm" />
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-base">Central de Policía</h4>
                  <p className="text-xs text-text-secondary font-medium">Escribiendo...</p>
                </div>
              </div>
              <p className="text-text-primary font-medium text-lg leading-relaxed">
                "Perfecto, la unidad ha sido despachada al lugar del incidente reportado. ETA: 3 mins."
              </p>
              <div className="mt-6 flex gap-2">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="h-2 w-12 bg-border-light rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="h-2 w-8 bg-primary/30 rounded-full" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── 7. INTEGRATIONS / CONNECTIONS WALL ─────────────────────────────── */}
      <section className="py-24 relative overflow-hidden text-center z-10">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-12 tracking-tight">
          Halo conecta a la ciudad con:
        </h2>
        
        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {[
            { name: 'Policia Nacional', icon: Shield, desc: 'Despacho directo ante reportes de delitos y emergencias de seguridad.' },
            { name: 'Bomberos', icon: Flame, desc: 'Coordinacion inmediata para combatir incendios y rescates.' },
            { name: 'Ambulancias', icon: Activity, desc: 'Envio urgente para emergencias medicas y traslados criticos.' },
            { name: 'Juntas Vecinales', icon: Users, desc: 'Validacion barrial activa de incidentes para evitar falsas alarmas.' },
            { name: 'Transito', icon: Car, desc: 'Gestion y alertas de congestion vehicular o colisiones.' },
            { name: 'Alcaldias', icon: Building, desc: 'Canalizacion directa para fallas de luminarias, baches y obras.' },
            { name: 'Defensa Civil', icon: ShieldAlert, desc: 'Respuesta ante desastres naturales e inundaciones climaticas.' },
            { name: 'Centros Medicos', icon: Plus, desc: 'Comunicacion con centros de salud y disponibilidad de camillas.' },
            { name: 'Radio Patrullas', icon: Radio, desc: 'Seguimiento satelital y radiocomunicaciones de patrullas moviles.' },
            { name: 'Obras Publicas', icon: Construction, desc: 'Reparacion de semaforos y daños en la infraestructura vial.' },
          ].map((entity, idx) => (
            <motion.div 
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -6, scale: 1.02, borderColor: '#4C9F70', backgroundColor: 'rgba(255,255,255,0.95)' }}
              transition={{ type: "spring", stiffness: 400 }}
              className="glass-premium rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-4 group cursor-pointer border border-white/40 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <entity.icon className="w-6 h-6 transition-transform group-hover:rotate-12 duration-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors mb-2 font-display">
                  {entity.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  {entity.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
};

export default LandingPage;
