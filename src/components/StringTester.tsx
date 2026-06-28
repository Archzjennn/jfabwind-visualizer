import { useState, memo } from 'react';
import { Play, CheckCircle2, XCircle, ListFilter, Fingerprint, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BatchTester } from './BatchTester';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const StringTester = memo(() => {
  const { dfa, lang, theme, setTestActiveElements, clearTestActiveElements } = useStore();
  const [inputString, setInputString] = useState('');
  const [result, setResult] = useState<{ accepted: boolean; path: string[] } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [formattedPath, setFormattedPath] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  if (!dfa) return null;

  const handleTest = async () => {
    if (isTesting) return;
    setIsTesting(true);
    setResult(null);

    let currentState = dfa.startState;
    let currentPath = currentState;
    setFormattedPath(currentPath);
    setTestActiveElements([currentState], []);

    let i = 0;
    let failed = false;

    while (i < inputString.length) {
      await new Promise(r => setTimeout(r, 600));
      const char = inputString[i];
      const transition = dfa.transitions.find(tr => tr.from === currentState && tr.symbol === char);

      if (!transition) {
        failed = true;
        break;
      }

      const edgeId = `${currentState}-${transition.to}`;
      currentState = transition.to;
      currentPath += ` →(${char}) ${currentState}`;

      setFormattedPath(currentPath);
      setTestActiveElements([currentState], [edgeId]);
      i++;
    }

    await new Promise(r => setTimeout(r, 600));
    
    const accepted = !failed && dfa.acceptStates.includes(currentState);
    
    setResult({ accepted, path: currentPath.split('→') });
    clearTestActiveElements();
    setIsTesting(false);
  };

  return (
    <div id="string-tester-container" className={`rounded-2xl overflow-hidden flex flex-col h-full border backdrop-blur-xl transition-all duration-300 ${
      isDark ? 'bg-white/2 border-white/5 shadow-xl shadow-black/50' : 'bg-white/80 border-slate-200 shadow-lg'
    }`}>
      <div className={`flex border-b shrink-0 ${isDark ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-slate-50/50'}`}>
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
            activeTab === 'single'
              ? (isDark ? 'bg-[#080810]' : 'bg-white text-violet-600 border-b-2 border-violet-600')
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> {t.singleTest}
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex-1 py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
            activeTab === 'batch'
              ? (isDark ? 'bg-[#080810]' : 'bg-white text-violet-600 border-b-2 border-violet-600')
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" /> {t.batchTest}
        </button>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {activeTab === 'single' ? (
          <>
            <p className={`text-xs font-medium mb-5 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {t.testDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputString}
                onChange={(e) => {
                  setInputString(e.target.value);
                  setResult(null);
                  setFormattedPath('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                placeholder={t.testPlaceholder}
                disabled={isTesting}
                className={`flex-1 px-4 py-3 text-sm rounded-xl outline-none font-mono transition-all border disabled:opacity-50 ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white focus:border-violet-500 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500 focus:bg-white'
                }`}
              />
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="w-full sm:w-auto px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-violet-500/20 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t.btnTest}
              </button>
            </div>

            {isTesting && (
              <div className={`mt-6 p-4 sm:p-5 rounded-2xl border flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                  <Loader2 className="w-4 h-4 animate-spin" /> {lang === 'id' ? 'Menguji String...' : 'Testing String...'}
                </div>
                <div className="text-xs sm:text-sm font-mono font-semibold text-amber-600 dark:text-amber-400 break-all leading-relaxed sm:leading-loose">
                  {formattedPath}
                </div>
              </div>
            )}

            {result && !isTesting && (
              <div className={`mt-6 p-4 sm:p-5 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col sm:flex-row sm:items-center gap-4 ${
                result.accepted 
                  ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200') 
                  : (isDark ? 'bg-pink-500/10 border-pink-500/20' : 'bg-pink-50 border-pink-200')
              }`}>
                {result.accepted ? (
                  <div className={`p-2 rounded-full self-start sm:self-auto ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
                ) : (
                  <div className={`p-2 rounded-full self-start sm:self-auto ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}><XCircle className="w-6 h-6 text-pink-500" /></div>
                )}
                <div className="min-w-0 flex-1">
                  <div className={`font-black uppercase tracking-widest text-xs mb-2 ${result.accepted ? 'text-emerald-500' : 'text-pink-500'}`}>
                    {result.accepted ? 'Accepted (Diterima)' : 'Rejected (Ditolak)'}
                  </div>
                  <div className={`text-xs sm:text-sm font-mono break-all font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="opacity-50 text-[10px] tracking-tighter mr-2 bg-black/20 px-2 py-1 rounded">PATH</span>
                    {formattedPath}
                  </div>
                </div>
              </div>
            )}
            
            {!result && !isTesting && (
               <div className="mt-10 flex-1 flex flex-col items-center justify-center opacity-10">
                  <Fingerprint className={`w-16 h-16 sm:w-20 sm:h-20 ${isDark ? 'text-white' : 'text-slate-900'}`} />
               </div>
            )}
          </>
        ) : (
          <BatchTester />
        )}
      </div>
    </div>
  );
});