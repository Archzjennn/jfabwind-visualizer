import { useRef } from 'react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const RegexHighlightedInput = () => {
  const { regex, setRegex, theme, lang } = useStore();
  const isDark = theme === 'dark';
  const t = lang === 'id' ? id : en;
  
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fungsi sinkronisasi scroll
  const handleScroll = () => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  // Fungsi Parser untuk mewarnai Syntax
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    
    return text.split('').map((char, i) => {
      // ( ) → warna kuning/amber
      if (['(', ')'].includes(char)) {
        return <span key={i} className="text-amber-500 font-bold">{char}</span>;
      }
      // | → warna biru/sky
      if (char === '|') {
        return <span key={i} className="text-sky-500 font-bold">{char}</span>;
      }
      // * + ? → warna hijau/emerald
      if (['*', '+', '?'].includes(char)) {
        return <span key={i} className="text-emerald-500 font-black">{char}</span>;
      }
      // { } [ ] → warna pink/rose
      if (['{', '}', '[', ']'].includes(char)) {
        return <span key={i} className="text-pink-500 font-bold">{char}</span>;
      }
      // Karakter biasa → putih (dark) / slate-900 (light)
      return (
        <span key={i} className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full flex items-center group">
      {/* 1. LAYER OVERLAY (Background yang menampilkan warna highlight) */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full px-4 py-3 text-lg sm:text-xl font-mono overflow-hidden whitespace-pre pointer-events-none flex items-center rounded-xl border-2 border-transparent transition-colors ${
          isDark ? 'bg-black/40' : 'bg-slate-50'
        }`}
      >
        {regex ? renderHighlightedText(regex) : (
          <span className={`italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
             {t.rbPlaceholder || 'a(a|b)*b'}
          </span>
        )}
      </div>

      {/* 2. LAYER INPUT ASLI (Transparan namun interaktif) */}
      <input
        ref={inputRef}
        type="text"
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
        onScroll={handleScroll}
        spellCheck="false"
        autoComplete="off"
        className={`absolute inset-0 w-full h-full px-4 py-3 text-lg sm:text-xl font-mono bg-transparent outline-none rounded-xl border-2 transition-all shadow-sm ${
          isDark 
            ? 'text-transparent caret-violet-400 border-white/10 hover:border-white/20 focus:border-violet-500 focus:bg-violet-500/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
            : 'text-transparent caret-violet-600 border-slate-200 hover:border-slate-300 focus:border-violet-500 focus:bg-white'
        }`}
      />
      
      {/* Spacer tak kasat mata agar container merespon tinggi input */}
      <div className="px-4 py-3 text-lg sm:text-xl font-mono opacity-0 pointer-events-none">
        {regex || 'a(a|b)*b'}
      </div>
    </div>
  );
};