
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useSpring, useInView, animate, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faWhatsapp, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { NAV_ITEMS, LOGO_URL, LOGO_NIGHT_URL, HERO_IMG, AWARD_IMG, SERVICES, PARTNERS, API_URL } from './constants';
import Partners from './Partners';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SectionHeader: React.FC<{ title: string; subtitle: string; centered?: boolean }> = ({ title, subtitle, centered = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`mb-16 ${centered ? 'text-center' : 'text-left'}`}
  >
    <h2 className="font-display text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4">{subtitle}</h2>
    <h3 className="font-display text-4xl md:text-5xl font-extrabold text-primary dark:text-white leading-tight">
      {title}
    </h3>
    <div className={`h-1 w-20 bg-accent mt-6 ${centered ? 'mx-auto' : ''}`} />
  </motion.div>
);

const Counter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ value, suffix = "", duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 }); // Trigger when at least 50% visible

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: "circOut",
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
      return () => controls.stop();
    } else {
      setCount(0); // Reset when out of view
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const AnimatedConnectionLine: React.FC = () => {
  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="gradient-bright" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Branch 1: Top - Left to Right Wave */}
        <motion.path
          d="M -200 200 Q 200 100 600 200 T 1600 200"
          fill="none"
          stroke="url(#gradient-bright)"
          strokeWidth="4"
          filter="drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          animate={{
            x: [0, 100, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Branch 2: Middle - Right to Left Wave */}
        <motion.path
          d="M 1600 450 Q 1200 350 800 450 T -200 450"
          fill="none"
          stroke="url(#gradient-bright)"
          strokeWidth="4"
          filter="drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          animate={{
            x: [0, -90, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        />

        {/* Branch 3: Bottom - Left to Right Wave */}
        <motion.path
          d="M -200 700 Q 200 600 600 700 T 1600 700"
          fill="none"
          stroke="url(#gradient-bright)"
          strokeWidth="4"
          filter="drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          animate={{
            x: [0, 110, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </svg>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Consultation form states
  const [consultFormName, setConsultFormName] = useState('');
  const [consultFormPhone, setConsultFormPhone] = useState('');
  const [consultFormEmail, setConsultFormEmail] = useState('');
  const [consultFormInterest, setConsultFormInterest] = useState('');
  const [consultFormType, setConsultFormType] = useState('Free');
  const [consultFormSubmitting, setConsultFormSubmitting] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultFormSubmitting(true);
    try {
      await axios.post(`${API_URL}/consultation`, {
        name: consultFormName,
        phone: consultFormPhone,
        email: consultFormEmail,
        interest: consultFormInterest,
        type: consultFormType,
      });
      toast.success('Session Requested! Talk to you soon.');
      setIsConsultationOpen(false);
      // Reset form
      setConsultFormName('');
      setConsultFormPhone('');
      setConsultFormEmail('');
      setConsultFormInterest('');
      setConsultFormType('Free');
    } catch (error) {
      toast.error('Failed to request session. Please try again.');
    } finally {
      setConsultFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-500 selection:bg-accent/30 font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left" style={{ scaleX }} />

      {/* Navbar - Refined split layout */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/80 dark:bg-bg-dark/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-500 h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="flex justify-between items-center">
            {/* Left: Logo Only */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src={isDarkMode ? LOGO_NIGHT_URL : LOGO_URL} alt="Ridge Logo" className="h-20 md:h-24 w-auto relative object-contain transition-transform duration-500 group-hover:scale-105 rounded-xl" />
              </div>
            </motion.div>

            {/* Right: Navigation, Branding, and CTAs */}
            <div className="flex items-center">
              {/* Desktop Links */}
              <div className="hidden lg:flex items-center space-x-10 mr-12">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="relative py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-all duration-300"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 hover:w-full" />
                  </a>
                ))}
              </div>

              {/* Company Branding & Call to Action Container */}
              <div className="hidden md:flex items-center space-x-8 pl-8 border-l border-slate-200 dark:border-slate-600">
                <div className="text-right">
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display font-black text-primary dark:text-white text-lg lg:text-xl leading-none uppercase tracking-tighter"
                  >
                    RIDGE EDUCATIONAL SERVICES
                  </motion.p>
                  <p className="text-accent text-[9px] font-black tracking-[0.5em] uppercase mt-1">CREATING THE FUTURE</p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  >
                    <span className="material-icons text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                  </button>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden xl:block bg-transparent border-[1.5px] border-primary dark:border-white text-primary dark:text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(10, 29, 55, 0.1), 0 10px 10px -5px rgba(10, 29, 55, 0.04)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsConsultationOpen(true)}
                    className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Consultation
                  </motion.button>
                </div>
              </div>

              {/* Mobile Toggle */}
              <div className="md:hidden flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-primary dark:text-white">
                  <span className="material-icons">menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[70] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white dark:bg-slate-900 z-[80] md:hidden shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <img src={isDarkMode ? LOGO_NIGHT_URL : LOGO_URL} alt="Logo" className="h-16 object-contain rounded-xl" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-primary dark:text-white">
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="mb-12">
                <p className="font-display font-black text-primary dark:text-white text-xl leading-tight uppercase tracking-tighter">RIDGE EDUCATIONAL SERVICES</p>
                <p className="text-accent text-[10px] font-black tracking-[0.4em] uppercase mt-2">CREATING THE FUTURE</p>
              </div>

              <div className="space-y-6 mb-auto">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-3xl font-display font-black text-slate-800 dark:text-white hover:text-accent transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <Link to="/login" className="block">
                  <button className="w-full bg-slate-50 dark:bg-slate-800 text-primary dark:text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-slate-200 dark:shadow-slate-900 border border-slate-200 dark:border-slate-700">
                    Staff Login
                  </button>
                </Link>
                <button
                  onClick={() => { setIsConsultationOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
                >
                  Consultation
                </button>
                <button onClick={toggleDarkMode} className="w-full py-5 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
                  {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(229,160,26,0.18),transparent_60%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(229,160,26,0.1),transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-white space-y-10"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-accent text-xs font-black uppercase tracking-[0.2em]"
                >
                  <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
                  Estd 2013 | Trusted Admissions Partner
                </motion.div>

                <h1 className="font-display text-6xl md:text-8xl font-black leading-[1] tracking-tight">
                  Design Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-400 to-accent bg-[length:200%_auto] animate-gradient">Global Future.</span>
                </h1>

                <p className="text-xl text-slate-300 leading-relaxed max-w-xl font-medium">
                  Navigate the complexities of college admissions with India's most trusted educational consultants. Professional guidance for over a decade.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5, boxShadow: "0 25px 50px -12px rgba(229, 160, 26, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-accent text-primary font-black px-12 py-6 rounded-[2rem] shadow-2xl transition-all text-xl uppercase tracking-widest"
                  >
                    Apply Now 2025
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, bg: "rgba(255,255,255,0.15)" }}
                    className="bg-white/5 backdrop-blur-xl border border-white/20 text-white font-black px-12 py-6 rounded-[2rem] transition-all text-xl uppercase tracking-widest"
                  >
                    Our Expertise
                  </motion.button>
                </div>

                <div className="flex items-center gap-16 pt-12">
                  <div className="space-y-1">
                    <p className="text-5xl font-display font-black text-white">
                      <Counter value={10} suffix="+" />
                    </p>
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Years Legacy</p>
                  </div>
                  <div className="h-14 w-[1px] bg-white/20" />
                  <div className="space-y-1">
                    <p className="text-5xl font-display font-black text-white">
                      <Counter value={5000} suffix="+" />
                    </p>
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Success Stories</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute -inset-10 bg-accent/20 rounded-[4rem] blur-[100px] animate-pulse" />
                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-slate-50 group">
                  <img
                    src={HERO_IMG}
                    alt="Success Students"
                    className="w-full object-cover aspect-[4/5] transform group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-100 brightness-[1.15] contrast-[1.05] saturate-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-12 left-10 right-10 p-8 rounded-[2rem] bg-primary border border-white/10 text-center transform group-hover:-translate-y-4 transition-transform duration-700 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
                    <div className="relative z-10">
                      <p className="text-white text-lg font-bold italic leading-snug">"The mentorship We provide was pivotal in choosing the right path."</p>
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="h-[1px] w-8 bg-accent" />
                        <p className="text-accent text-[11px] font-black uppercase tracking-[0.3em]">Top Tier Education</p>
                        <div className="h-[1px] w-8 bg-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-40 bg-white dark:bg-bg-dark transition-colors duration-500 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="relative order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -100 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10"
                >
                  <img src={AWARD_IMG} alt="Awards" className="rounded-[3rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] w-full relative z-20" />

                  {/* Floating Recognition Card */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-16 -right-12 bg-primary p-10 rounded-[3rem] shadow-2xl z-30 max-w-[320px] border border-white/10"
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center">
                        <span className="material-icons text-accent text-4xl">workspace_premium</span>
                      </div>
                      <div>
                        <p className="font-display font-black text-3xl text-white">Winner</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultant 2024</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                      "Awarded for exceptional service and student placement metrics across India."
                    </p>
                  </motion.div>
                </motion.div>
                <div className="absolute top-20 left-20 w-full h-full border-[12px] border-slate-50 dark:border-slate-800/30 rounded-[4rem] -z-10" />
              </div>

              <div className="order-1 lg:order-2 space-y-10">
                <SectionHeader title="A Decade of Shaping Careers" subtitle="About Ridge Educational" centered={false} />
                <p className="text-2xl text-slate-800 dark:text-slate-200 font-bold leading-tight">
                  We bridge the gap between your aspirations and world-class institutions.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Established in 2013, Ridge Educational Services has emerged as the leading beacon for students seeking quality higher education. We don't just process applications; we architect careers through personalized mentorship and deep industry connections.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  {[
                    { icon: 'verified_user', title: 'Certified Expertise', desc: 'Authorised admissions partner.' },
                    { icon: 'auto_graph', title: 'Data Driven', desc: 'Predictive college placement tech.' }
                  ].map((feat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group transition-all"
                    >
                      <span className="material-icons text-accent text-3xl mb-4 block group-hover:scale-125 transition-transform">{feat.icon}</span>
                      <h5 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">{feat.title}</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{feat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-40 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500 relative">
          <AnimatedConnectionLine />
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <SectionHeader title="End-to-End Educational Consulting" subtitle="Our Specializations" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_50px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-200 dark:border-slate-700/50 flex flex-col group"
                >
                  <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <span className="material-icons text-4xl group-hover:rotate-[360deg] transition-transform duration-700">{service.icon}</span>
                  </div>
                  <h4 className="text-3xl font-display font-black mb-6 dark:text-white leading-tight">{service.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow font-medium">{service.description}</p>
                  <button className="flex items-center gap-3 text-accent font-black text-sm uppercase tracking-[0.2em] group/btn">
                    Details
                    <span className="material-icons text-xl group-hover/btn:translate-x-3 transition-transform duration-300">arrow_forward</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Experience */}
        <Partners isDarkMode={isDarkMode} />

        {/* Final CTA */}
        <section className="py-40 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-primary" />
          </div>
          <AnimatedConnectionLine />
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="font-display text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Your Future Deserves <br /> <span className="text-accent italic font-serif">the Best Guidance.</span>
              </h2>
              <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
                Admissions for the 2025 academic session are now open. Don't leave your education to chance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsConsultationOpen(true)}
                  className="bg-accent text-primary px-16 py-8 rounded-[2.5rem] font-black text-2xl shadow-[0_25px_50px_-12px_rgba(229,160,26,0.3)] transition-all uppercase tracking-widest"
                >
                  Consultation
                </motion.button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/20 text-white font-black px-16 py-8 rounded-[2.5rem] transition-all text-2xl uppercase tracking-widest">
                  Contact Office
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#020617] text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-24">
            <div className="space-y-10 max-w-lg">
              <div className="flex items-center gap-8">
                <img src={LOGO_NIGHT_URL} alt="Logo" className="h-28 object-contain rounded-xl" />
                <div>
                  <h5 className="font-display font-black text-3xl tracking-tighter uppercase text-white">RIDGE EDUCATIONAL</h5>
                  <p className="text-accent text-[11px] font-black tracking-[0.5em] uppercase mt-1">Services</p>
                </div>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed font-medium">
                Leading the way in premium educational consulting since 2013. We believe every student has a unique path to greatness.
              </p>
              <div className="flex gap-6">
                <a href="#" className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-500">
                  <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
                </a>
                <a href="#" className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-500">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
                </a>
                <a href="https://www.instagram.com/ridgeeducationalservice?igsh=MWRyamVsd2gydjhkNQ==" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-500">
                  <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                </a>
                <a href="#" className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-500">
                  <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-20">
              <div className="space-y-8">
                <h6 className="text-sm font-black text-accent uppercase tracking-[0.3em]">Explore</h6>
                <ul className="space-y-5">
                  {NAV_ITEMS.map(n => (
                    <li key={n.label}><a href={n.href} className="text-slate-500 hover:text-white transition-colors font-bold text-lg">{n.label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="space-y-8">
                <h6 className="text-sm font-black text-accent uppercase tracking-[0.3em]">Quick Contact</h6>
                <ul className="space-y-6 text-slate-500 font-bold">
                  <li className="flex gap-4"><span className="material-icons text-accent">email</span> ridgeeducationalservices@gmail.com</li>
                  <li className="flex gap-4"><span className="material-icons text-accent">call</span> +91 7871000006</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-xs font-black uppercase tracking-[0.3em]">
            <p>© 2024 Ridge Educational Services. Excellence as standard.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsConsultationOpen(true)}
        className="fixed bottom-12 right-12 z-50 w-20 h-20 bg-accent text-primary rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(229,160,26,0.6)] flex items-center justify-center transition-all"
      >
        <span className="material-icons text-4xl">chat_bubble</span>
      </motion.button>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isConsultationOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConsultationOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="p-16 md:p-20">
                <div className="flex justify-between items-start mb-14">
                  <div>
                    <h3 className="text-5xl font-display font-black dark:text-white mb-4 tracking-tighter">Get Started</h3>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic">Our experts will contact you for a personalized roadmap.</p>
                  </div>
                  <button onClick={() => setIsConsultationOpen(false)} className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-icons text-3xl">close</span>
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleConsultationSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                      <input required type="text" value={consultFormName} onChange={e => setConsultFormName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-4 px-6 dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold" placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone</label>
                      <input required type="tel" value={consultFormPhone} onChange={e => setConsultFormPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-4 px-6 dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold" placeholder="+91 ..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                    <input required type="email" value={consultFormEmail} onChange={e => setConsultFormEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-4 px-6 dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold" placeholder="you@example.com" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Academic Interest</label>
                      <select required value={consultFormInterest} onChange={e => setConsultFormInterest(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-4 px-6 dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold appearance-none">
                        <option value="" disabled>Select Interest</option>
                        <option>Engineering Admissions</option>
                        <option>Pharmacy & Medical</option>
                        <option>Arts & Science</option>
                        <option>Scholarship Guidance</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Consultation Type</label>
                      <select required value={consultFormType} onChange={e => setConsultFormType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-4 px-6 dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold appearance-none">
                        <option value="Free">Free</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={consultFormSubmitting}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-white font-black py-5 rounded-3xl shadow-2xl shadow-primary/30 transition-all text-xl uppercase tracking-[0.2em] mt-8 disabled:opacity-50"
                  >
                    {consultFormSubmitting ? 'Sending...' : 'Request Session'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
