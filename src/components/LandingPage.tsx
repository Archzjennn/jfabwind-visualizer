import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GitMerge, Layers, Table, ShieldCheck, GraduationCap, Wrench, ArrowRight, Sun, Moon, Languages, Target, BookText, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useStore();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [techRef, techInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const timelineProgress = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const timelineWidth = useSpring(timelineProgress, { stiffness: 50, damping: 20 });

  const isDark = theme === 'dark';

  const features = [
    {
      icon: <GitMerge className="w-6 h-6" />,
      color: 'from-violet-500 to-purple-600',
      bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
      border: isDark ? 'border-violet-500/20' : 'border-violet-200',
      iconColor: 'text-violet-500',
      title: lang === 'id' ? 'Konversi Regex → NFA → DFA' : 'Regex → NFA → DFA Conversion',
      desc: lang === 'id'
        ? 'Transformasi ekspresi reguler menjadi graf automata langkah demi langkah secara akurat.'
        : 'Accurate step-by-step transformation of regular expressions into automata graphs.'
    },
    {
      icon: <Layers className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50',
      border: isDark ? 'border-pink-500/20' : 'border-pink-200',
      iconColor: 'text-pink-500',
      title: lang === 'id' ? 'Visualisasi Graf Interaktif' : 'Interactive Graph Visualization',
      desc: lang === 'id'
        ? 'Eksplorasi state, transisi, dan lintasan dengan graf interaktif yang dapat digeser dan diperbesar.'
        : 'Explore states, transitions, and paths with zoomable and draggable interactive graphs.'
    },
    {
      icon: <Table className="w-6 h-6" />,
      color: 'from-sky-500 to-blue-600',
      bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
      border: isDark ? 'border-sky-500/20' : 'border-sky-200',
      iconColor: 'text-sky-500',
      title: lang === 'id' ? 'Tabel Transisi Otomatis' : 'Automatic Transition Table',
      desc: lang === 'id'
        ? 'Tabel transisi terbentuk otomatis dan sinkron dengan visualisasi graf secara real-time.'
        : 'Transition matrices auto-generated and synchronized with live graph visualization.'
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      color: 'from-indigo-500 to-violet-600',
      bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
      border: isDark ? 'border-indigo-500/20' : 'border-indigo-200',
      iconColor: 'text-indigo-500',
      title: lang === 'id' ? 'Regex Builder Visual' : 'Visual Regex Builder',
      desc: lang === 'id'
        ? 'Rancang automata kustom secara visual dan dapatkan ekspresi regulernya secara instan.'
        : 'Visually design custom automata machines and generate regular expressions instantly.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      color: 'from-red-500 to-rose-600',
      bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
      border: isDark ? 'border-red-500/20' : 'border-red-200',
      iconColor: 'text-red-500',
      title: lang === 'id' ? 'Kuis Evaluasi Interaktif' : 'Interactive Evaluation Quiz',
      desc: lang === 'id' 
        ? 'Uji pemahamanmu tentang Regex, NFA, dan DFA melalui kuis dinamis.' 
        : 'Test your knowledge on Regex, NFA, and DFA through dynamic quizzes.'
    },
    {
      icon: <BookText className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-600',
      bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
      border: isDark ? 'border-orange-500/20' : 'border-orange-200',
      iconColor: 'text-orange-500',
      title: lang === 'id' ? 'Kamus Glosarium Lengkap' : 'Comprehensive Glossary',
      desc: lang === 'id' 
        ? 'Pelajari istilah-istilah penting dalam Teori Bahasa dan Automata dengan mudah.' 
        : 'Easily learn key terms and definitions in Formal Language and Automata Theory.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      border: isDark ? 'border-emerald-500/20' : 'border-emerald-200',
      iconColor: 'text-emerald-500',
      title: lang === 'id' ? 'String Tester Real-time' : 'Real-time String Tester',
      desc: lang === 'id'
        ? 'Validasi string masukan secara langsung untuk menguji apakah string diterima atau ditolak.'
        : 'Instant validation of input strings to test acceptance or rejection by the automaton.'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      border: isDark ? 'border-amber-500/20' : 'border-amber-200',
      iconColor: 'text-amber-500',
      title: lang === 'id' ? 'Mode Edukasi Step-by-Step' : 'Step-by-Step Educational Mode',
      desc: lang === 'id'
        ? 'Penjelasan terperinci Thompson Construction dan Subset Construction untuk akademis.'
        : 'Detailed breakdowns of Thompson and Subset Construction algorithms for academic use.'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      color: 'from-slate-500 to-gray-600',
      bg: isDark ? 'bg-slate-500/10' : 'bg-slate-50',
      border: isDark ? 'border-slate-500/20' : 'border-slate-200',
      iconColor: 'text-slate-500',
      title: lang === 'id' ? 'Personalisasi UI & Tema' : 'UI & Theme Customization',
      desc: lang === 'id' 
        ? 'Sesuaikan warna aksen, ukuran font, hingga jadwal tema gelap/terang sesukamu.' 
        : 'Customize accent colors, font sizes, and scheduled dark/light themes to your liking.'
    }
  ];

  const steps = [
    {
      num: '01',
      label: lang === 'id' ? 'Mulai' : 'Start',
      title: lang === 'id' ? 'Input Regex' : 'Input Regex',
      desc: lang === 'id'
        ? 'Masukkan ekspresi reguler ke dalam field input cerdas yang telah dilengkapi validasi dan contoh instan.'
        : 'Enter your regular expression into the intelligent input field with real-time validation and quick examples.',
      accent: 'violet'
    },
    {
      num: '02',
      label: lang === 'id' ? 'Proses' : 'Process',
      title: lang === 'id' ? 'Visualisasi Otomatis' : 'Automatic Visualization',
      desc: lang === 'id'
        ? 'Sistem langsung menghasilkan graf NFA, DFA, dan tabel transisi yang akurat dalam hitungan milidetik.'
        : 'The system instantly computes and renders accurate NFA, DFA graphs and transition tables.',
      accent: 'pink'
    },
    {
      num: '03',
      label: lang === 'id' ? 'Ekspor' : 'Export',
      title: lang === 'id' ? 'Analisis & Export' : 'Analyze & Export',
      desc: lang === 'id'
        ? 'Uji string secara interaktif lalu ekspor hasil sebagai PNG, SVG, atau laporan PDF lengkap.'
        : 'Test strings interactively then export results as PNG, SVG, or a complete PDF report.',
      accent: 'sky'
    }
  ];

  const techs = ['React 19', 'TypeScript', 'Tailwind CSS v3', 'Zustand', 'React Flow', 'Dagre', 'Framer Motion', 'Vite', 'jsPDF'];

  const accentColors: Record<string, string> = {
    violet: isDark ? 'border-violet-500/30 text-violet-400' : 'border-violet-300 text-violet-600',
    pink: isDark ? 'border-pink-500/30 text-pink-400' : 'border-pink-300 text-pink-600',
    sky: isDark ? 'border-sky-500/30 text-sky-400' : 'border-sky-300 text-sky-600',
  };

  const numColors: Record<string, string> = {
    violet: isDark ? 'text-violet-400' : 'text-violet-600',
    pink: isDark ? 'text-pink-400' : 'text-pink-600',
    sky: isDark ? 'text-sky-400' : 'text-sky-600',
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans selection:bg-violet-500 selection:text-white transition-colors duration-300 ${isDark ? 'bg-[#080810]' : 'bg-slate-50 text-slate-900'}`}>

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-pink-500 to-sky-500 origin-left z-50"
      />

      <nav className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 transition-colors duration-300 ${isDark ? 'bg-[#080810]/90 border-b border-white/5' : 'bg-slate-50/90 border-b border-slate-200/80'} sm:backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                src="/LogoJFABWIND.png" 
                alt="JFABWIND Logo" 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
            </div>
            
            <div className="flex flex-col">
              <span className={`font-black text-sm sm:text-base tracking-[0.15em] ${isDark ? 'text-white' : 'text-slate-900'}`}>JFABWIND</span>
              <span className={`text-[9px] tracking-[0.2em] uppercase font-medium hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Joint Finite Automata Builder With Interactive NFA/DFA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleLang}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold tracking-widest transition-colors ${isDark ? 'hover:bg-white/8 text-slate-400 hover:text-white border border-white/8' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200'}`}
            >
              <span className="flex items-center gap-1"><Languages className="w-3.5 h-3.5" />{lang.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/8 text-slate-400 hover:text-white border border-white/8' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => navigate('/app')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all active:scale-95 shadow-lg shadow-violet-500/20"
            >
              Launch
            </button>
          </div>
        </div>
      </nav>

      <section
        ref={heroRef}
        className={`relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden ${isDark ? 'bg-[#080810]' : 'bg-slate-50'}`}
      >
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)'
              : 'linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />
        
        <div className="max-w-3xl mx-auto text-center z-10 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase mb-6 sm:mb-8 border ${isDark ? 'bg-violet-500/8 border-violet-500/20 text-violet-400' : 'bg-violet-50 border-violet-200 text-violet-600'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {lang === 'id' ? 'Teori Bahasa & Automata — Tools Interaktif' : 'Formal Language & Automata Theory — Interactive Tool'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={`text-4xl sm:text-7xl font-black tracking-tight mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            JFABWIND
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.25em] uppercase font-medium mb-6 sm:mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          >
            Joint Finite Automata Builder With Interactive NFA/DFA
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={`text-base sm:text-xl font-medium mb-3 max-w-xl mx-auto leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
          >
            {lang === 'id'
              ? 'Visualisasi Regex, NFA, dan DFA secara interaktif'
              : 'Interactive Visualization of Regex, NFA, and DFA'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-xs sm:text-sm mb-8 sm:mb-10 max-w-md mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          >
            {lang === 'id'
              ? 'Platform edukasi automata yang membantu memahami konsep formal language melalui visualisasi langsung.'
              : 'An automata education platform that clarifies formal language concepts through live visualization.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate('/app')}
              className="w-full sm:w-auto px-7 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center justify-center gap-2 group active:scale-95 text-xs sm:text-sm"
            >
              {lang === 'id' ? 'Buka Aplikasi' : 'Launch App'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
              className={`w-full sm:w-auto px-7 py-3 font-bold rounded-lg border transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm ${isDark ? 'bg-white/4 hover:bg-white/8 text-slate-200 border-white/10 hover:border-white/20' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'}`}
            >
              {lang === 'id' ? 'Lihat Fitur' : 'View Features'}
            </button>
          </motion.div>
        </div>

        {/* PERBAIKAN: Menghilangkan tabrakan properti display CSS antara flex dan hidden */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 hidden sm:flex sm:flex-col sm:items-center sm:gap-2 cursor-pointer"
          onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className={`w-px h-10 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <motion.div
              animate={{ y: [-40, 40] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
              className="w-full h-1/2 bg-violet-500"
            />
          </div>
        </motion.div>
      </section>

      <section
        id="features-section"
        ref={featuresRef}
        className={`py-14 sm:py-24 px-4 sm:px-6 ${isDark ? 'bg-[#080810]' : 'bg-white'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-2 sm:mb-3 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}
            >
              {lang === 'id' ? 'Fitur Platform' : 'Platform Features'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 }}
              className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {lang === 'id' ? 'Semua yang kamu butuhkan' : 'Everything you need'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className={`text-xs sm:text-sm max-w-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              {lang === 'id'
                ? 'Modul lengkap yang dirancang untuk memudahkan pemahaman komputasi teori formal.'
                : 'A complete module set designed to simplify understanding of formal computation theory.'}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 group ${isDark ? 'bg-white/2 border-white/6 hover:border-white/12 hover:bg-white/4' : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white'}`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${feat.bg} border ${feat.border} flex items-center justify-center mb-3 sm:mb-4 ${feat.iconColor}`}>
                  {feat.icon}
                </div>
                <h3 className={`font-bold text-xs sm:text-sm mb-1 sm:mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feat.title}</h3>
                <p className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={howItWorksRef}
        className={`py-14 sm:py-24 px-4 sm:px-6 ${isDark ? 'bg-[#080810] border-t border-white/5' : 'bg-slate-50 border-t border-slate-100'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-2 sm:mb-3 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}
            >
              {lang === 'id' ? 'Alur Kerja' : 'Workflow'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 }}
              className={`text-2xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {lang === 'id' ? 'Tiga langkah sederhana' : 'Three simple steps'}
            </motion.h2>
          </div>

          <div className="relative">
            <div className={`absolute top-6 left-6 right-0 h-px hidden md:block ${isDark ? 'bg-white/6' : 'bg-slate-200'}`}>
              <motion.div
                style={{ scaleX: timelineWidth }}
                className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-sky-500 origin-left"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center mb-4 sm:mb-6 font-black font-mono text-base sm:text-lg relative z-10 ${isDark ? 'bg-[#080810]' : 'bg-slate-50'} ${accentColors[step.accent]}`}>
                    {step.num}
                  </div>
                  <p className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mb-1 sm:mb-2 ${numColors[step.accent]}`}>
                    {step.label}
                  </p>
                  <h3 className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={techRef}
        className={`py-14 sm:py-20 px-4 sm:px-6 ${isDark ? 'bg-[#080810] border-t border-white/5' : 'bg-white border-t border-slate-100'}`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={techInView ? { opacity: 1 } : {}}
            className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
          >
            {lang === 'id' ? 'Dibangun dengan' : 'Built with'}
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {techs.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={techInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border text-[11px] sm:text-xs font-mono font-semibold transition-colors cursor-default ${isDark ? 'bg-white/2 border-white/6 text-slate-400 hover:text-slate-200 hover:border-white/12' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-14 sm:py-24 px-4 sm:px-6 ${isDark ? 'bg-[#080810] border-t border-white/5' : 'bg-slate-50 border-t border-slate-100'}`}>
        <div className="max-w-2xl mx-auto text-center px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {lang === 'id' ? 'Siap untuk mencoba?' : 'Ready to get started?'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className={`text-xs sm:text-sm mb-6 sm:mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          >
            {lang === 'id'
              ? 'Buka aplikasi dan mulai eksplorasi automata secara visual.'
              : 'Open the app and start exploring automata visually.'}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/app')}
            className="px-7 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center gap-2 mx-auto group active:scale-95 text-xs sm:text-sm"
          >
            {lang === 'id' ? 'Buka Aplikasi' : 'Launch App'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </section>

      <footer className={`px-4 sm:px-6 py-6 sm:py-8 border-t mb-12 sm:mb-0 ${isDark ? 'bg-[#080810] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className={`font-black text-sm tracking-[0.15em] ${isDark ? 'text-white' : 'text-slate-900'}`}>JFABWIND</span>
            <span className={`text-[9px] tracking-wider hidden sm:block ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Joint Finite Automata Builder With Interactive NFA/DFA
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span
              onClick={() => navigate('/changelog')}
              className={`cursor-pointer transition-colors ${isDark ? 'text-slate-600 hover:text-violet-400' : 'text-slate-400 hover:text-violet-600'}`}
            >
              Changelog
            </span>
            <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>·</span>
            <span className={isDark ? 'text-slate-700' : 'text-slate-400'}>
              © 2026 JFABWIND Team
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};