/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { minimizeDFA } from '../algorithms/minimizeDFA';
import { AutomataGraph } from './AutomataGraph';
import { TransitionTable } from './TransitionTable';
import type { Automaton } from '../types/automata';

export const MinimizationPanel = () => {
  const { dfa, theme, lang } = useStore();
  const isDark = theme === 'dark';
  
  const [minDfa, setMinDfa] = useState<Automaton | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMinDfa(null);
    setLogs([]);
    setIsExpanded(false);
  }, [dfa]);

  useEffect(() => {
    if (dfa && minDfa) {
      const { logs: resultLogs } = minimizeDFA(dfa, lang);
      setLogs(resultLogs);
    }
  }, [lang, dfa, minDfa]);

  if (!dfa) return null;

  const handleMinimize = () => {
    const { minDfa: minimized, logs: resultLogs } = minimizeDFA(dfa, lang);
    setMinDfa(minimized);
    setLogs(resultLogs);
    setIsExpanded(true);
  };

  const isAlreadyMinimal = minDfa ? dfa.states.length === minDfa.states.length : false;

  return (
    <div className={`mt-8 rounded-2xl overflow-hidden border backdrop-blur-xl transition-all duration-300 ${isDark ? 'bg-white/2 border-white/5 shadow-xl shadow-black/50' : 'bg-white/80 border-slate-200 shadow-lg'}`}>
      <div className={`px-6 py-5 flex flex-col sm:flex-row items-center justify-between border-b gap-4 ${isDark ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-black uppercase tracking-widest text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {lang === 'id' ? 'Minimisasi DFA' : 'DFA Minimization'}
            </h3>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Hopcroft's Algorithm / Myhill-Nerode
            </p>
          </div>
        </div>
        
        <button onClick={minDfa ? () => setIsExpanded(!isExpanded) : handleMinimize} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${minDfa ? (isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300') : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20'}`}>
          {minDfa ? (
            <>
              {lang === 'id' ? 'Lihat Hasil' : 'View Results'} 
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </>
          ) : (
            <>{lang === 'id' ? 'Minimasi Sekarang' : 'Minimize Now'}</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && minDfa && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{lang === 'id' ? 'DFA Original' : 'Original DFA'}</div>
                  <div className={`text-2xl font-black font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{dfa.states.length} <span className="text-xs font-sans font-medium opacity-50">States</span></div>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{lang === 'id' ? 'DFA Minimal' : 'Minimal DFA'}</div>
                  <div className={`text-2xl font-black font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{minDfa.states.length} <span className="text-xs font-sans font-medium opacity-50">States</span></div>
                </div>
                <div className={`p-4 rounded-xl border flex flex-col justify-center ${isAlreadyMinimal ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200') : (isDark ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-50 border-sky-200')}`}>
                  {isAlreadyMinimal ? (
                    <div className={`flex items-center gap-2 font-bold text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}><CheckCircle2 className="w-5 h-5" /> {lang === 'id' ? 'Sudah Minimal' : 'Already Minimal'}</div>
                  ) : (
                    <>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>{lang === 'id' ? 'Total Reduksi' : 'Total Reduction'}</div>
                      <div className={`text-2xl font-black font-mono ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>{dfa.states.length - minDfa.states.length} <span className="text-xs font-sans font-medium opacity-50">{lang === 'id' ? 'Dihapus' : 'Removed'}</span></div>
                    </>
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${isDark ? 'bg-[#080810]/50 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2"><span className={isDark ? 'text-violet-500' : 'text-violet-400'}>&gt;</span> {log}</div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AutomataGraph automaton={minDfa} title={lang === 'id' ? 'Graf DFA Minimal' : 'Minimal DFA Graph'} />
                <TransitionTable automaton={minDfa} title={lang === 'id' ? 'Tabel Transisi DFA Minimal' : 'Minimal DFA Transition Table'} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};