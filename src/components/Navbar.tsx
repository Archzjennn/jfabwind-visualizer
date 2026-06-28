import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, GraduationCap, Info, Keyboard, Languages, 
  HelpCircle, Blocks, Target, BookText, Settings, Menu, X 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const Navbar = () => {
  const { 
    theme, toggleTheme, isEduMode, toggleEduMode, toggleAbout, 
    toggleShortcuts, lang, toggleLang, setRunTour, toggleBuilder, 
    toggleQuiz, toggleGlossary 
  } = useStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
      isDark ? 'bg-[#080810]/80 border-white/5 shadow-2xl shadow-purple-500/5' : 'bg-white/80 border-slate-200 shadow-sm'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                src="/LogoJFABWIND.png" 
                alt="JFABWIND Logo" 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
            </div>
            
            <div className="flex flex-col leading-tight">
              <span className={`font-black text-sm tracking-[0.15em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                JFABWIND
              </span>
              <span className={`text-[8px] tracking-[0.2em] uppercase font-bold hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Joint Finite Automata Builder With Interactive NFA/DFA
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-1 sm:gap-2">
            <button id="tour-quiz-btn" onClick={toggleQuiz} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}>
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quiz</span>
            </button>

            <button id="tour-glossary-btn" onClick={toggleGlossary} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}>
              <BookText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'id' ? 'Kamus' : 'Glossary'}</span>
            </button>

            <button onClick={toggleAbout} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}>
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.about}</span>
            </button>

            <button id="tour-builder-btn" onClick={toggleBuilder} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
              isDark ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 shadow-violet-500/5' : 'bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100'
            }`}>
              <Blocks className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Builder</span>
            </button>

            <button id="tour-edu-btn" onClick={toggleEduMode} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isEduMode 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.eduMode}</span>
            </button>
            
            <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}></div>
            
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

          <div className="lg:hidden flex items-center gap-1.5">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all transform active:scale-90 ${
              isDark ? 'text-amber-400 hover:bg-amber-500/10' : 'text-indigo-600 hover:bg-indigo-500/10'
            }`}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event('open-settings'))}
              className={`p-2 rounded-lg transition-all ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={lang === 'id' ? 'Pengaturan' : 'Settings'}
            >
              <Settings className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl transition-all ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`lg:hidden w-full border-t overflow-hidden backdrop-blur-2xl ${
              isDark ? 'bg-[#080810]/95 border-white/5 shadow-2xl' : 'bg-white/95 border-slate-200 shadow-lg'
            }`}
          >
            <div className="p-4 flex flex-col gap-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
              
              <button onClick={() => { toggleQuiz(); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}>
                <Target className="w-4 h-4 text-violet-500" />
                <span>Quiz</span>
              </button>

              <button onClick={() => { toggleGlossary(); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}>
                <BookText className="w-4 h-4 text-violet-500" />
                <span>{lang === 'id' ? 'Kamus (Glosarium)' : 'Glossary'}</span>
              </button>

              <button onClick={() => { toggleAbout(); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}>
                <Info className="w-4 h-4 text-violet-500" />
                <span>{t.about}</span>
              </button>

              <button onClick={() => { toggleEduMode(); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isEduMode 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : (isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              }`}>
                <GraduationCap className="w-4 h-4" />
                <span>{t.eduMode}</span>
              </button>

              <div className={`h-px w-full my-2 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}></div>

              <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                <button onClick={() => { setRunTour(true); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-[9px] font-medium">Tour</span>
                </button>

                <button onClick={() => { toggleLang(); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors border ${
                  isDark ? 'text-slate-400 border-white/5 hover:bg-white/5' : 'text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}>
                  <Languages className="w-4 h-4" />
                  <span className="text-[9px] font-black">{lang.toUpperCase()}</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};