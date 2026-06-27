import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const ShortcutsModal = () => {
  const { isShortcutsOpen, toggleShortcuts, lang, theme } = useStore();
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  const SHORTCUTS = [
    { keys: ['Ctrl', 'Enter'], desc: t.scVisualize },
    { keys: ['Ctrl', 'E'], desc: t.scEduMode },
    { keys: ['Ctrl', 'D'], desc: t.scTheme },
    { keys: ['Ctrl', 'S'], desc: t.scExportPng },
    { keys: ['Ctrl', 'L'], desc: t.scCopyLink },
    { keys: ['Ctrl', 'H'], desc: t.scHistory },
    { keys: ['?'], desc: t.scGuide },
  ];

  return (
    <AnimatePresence>
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={toggleShortcuts} 
            className="absolute inset-0 bg-black/70 backdrop-blur-md" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className={`relative z-[210] w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-[#080810] border-white/10 shadow-black' : 'bg-white border-slate-200 shadow-slate-300/50'}`}
          >
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-white/5 bg-[#080810]' : 'border-slate-100 bg-slate-50/50'}`}>
              <h2 className={`text-lg font-black tracking-wide uppercase flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Keyboard className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} /> {t.scTitle}
              </h2>
              <button 
                onClick={toggleShortcuts} 
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-600 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ul className={`divide-y border rounded-2xl overflow-hidden ${isDark ? 'divide-white/5 border-white/5' : 'divide-slate-100 border-slate-100'}`}>
                {SHORTCUTS.map((sc, idx) => (
                  <li key={idx} className={`flex items-center justify-between p-4 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <div className="flex gap-2">
                      {sc.keys.map((k, i) => (
                        <span key={i} className={`px-2.5 py-1.5 border rounded-lg text-[11px] font-bold font-mono tracking-wider shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-violet-300' : 'bg-white border-slate-200 text-violet-600'}`}>
                          {k}
                        </span>
                      ))}
                    </div>
                    <span className={`text-sm font-medium text-right ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {sc.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};