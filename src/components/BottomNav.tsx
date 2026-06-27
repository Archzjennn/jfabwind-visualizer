import { Home, Search, BarChart2, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const BottomNav = () => {
  const { theme, lang } = useStore();
  const isDark = theme === 'dark';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = lang === 'id' ? id : en;

  const handleScroll = (elementId: string) => {
    if (elementId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(elementId);
    if (el) {
      // Offset 80px agar tidak tertutup Navbar atas
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`md:hidden fixed bottom-0 left-0 w-full z-50 border-t pb-safe transition-colors duration-300 ${
      isDark ? 'bg-[#080810]/95 border-white/10 backdrop-blur-xl' : 'bg-white/95 border-slate-200 backdrop-blur-xl'
    }`}>
      <div className="flex items-center justify-around p-2">
        <button onClick={() => handleScroll('top')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'}`}>
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold tracking-wider">Home</span>
        </button>
        <button onClick={() => { handleScroll('regex-input-section'); document.getElementById('tour-regex-input')?.focus(); }} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'}`}>
          <Search className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold tracking-wider">Input</span>
        </button>
        <button onClick={() => handleScroll('results-section')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'}`}>
          <BarChart2 className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold tracking-wider">Hasil</span>
        </button>
        <button onClick={() => handleScroll('info-section')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'}`}>
          <Info className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold tracking-wider">Info</span>
        </button>
      </div>
    </div>
  );
};