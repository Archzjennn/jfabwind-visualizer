import { useState, useEffect, memo } from 'react';
import { Activity, Hash, ArrowRight, FileDown, Loader2, Table2, ShieldCheck, ShieldAlert, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { epsilonClosure } from '../algorithms/nfaToDFA';
import { generatePDFReport } from '../utils/pdfGenerator';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const InfoPanel = memo(() => {
  const { nfa, dfa, regex, showToast, lang, theme } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMobileExpanded(true); };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!nfa || !dfa) return null;

  const handleGeneratePDF = async () => { 
    setIsGenerating(true);
    showToast(lang === 'id' ? 'Menyiapkan dokumen PDF...' : 'Preparing PDF document...', 'info');

    try {
      // 1. Dapatkan elemen wrapper dari kedua graf
      const nfaWrapper = document.getElementById('graph-nfa');
      const dfaWrapper = document.getElementById('graph-dfa');

      if (!nfaWrapper || !dfaWrapper) throw new Error("Graf tidak ditemukan");

      // 2. Ambil fungsi export yang sama persis dengan fungsi tombol Download PNG milik Anda
      // Gunakan html-to-image yang sudah terbukti tidak berhamburan posisinya
      const { toPng } = await import('html-to-image');

      // 3. Filter agar panel abu-abu (Header) dan kontrol zoom tidak ikut terfoto
      const filter = (node: HTMLElement) => {
        const classList = node.classList;
        return !(
          classList?.contains('react-flow__controls') || 
          classList?.contains('custom-zoom-panel') ||
          // Abaikan baris header abu-abu
          node.tagName?.toLowerCase() === 'h3' ||
          node.parentElement?.classList.contains('border-b')
        );
      };

      // 4. Atur background eksplisit (sesuai tema aktif agar panah tidak hilang)
      const bgColor = isDark ? '#080810' : '#f8fafc';

      // 5. Generate Data URL gambar
      const nfaDataUrl = await toPng(nfaWrapper, { backgroundColor: bgColor, filter, pixelRatio: 2 });
      const dfaDataUrl = await toPng(dfaWrapper, { backgroundColor: bgColor, filter, pixelRatio: 2 });

      // 6. Kirim gambar yang sudah matang ke pdfGenerator
      await generatePDFReport(nfaDataUrl, dfaDataUrl);
      
      showToast(t.toastPdfSuccess, 'success');
    } catch (error) { 
      console.error(error); 
      showToast(t.toastPdfError, 'error'); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleExportCSV = (type: 'NFA' | 'DFA') => { 
    const automaton = type === 'NFA' ? nfa : dfa;
    let csvContent = `State,${automaton.alphabet.join(',')}\n`;
    automaton.states.forEach((state) => {
      const row = [state];
      automaton.alphabet.forEach((symbol) => {
        const transitions = automaton.transitions.filter((t) => t.from === state && t.symbol === symbol).map((t) => t.to);
        row.push(transitions.length > 0 ? transitions.join(' ') : '-');
      });
      csvContent += row.join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${type}-transitions-${regex ? regex.replace(/[^a-zA-Z0-9|()*+]/g, '_') : 'automata'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Tabel ${type} CSV Berhasil Diunduh!`, 'success');
  };

  const checkIsDfaMinimal = () => {
    const reachable = new Set<string>([dfa.startState]);
    let changed = true;
    while (changed) {
      changed = false; const sizeBefore = reachable.size;
      dfa.transitions.forEach(t => { if (reachable.has(t.from)) reachable.add(t.to); });
      if (reachable.size > sizeBefore) changed = true;
    }
    const productive = new Set<string>(dfa.acceptStates);
    changed = true;
    while (changed) {
      changed = false; const sizeBefore = productive.size;
      dfa.transitions.forEach(t => { if (productive.has(t.to)) productive.add(t.from); });
      if (productive.size > sizeBefore) changed = true;
    }
    let deadStatesCount = 0;
    reachable.forEach(state => { if (!productive.has(state)) deadStatesCount++; });
    return deadStatesCount <= 1 && reachable.size === dfa.states.length;
  };

  const isDfaMinimal = checkIsDfaMinimal();
  const startClosure = epsilonClosure([nfa.startState], nfa.transitions);

  const getAnalysisDesc = () => {
    const diff = dfa.states.length - nfa.states.length;
    if (diff > 0) return t.descExpand.replace('{dfa}', dfa.states.length.toString()).replace('{nfa}', nfa.states.length.toString());
    if (diff < 0) return t.descReduce.replace('{dfa}', dfa.states.length.toString()).replace('{nfa}', nfa.states.length.toString());
    return t.descEqual.replace('{dfa}', dfa.states.length.toString()).replace('{nfa}', nfa.states.length.toString());
  };

  return (
    <div className={`rounded-2xl flex flex-col border backdrop-blur-xl transition-all duration-300 ${
      isDark ? 'bg-white/2 border-white/5 shadow-xl shadow-black/50' : 'bg-white/80 border-slate-200 shadow-lg'
    }`}>
      <div 
        onClick={() => { if (window.innerWidth < 768) setIsMobileExpanded(!isMobileExpanded) }}
        className={`px-6 py-5 flex items-center justify-between cursor-pointer md:cursor-default ${!isMobileExpanded ? '' : (isDark ? 'border-b border-white/5' : 'border-b border-slate-100')}`}
      >
        <h3 className={`font-black uppercase tracking-widest text-[11px] flex items-center gap-2 ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>
          <Activity className="w-4 h-4" />
          {t.infoTitle}
        </h3>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); handleGeneratePDF(); }}
            disabled={isGenerating}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 border ${
              isDark ? 'bg-violet-600/20 text-violet-400 border-violet-500/30 hover:bg-violet-600 hover:text-white' : 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-600 hover:text-white'
            }`}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span className="hidden sm:inline">{isGenerating ? t.btnProcessing : t.btnPdf}</span>
          </motion.button>
          <ChevronDown className={`w-5 h-5 md:hidden transition-transform duration-300 ${isMobileExpanded ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl border transition-all ${isDark ? 'bg-black/30 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    <Hash className="w-3.5 h-3.5" /> {t.stateNfa}
                  </div>
                  <div className={`text-4xl font-black font-mono tracking-tighter ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {nfa.states.length}
                  </div>
                </div>
                
                <div className={`p-5 rounded-xl border transition-all relative overflow-hidden ${isDark ? 'bg-black/30 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    <Hash className="w-3.5 h-3.5" /> {t.stateDfa}
                  </div>
                  <div className={`text-4xl font-black font-mono tracking-tighter ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {dfa.states.length}
                  </div>
                  
                  <div className={`absolute bottom-0 left-0 w-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 border-t ${
                    isDfaMinimal ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600') : (isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600')
                  }`}>
                    {isDfaMinimal ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {isDfaMinimal ? 'DFA Minimal' : 'DFA Belum Minimal'}
                  </div>
                </div>
              </div>

              <div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{t.initEps} <span className={isDark ? 'text-violet-400' : 'text-violet-600'}>({nfa.startState})</span></span>
                </div>
                <div className={`p-4 rounded-xl border font-mono text-sm overflow-x-auto custom-scrollbar transition-all ${isDark ? 'bg-[#080810]/50 border-white/5 text-violet-300' : 'bg-white border-slate-200 text-violet-600 shadow-inner'}`}>
                  {`{ ${startClosure.join(', ')} }`}
                </div>
              </div>

              <div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{t.alphabet}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleExportCSV('NFA')} className={`px-2 py-1 flex items-center gap-1 text-[9px] font-bold rounded-full border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-500'}`}>
                      <Table2 className="w-3 h-3" /> CSV NFA
                    </button>
                    <button onClick={() => handleExportCSV('DFA')} className={`px-2 py-1 flex items-center gap-1 text-[9px] font-bold rounded-full border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-500'}`}>
                      <Table2 className="w-3 h-3" /> CSV DFA
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dfa.alphabet.map(symbol => (
                    <span key={symbol} className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-white'}`}>
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`pt-5 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${isDark ? 'bg-sky-500/5 border-sky-500/10' : 'bg-sky-50 border-sky-100'}`}>
                  <ArrowRight className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                  <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {getAnalysisDesc()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});