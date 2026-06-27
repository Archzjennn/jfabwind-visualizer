import { Sun, Moon, GraduationCap, Info, Keyboard, Languages, HelpCircle, Blocks, Target, BookText, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const Navbar = () => {
  const { theme, toggleTheme, isEduMode, toggleEduMode, toggleAbout, toggleShortcuts, lang, toggleLang, setRunTour, toggleBuilder, toggleQuiz, toggleGlossary } = useStore();
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
      isDark ? 'bg-[#080810]/80 border-white/5 shadow-2xl shadow-purple-500/5' : 'bg-white/80 border-slate-200 shadow-sm'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title Sync with Landing Page */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                src={isDark ? "/LogoJFABWIND.png" : "/LogoJFABWIND.png"} 
                alt="JFABWIND Logo" 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
            </div>
            
            <div className="flex flex-col leading-tight">
              <span className={`font-black text-sm tracking-[0.15em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                JFABWIND
              </span>
              {/* Teks panjang disembunyikan di HP agar tidak bertabrakan dengan tombol dikanan */}
              <span className={`text-[8px] tracking-[0.2em] uppercase font-bold hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Joint Finite Automata Builder With Interactive NFA/DFA
              </span>
              {/* Fallback teks pendek untuk HP */}
              <span className={`text-[8px] tracking-[0.2em] uppercase font-bold sm:hidden ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Visualizer
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Quiz Button (FITUR BARU 3) */}
            <button id="tour-quiz-btn" onClick={toggleQuiz} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}>
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quiz</span>
            </button>

            {/* Tombol Glosarium (FITUR BARU 4) */}
            <button id="tour-glossary-btn" onClick={toggleGlossary} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}>
              <BookText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'id' ? 'Kamus' : 'Glossary'}</span>
            </button>

            {/* Info Button */}
            <button onClick={toggleAbout} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}>
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.about}</span>
            </button>

            {/* Builder Button - Violet Glow */}
            <button id="tour-builder-btn" onClick={toggleBuilder} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
              isDark ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 shadow-violet-500/5' : 'bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100'
            }`}>
              <Blocks className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Builder</span>
            </button>

            {/* Edu Mode - Amber/Gold */}
            <button id="tour-edu-btn" onClick={toggleEduMode} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isEduMode 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.eduMode}</span>
            </button>
            
            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}></div>
            
            {/* Quick Actions */}
            <div id="tour-controls" className="flex items-center gap-1 sm:gap-1.5">
              <button onClick={() => setRunTour(true)} className={`p-2 rounded-lg transition-colors ${
                isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}>
                <HelpCircle className="w-4 h-4" />
              </button>

              <button onClick={toggleLang} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all border ${
                isDark ? 'text-slate-400 hover:text-white border-white/5 hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
              }`}>
                <Languages className="w-3.5 h-3.5" />
                {lang.toUpperCase()}
              </button>

              <button onClick={toggleShortcuts} className={`p-2 rounded-lg transition-colors ${
                isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}>
                <Keyboard className="w-4 h-4" />
              </button>
              
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all transform active:scale-90 ${
                isDark ? 'text-amber-400 hover:bg-amber-500/10' : 'text-indigo-600 hover:bg-indigo-500/10'
              }`}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* IMPROVE MISC-1: TOMBOL SETTINGS */}
              <button
                onClick={() => window.dispatchEvent(new Event('open-settings'))}
                className={`p-2 rounded-lg transition-all ${
                  isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={lang === 'id' ? 'Pengaturan' : 'Settings'}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};