import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Users, BookOpen, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

const TEAM_MEMBERS = [
  { prefix: '', highlight: 'J', suffix: 'aenul Maarip' },
  { prefix: '', highlight: 'F', suffix: 'arid Ramadhan' },
  { prefix: '', highlight: 'A', suffix: 'ndika Rafi Hibatullah' },
  { prefix: '', highlight: 'B', suffix: 'hismo Asmoro Suryoyudhanto' },
  { prefix: '', highlight: 'W', suffix: 'isnu Aji Waskito' },
  { prefix: '', highlight: 'I', suffix: 'bnu Ardiansyah' },
  { prefix: 'Asad Nur Satrio ', highlight: 'N', suffix: 'oegroho' },
  { prefix: '', highlight: 'D', suffix: 'ava Algafari Hamid' },
];

const TECH_STACK = [
  'React 19', 'TypeScript', 'Tailwind CSS', 'Zustand', 
  'React Flow', 'Dagre', 'Framer Motion', 'Vite', 
  'Driver.js', 'html-to-image', 'jsPDF', 'Lucide React'
];

export const AboutModal = () => {
  const { isAboutOpen, closeAbout, lang, theme } = useStore();
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isAboutOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={closeAbout} 
            className="absolute inset-0 bg-black/70 backdrop-blur-md" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className={`relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar border rounded-3xl shadow-2xl ${isDark ? 'bg-[#080810]' : 'bg-white'} ${isDark ? 'border-white/10 shadow-black' : 'border-slate-200 shadow-slate-300/50'}`}
          >
            <div className="relative h-24 sm:h-36 md:h-40 shrink-0 group">
              <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
                <img 
                  src={isDark ? "/BannerDark.png" : "/BannerLight.png"} 
                  alt="Team Banner" 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <button onClick={closeAbout} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-xl transition-colors backdrop-blur-md z-20 active:scale-90">
                <X className="w-4 h-4" />
              </button>
              
              <div className={`absolute -bottom-6 left-6 sm:left-10 p-3 rounded-2xl shadow-xl border z-20 ${isDark ? 'bg-[#080810] border-white/10 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                <img 
                  src="/LogoJFABWIND.png" 
                  alt="JFABWIND" 
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-md rounded-lg" 
                />
              </div>
            </div>

            <div className="px-6 sm:px-10 pt-14 pb-10 space-y-10">
              <div>
                <h2 className={`text-2xl sm:text-3xl font-black flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  JFABWIND Visualizer <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />
                </h2>
                <p className={`mt-3 text-xs sm:text-sm leading-relaxed max-w-3xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.aboutDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <h3 className={`font-black uppercase tracking-widest text-[10px] sm:text-[11px] mb-5 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    <BookOpen className="w-4 h-4 text-sky-500" /> {t.academicTitle}
                  </h3>
                  <div className={`grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div>
                      <strong className={`block mb-1 text-[9px] sm:text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.course}</strong>
                      <span className="font-semibold">{t.courseName}</span>
                    </div>
                    <div>
                      <strong className={`block mb-1 text-[9px] sm:text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.prodi}</strong>
                      <span className="font-semibold">{t.prodiName}</span>
                    </div>
                    <div>
                      <strong className={`block mb-1 text-[9px] sm:text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.year}</strong>
                      <span className="font-semibold">2026</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <h3 className={`font-black uppercase tracking-widest text-[10px] sm:text-[11px] mb-5 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    <Code2 className="w-4 h-4 text-emerald-500" /> {t.techTitle}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {TECH_STACK.map((tech) => (
                      <span key={tech} className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold tracking-wider uppercase transition-colors cursor-default ${
                        isDark ? 'bg-black/50 border border-white/5 text-slate-400 hover:text-white hover:border-white/20' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                      }`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`font-black uppercase tracking-widest text-[10px] sm:text-[11px] mb-6 flex items-center gap-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  <Users className="w-4 h-4" /> {t.teamTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TEAM_MEMBERS.map((member, idx) => (
                    <div key={idx} className={`group relative overflow-hidden p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 ${
                      isDark ? 'bg-white/5 border-white/5 hover:border-violet-500/50 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:border-violet-300 hover:shadow-lg'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center text-lg sm:text-xl font-black transition-colors relative z-10 shadow-sm ${
                        isDark ? 'bg-black/50 text-slate-500 group-hover:text-violet-400 group-hover:bg-violet-500/10' : 'bg-white text-slate-400 group-hover:text-violet-600 group-hover:bg-violet-50'
                      }`}>
                        {member.highlight}
                      </div>
                      
                      <div className="relative z-10">
                        <span className={`text-xs sm:text-sm font-semibold leading-snug block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {member.prefix}
                          <span className={`font-black text-[14px] sm:text-[15px] ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{member.highlight}</span>
                          {member.suffix}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};