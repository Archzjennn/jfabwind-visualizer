// cspell:ignore Hasil
import { Home, Search, BarChart2, Info } from 'lucide-react';
import { useStore } from '../store/useStore';

export const BottomNav = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const handleScroll = (elementId: string) => {
    if (elementId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(elementId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`md:hidden fixed bottom-0 left-0 w-full z-50 border-t pb-safe transition-colors duration-300 ${
      isDark ? 'bg-[#080810]/95 border-white/10 sm:backdrop-blur-xl' : 'bg-white/95 border-slate-200 sm:backdrop-blur-xl'
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
        <button onClick={() => handleScroll('visual-section')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'}`}>
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