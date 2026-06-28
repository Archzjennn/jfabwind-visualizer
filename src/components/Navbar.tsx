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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
      isDark ? 'bg-[#080810]/80 border-white/5 shadow-2xl shadow-purple-500/5' : 'bg-white/80 border-slate-200 shadow-sm'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand (Tetap Asli) */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/30">
              <img 
                src="/LogoJFABWIND.png" 
                alt="JFABWIND Logo" 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
            </div>
            <span className={`font-black text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-white to-slate-400' : 'from-slate-900 to-slate-700'}`}>
              JFABWIND
            </span>
          </div>

          {/* Desktop Navigation (Tidak Ada Yang Diubah) */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              id="tour-edu-btn"
              onClick={toggleEduMode} 
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 border ${
                isEduMode 
                  ? (isDark ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-violet-50 border-violet-200 text-violet-600') 
                  : (isDark ? 'border-transparent text-slate-400 hover:text-white hover:bg-white/5' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              }`}
              title={lang === 'id' ? 'Mode Edukasi' : 'Education Mode'}
            >
              <GraduationCap className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleBuilder} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Regex Builder"
            >
              <Blocks className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleQuiz} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Quiz Tournament"
            >
              <Target className="w-5 h-5" />
            </button>

            <button 
              id="tour-glossary-btn"
              onClick={toggleGlossary} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Glossary"
            >
              <BookText className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleShortcuts} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Keyboard Shortcuts"
            >
              <Keyboard className="w-5 h-5" />
            </button>

            <div className={`w-[1px] h-5 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

            <button 
              onClick={() => setRunTour(true)} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Onboarding Tour"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleLang} 
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${isDark ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              {lang}
            </button>

            <button 
              onClick={toggleTheme} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={toggleAbout} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="About Us"
            >
              <Info className="w-5 h-5" />
            </button>

            <button 
              id="tour-controls"
              onClick={() => window.dispatchEvent(new Event('open-settings'))} 
              className={`p-2.5 rounded-xl transition-all border border-transparent ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleTheme} 
              className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all border ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-900 hover:bg-slate-100'}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Regex Builder & Shortcuts Dihapus dari Grid) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden border-t ${isDark ? 'bg-[#080810]/95 border-white/5' : 'bg-white/95 border-slate-200'}`}
          >
            <div className="grid grid-cols-3 gap-2 p-4 max-h-[70vh] overflow-y-auto">
              <button onClick={() => { toggleEduMode(); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 border transition-colors ${
                isEduMode 
                  ? (isDark ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-violet-50 border-violet-200 text-violet-600')
                  : (isDark ? 'text-slate-400 border-transparent hover:bg-white/5' : 'text-slate-600 border-transparent hover:bg-slate-100')
              }`}>
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] font-medium">Edu Mode</span>
              </button>

              <button onClick={() => { toggleQuiz(); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                <Target className="w-5 h-5" />
                <span className="text-[10px] font-medium">Quiz</span>
              </button>

              <button onClick={() => { toggleGlossary(); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                <BookText className="w-5 h-5" />
                <span className="text-[10px] font-medium">Glossary</span>
              </button>

              <button onClick={() => { setRunTour(true); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                <HelpCircle className="w-5 h-5" />
                <span className="text-[10px] font-medium">Tour</span>
              </button>

              <button onClick={() => { toggleLang(); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors border ${isDark ? 'text-slate-400 border-white/5 hover:bg-white/5' : 'text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                <Languages className="w-5 h-5" />
                <span className="text-[10px] font-black">{lang.toUpperCase()}</span>
              </button>

              <button onClick={() => { toggleAbout(); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                <Info className="w-5 h-5" />
                <span className="text-[10px] font-medium">About</span>
              </button>

              <button onClick={() => { window.dispatchEvent(new Event('open-settings')); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1 transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                <Settings className="w-5 h-5" />
                <span className="text-[10px] font-medium">Settings</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};