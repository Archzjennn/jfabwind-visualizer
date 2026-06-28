import { Home, Search, BarChart2, Info } from 'lucide-react';
import { useStore } from '../store/useStore';

export const BottomNav = () => {
  const { theme, lang } = useStore();
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
    <div data-bottomnav className={`md:hidden fixed bottom-0 left-0 w-full z-50 border-t pb-safe transition-colors duration-300 ${
      isDark ? 'bg-[#080810]/95 border-white/10 backdrop-blur-xl' : 'bg-white/95 border-slate-200 backdrop-blur-xl'
    }`}>
      <div className="flex items-center justify-around p-2">
        <button 
          onClick={() => handleScroll('top')} 
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-400 hover:text-violet-400 active:bg-white/5' : 'text-slate-500 hover:text-violet-600 active:bg-slate-100'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider">
            {lang === 'id' ? 'Beranda' : 'Home'}
          </span>
        </button>
        
        <button 
          onClick={() => { handleScroll('regex-input-section'); const el = document.getElementById('tour-regex-input'); if(el) (el as HTMLElement).focus(); }} 
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-400 hover:text-violet-400 active:bg-white/5' : 'text-slate-500 hover:text-violet-600 active:bg-slate-100'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider">
            Input
          </span>
        </button>
        
        <button 
          onClick={() => handleScroll('visual-section')} 
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-400 hover:text-violet-400 active:bg-white/5' : 'text-slate-500 hover:text-violet-600 active:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider">
            {lang === 'id' ? 'Hasil' : 'Result'}
          </span>
        </button>
        
        <button 
          onClick={() => handleScroll('info-section')} 
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-400 hover:text-violet-400 active:bg-white/5' : 'text-slate-500 hover:text-violet-600 active:bg-slate-100'
          }`}
        >
          <Info className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider">
            Info
          </span>
        </button>
      </div>
    </div>
  );
};