import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Clock } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { id } from '../i18n/id';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { en } from '../i18n/en';

export const RecentlyViewed = () => {
  const { history, setRegex, lang, theme } = useStore();
  const isDark = theme === 'dark';

  // State untuk On/Off fitur dari Settings
  const [isVisible, setIsVisible] = useState(localStorage.getItem('app-show-recent') !== 'false');

  useEffect(() => {
    const handleSettingChange = () => {
      setIsVisible(localStorage.getItem('app-show-recent') !== 'false');
    };
    window.addEventListener('setting-recent-changed', handleSettingChange);
    return () => window.removeEventListener('setting-recent-changed', handleSettingChange);
  }, []);

  if (!isVisible) return null; // Langsung hilangkan jika disetting Off

  // Fail-Safe: Cegah crash dari data rusak
  const validHistory = (history || []).filter(h => h && typeof h === 'object' && h.regex && h.timestamp);
  const recent = Array.from(new Set(validHistory.map(h => h.regex)))
    .slice(0, 5)
    .map(r => validHistory.find(h => h.regex === r)!);

  if (recent.length === 0) return null;

  const formatTime = (timestamp: number) => {
    try {
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        hour: '2-digit', minute: '2-digit'
      }).format(new Date(timestamp));
    } catch {
      return '';
    }
  };

  const handleCardClick = (regexStr: string) => {
    setRegex(regexStr); // Set input text
    // Mengirim sinyal ke RegexInput untuk segera memproses automata
    window.dispatchEvent(new CustomEvent('trigger-process-regex', { detail: regexStr }));
    // Menggulir layar ke atas dengan halus
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      id="tour-recent-panel"
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-4xl mx-auto mt-4 px-2 z-40 relative"
    >
      <div className={`text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        <Clock className="w-3.5 h-3.5" /> {lang === 'id' ? 'Terakhir Dilihat' : 'Recently Viewed'}
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {recent.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(item.regex)}
            className={`snap-start flex-shrink-0 w-48 sm:w-56 p-4 rounded-2xl border transition-all group text-left ${
              isDark ? 'bg-[#080810]/60 border-white/5 hover:border-violet-500/50 hover:bg-white/5' : 'bg-white/60 border-slate-200 hover:border-violet-400 hover:bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`font-mono text-sm sm:text-base font-bold truncate pr-2 ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>
                {item.regex}
              </span>
              <span className={`text-[9px] font-medium tracking-wide shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {formatTime(item.timestamp)}
              </span>
            </div>
            
            <div className={`h-14 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 border transition-all duration-300 ${
              isDark ? 'bg-black/50 border-white/5 group-hover:border-violet-500/30' : 'bg-slate-50 border-slate-100 group-hover:border-violet-200'
            }`}>
              <div className="w-4 h-4 rounded-full border-2 border-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)] relative">
                 <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-[1.5px] bg-sky-500"></div>
              </div>
              <div className={`w-6 sm:w-8 h-[2px] ${isDark ? 'bg-violet-500/40 group-hover:bg-violet-500/80' : 'bg-violet-200 group-hover:bg-violet-400'}`}></div>
              <div className={`w-4 h-4 rounded-full border-2 ${isDark ? 'border-violet-500/40 group-hover:border-violet-500/80' : 'border-violet-200 group-hover:border-violet-400'}`}></div>
              <div className={`w-6 sm:w-8 h-[2px] ${isDark ? 'bg-violet-500/40 group-hover:bg-violet-500/80' : 'bg-violet-200 group-hover:bg-violet-400'}`}></div>
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 p-[2px] shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                <div className="w-full h-full rounded-full border-[1.5px] border-emerald-500"></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};