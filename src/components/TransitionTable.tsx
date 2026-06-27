import { useState, useMemo, memo } from 'react';
import { Search, Table2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Automaton } from '../types/automata';
import { useStore } from '../store/useStore';
import { epsilonClosure } from '../algorithms/nfaToDFA';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

interface Props {
  automaton: Automaton | null;
  title: string;
}

// IMPROVE 4 (Preview): Menggunakan React.memo agar tabel tidak dirender ulang jika state tidak berubah
export const TransitionTable = memo(({ automaton, title }: Props) => {
  const { theme, lang, testActiveNodes, testActiveEdges } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';
  
  // Deteksi otomatis jika yang dirender adalah tabel NFA
  const isNFA = title.includes('NFA');

  // IMPROVE 3 & 4: Filter state secara real-time yang dioptimasi dengan useMemo
  const filteredStates = useMemo(() => {
    if (!automaton) return [];
    if (!searchQuery) return automaton.states;
    return automaton.states.filter(s => 
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [automaton, searchQuery]);

  if (!automaton) return null;

  return (
    <div className={`rounded-2xl flex flex-col border backdrop-blur-xl transition-all duration-300 overflow-hidden ${
      isDark ? 'bg-white/2 border-white/5 shadow-xl shadow-black/50' : 'bg-white/80 border-slate-200 shadow-lg'
    }`}>
      {/* Header Panel & Search Input */}
      <div className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b shrink-0 ${
        isDark ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-slate-50/50'
      }`}>
        <h3 className={`font-bold tracking-wide uppercase text-sm flex items-center gap-2 ${
          isDark ? 'text-violet-300' : 'text-violet-700'
        }`}>
          <Table2 className="w-4 h-4" />
          {title}
        </h3>

        {/* Kotak Pencarian State */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder={lang === 'id' ? 'Cari state...' : 'Search state...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full sm:w-48 pl-9 pr-3 py-1.5 text-xs rounded-lg outline-none transition-all border ${
              isDark 
                ? 'bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500' 
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500'
            }`}
          />
        </div>
      </div>

      {/* Wrapper Tabel (Scroll Horizontal Lancar di HP & Sticky Header) */}
      <div className="w-full overflow-x-auto custom-scrollbar relative max-h-[400px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className={`sticky top-0 z-10 shadow-sm backdrop-blur-xl ${
            isDark ? 'bg-[#080810]/95' : 'bg-slate-50/95'
          }`}>
            <tr>
              <th className={`px-4 py-3 text-xs font-black tracking-widest uppercase border-b ${
                isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                State
              </th>
              
              {/* Kolom Khusus Epsilon-Closure HANYA untuk NFA */}
              {isNFA && (
                <th className={`px-4 py-3 text-xs font-black tracking-widest uppercase border-b ${
                  isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  ε-closure
                </th>
              )}

              {/* Kolom Simbol Input (Bisa di-hover) */}
              {automaton.alphabet.map((symbol) => (
                <th 
                  key={symbol}
                  onMouseEnter={() => setHoveredCol(symbol)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`px-4 py-3 text-xs font-black tracking-widest uppercase border-b transition-colors cursor-default ${
                    isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                  } ${hoveredCol === symbol ? (isDark ? 'bg-white/5 text-violet-400' : 'bg-violet-50 text-violet-600') : ''}`}
                >
                  {symbol}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="font-mono text-sm">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => {
                const isStart = state === automaton.startState;
                const isAccept = automaton.acceptStates.includes(state);
                
                // Cek Sinkronisasi dengan String Tester
                const isTestActive = testActiveNodes.includes(state);
                
                // Indikator panah dan bintang ala buku teks TBA
                const prefix = (isStart && isAccept) ? '→*' : isStart ? '→ ' : isAccept ? '* ' : '';
                
                // Highlight Baris
                let rowBg = '';
                if (isTestActive) {
                  rowBg = isDark ? 'bg-amber-500/10' : 'bg-amber-100/50';
                } else if (hoveredRow === state) {
                  rowBg = isDark ? 'bg-white/5' : 'bg-slate-50';
                }

                return (
                  <motion.tr 
                    key={state}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onMouseEnter={() => setHoveredRow(state)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-colors border-b last:border-0 ${
                      isDark ? 'border-white/5' : 'border-slate-100'
                    } ${rowBg}`}
                  >
                    {/* Sel Kolom State */}
                    <td className={`px-4 py-2.5 flex items-center gap-2 transition-colors ${
                      isTestActive ? (isDark ? 'text-amber-400 font-bold' : 'text-amber-600 font-bold') : (isDark ? 'text-slate-300' : 'text-slate-700')
                    }`}>
                      <span className={`inline-block w-5 text-right font-black ${
                        isStart || isAccept ? (isDark ? 'text-violet-400' : 'text-violet-600') : 'text-transparent'
                      }`}>
                        {prefix}
                      </span>
                      {state}
                    </td>

                    {/* Sel Kolom Epsilon (Khusus NFA) */}
                    {isNFA && (
                      <td className={`px-4 py-2.5 text-xs transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {`{ ${epsilonClosure([state], automaton.transitions).join(', ')} }`}
                      </td>
                    )}

                    {/* Sel Kolom Transisi (Sinkronisasi Sel Aktif) */}
                    {automaton.alphabet.map((symbol) => {
                      const transitions = automaton.transitions.filter(t => t.from === state && t.symbol === symbol);
                      const toStates = transitions.map(t => t.to);
                      
                      // Cek apakah transisi ini sedang dilewati oleh String Tester
                      const isCellActive = transitions.some(t => testActiveEdges.includes(`${t.from}-${t.to}`));
                      
                      const isColHovered = hoveredCol === symbol;
                      
                      // Logika Pewarnaan Sel
                      let cellBg = '';
                      if (isCellActive) {
                        cellBg = isDark 
                          ? 'bg-amber-500/20 text-amber-300 font-bold shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]' 
                          : 'bg-amber-200/60 text-amber-800 font-bold';
                      } else if (isColHovered) {
                        cellBg = isDark ? 'bg-white/5' : 'bg-violet-50/50';
                      }

                      return (
                        <td key={symbol} className={`px-4 py-2.5 transition-colors ${cellBg} ${
                          !isCellActive ? (isDark ? 'text-slate-400' : 'text-slate-600') : ''
                        }`}>
                          {toStates.length > 0 ? `{ ${toStates.join(', ')} }` : '∅'}
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={automaton.alphabet.length + (isNFA ? 2 : 1)} className={`px-4 py-12 text-center text-xs uppercase tracking-widest ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {lang === 'id' ? 'State tidak ditemukan' : 'State not found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Legend / Keterangan Indikator (IMPROVE 3) */}
      <div className={`px-5 py-3 text-[10px] uppercase tracking-widest font-bold flex flex-wrap gap-5 border-t shrink-0 ${
        isDark ? 'bg-black/20 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
      }`}>
        <div className="flex items-center gap-1.5"><span className={isDark ? 'text-violet-400' : 'text-violet-600'}>→</span> Initial State</div>
        <div className="flex items-center gap-1.5"><span className={isDark ? 'text-violet-400' : 'text-violet-600'}>*</span> Final State</div>
        <div className="flex items-center gap-1.5"><span className={isDark ? 'text-violet-400' : 'text-violet-600'}>→*</span> Initial & Final</div>
      </div>
    </div>
  );
});