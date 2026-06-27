import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, AlertCircle, HelpCircle, ChevronDown, Link as LinkIcon, History, Trash2, X, Fingerprint, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { regexToNFA } from '../algorithms/regexToNFA';
import { nfaToDFA } from '../algorithms/nfaToDFA';
import { preprocessRegex } from '../algorithms/regexPreprocessor';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

// Pool of Examples (Rotasi setiap 60 detik)
const EXAMPLE_SETS = [
  ['a+b', 'a?b', 'a{3}', '[ab]c'],
  ['(0|1)*', '1(0|1)+', '0{2,4}', '[0-9]+'],
  ['[a-z]+', '(ab|cd)?', 'a*b+c?', '(0|1)*111']
];

// FIX: Syntax Guide Dictionary agar mendukung ID dan EN
const SYNTAX_GUIDE = [
  { symbol: '(s)', id: 'Grouping (Pengelompokan)', en: 'Grouping' },
  { symbol: 's|t', id: 'Union (Atau)', en: 'Union (Alternation)' },
  { symbol: 's*', id: '0 atau lebih (Kleene Star)', en: '0 or more (Kleene Star)' },
  { symbol: 's+', id: '1 atau lebih (Plus)', en: '1 or more (Plus)' },
  { symbol: 's?', id: '0 atau 1 (Opsional)', en: '0 or 1 (Optional)' },
  { symbol: 's{n}', id: 'Tepat n kali', en: 'Exactly n times' },
  { symbol: '[a-z]', id: 'Karakter Range', en: 'Character Range' },
  { symbol: '[abc]', id: 'Kumpulan Karakter', en: 'Character Set' },
];

export const RegexInput = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSyntax, setShowSyntax] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [exampleIndex, setExampleIndex] = useState(0);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('regex-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const { setRegex, setAutomata, showToast, history, addHistory, removeHistory, clearHistory, lang, theme } = useStore();
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % EXAMPLE_SETS.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('regex-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const validateRegex = (regexToValidate: string): boolean => {
    if (!regexToValidate) {
      setError(t.errEmpty);
      return false;
    }
    let parens = 0, brackets = 0, braces = 0;
    for (const char of regexToValidate) {
      if (char === '(') parens++;
      if (char === ')') parens--;
      if (char === '[') brackets++;
      if (char === ']') brackets--;
      if (char === '{') braces++;
      if (char === '}') braces--;
      
      if (parens < 0) { setError(t.errParenClose); return false; }
      if (brackets < 0) { setError(lang === 'id' ? "Kurung siku ']' kelebihan." : "Extra closing bracket ']'."); return false; }
      if (braces < 0) { setError(lang === 'id' ? "Kurung kurawal '}' kelebihan." : "Extra closing brace '}'."); return false; }
    }
    if (parens > 0) { setError(t.errParenOpen); return false; }
    if (brackets > 0) { setError(lang === 'id' ? "Kurung siku '[' belum ditutup." : "Unclosed bracket '['."); return false; }
    if (braces > 0) { setError(lang === 'id' ? "Kurung kurawal '{' belum ditutup." : "Unclosed brace '{'."); return false; }
    
    return true;
  };

  const processRegex = async (regexValue: string) => {
    setError(null);
    if (!validateRegex(regexValue)) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const expandedRegex = preprocessRegex(regexValue);
      const nfa = regexToNFA(expandedRegex);
      const dfa = nfaToDFA(nfa);
      
      setAutomata(nfa, dfa);
      setRegex(regexValue); 
      addHistory(regexValue);
      
      const url = new URL(window.location.href);
      url.searchParams.set('regex', regexValue);
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.error(err);
      setError(t.errInvalid);
      setAutomata(null, null);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regexParam = params.get('regex');
    if (regexParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInput(regexParam);
      processRegex(regexParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- KARTU RECENTLY VIEWED ---
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setInput(customEvent.detail);
        processRegex(customEvent.detail);
      }
    };
    window.addEventListener('trigger-process-regex', handleTrigger);
    return () => window.removeEventListener('trigger-process-regex', handleTrigger);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // -------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (!isProcessing) processRegex(input);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        // eslint-disable-next-line react-hooks/immutability
        if (input && !isProcessing) handleCopyLink();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHistory(prev => !prev);
        setShowSyntax(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isProcessing]);

  const handleVisualize = () => processRegex(input);

  const handleCopyLink = async () => {
    if (!input) return;
    const url = new URL(window.location.href);
    url.searchParams.set('regex', input);
    try {
      await navigator.clipboard.writeText(url.toString());
      showToast(t.toastCopied);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const handleScroll = () => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const toggleFavorite = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    if (favorites.includes(item)) {
      setFavorites(favorites.filter(f => f !== item));
    } else {
      if (favorites.length >= 5) {
        showToast(lang === 'id' ? 'Maksimal 5 favorit!' : 'Max 5 favorites reached!', 'warning');
        return;
      }
      setFavorites([...favorites, item]);
      showToast(lang === 'id' ? 'Disematkan ke favorit ⭐' : 'Pinned to favorites ⭐', 'success');
    }
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    return text.split('').map((char, i) => {
      if (['(', ')'].includes(char)) return <span key={i} className="text-amber-500 font-bold">{char}</span>;
      if (char === '|') return <span key={i} className="text-sky-500 font-bold">{char}</span>;
      if (['*', '+', '?'].includes(char)) return <span key={i} className="text-emerald-500 font-black">{char}</span>;
      if (['{', '}', '[', ']'].includes(char)) return <span key={i} className="text-pink-500 font-bold">{char}</span>;
      return <span key={i} className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{char}</span>;
    });
  };

  return (
    <div className={`w-full max-w-4xl mx-auto mt-8 rounded-2xl p-6 transition-all duration-300 border backdrop-blur-xl relative overflow-hidden ${
      isDark ? 'bg-white/5 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-white/80 border-slate-200 shadow-xl'
    }`}>
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 transition-colors duration-500 ${isDark ? 'bg-violet-600/10' : 'bg-violet-300/20'}`} />
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] -z-10 transition-colors duration-500 ${isDark ? 'bg-pink-600/10' : 'bg-pink-300/20'}`} />

      <div className="flex flex-col gap-5 z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className={`text-sm font-bold tracking-wide uppercase flex items-center gap-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
            <Fingerprint className="w-4 h-4" />
            {t.inputLabel}
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.example}
            </span>
            <AnimatePresence mode="wait">
              <motion.div 
                key={exampleIndex}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2"
              >
                {EXAMPLE_SETS[exampleIndex].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => { setInput(ex); setError(null); processRegex(ex); }}
                    className={`text-[11px] px-3 py-1 rounded-full font-mono transition-all font-semibold ${
                      isDark ? 'bg-white/5 hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 border border-white/5 hover:border-violet-500/30' 
                             : 'bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 border border-transparent'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div
              ref={overlayRef}
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full px-5 py-4 rounded-xl border-2 border-transparent text-xl tracking-wider font-mono overflow-hidden whitespace-pre pointer-events-none transition-all flex items-center ${
                isDark ? 'bg-black/40' : 'bg-slate-50'
              }`}
            >
              {input ? renderHighlightedText(input) : (
                <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>
                  {t.inputPlaceholder}
                </span>
              )}
            </div>

            <input
              id="tour-regex-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); if (error) setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && !e.ctrlKey && handleVisualize()}
              onScroll={handleScroll}
              spellCheck="false"
              autoComplete="off"
              className={`relative z-10 w-full px-5 py-4 rounded-xl border-2 outline-none transition-all font-mono text-xl tracking-wider bg-transparent ${
                isDark 
                  ? 'text-transparent caret-violet-400 border-white/10 hover:border-white/20 focus:border-violet-500 focus:bg-violet-500/5 focus:shadow-[0_0_20px_rgba(124,58,237,0.3)]' 
                  : 'text-transparent caret-violet-600 border-slate-200 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_20px_rgba(124,58,237,0.15)]'
              }`}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
              onClick={handleCopyLink} disabled={!input || isProcessing} 
              title={`${t.copyLink} (Ctrl + L)`} 
              className={`px-5 py-4 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full border ${
                isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-sm'
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              <span className="sm:hidden ml-2">{t.copyLink}</span>
            </motion.button>
            
            <motion.button 
              id="tour-visualize-btn"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
              onClick={handleVisualize} disabled={isProcessing} 
              title={`${t.visualize} (Ctrl + Enter)`} 
              className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto w-full shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              {t.visualize}
            </motion.button>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-2">
          <button onClick={() => { setShowSyntax(!showSyntax); setShowHistory(false); }} className={`flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors ${showSyntax ? 'text-violet-500' : (isDark ? 'text-slate-500 hover:text-violet-400' : 'text-slate-400 hover:text-violet-600')}`}>
            <HelpCircle className="w-4 h-4" /> {t.syntaxGuide}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showSyntax ? 'rotate-180' : ''}`} />
          </button>
          
          <button onClick={() => { setShowHistory(!showHistory); setShowSyntax(false); }} title={`${t.history} (Ctrl + H)`} className={`flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors ${showHistory ? 'text-violet-500' : (isDark ? 'text-slate-500 hover:text-violet-400' : 'text-slate-400 hover:text-violet-600')}`}>
            <History className="w-4 h-4" /> {t.history} ({history.length + favorites.length})
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showSyntax && (
            <motion.div key="syntax" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border mt-2 ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50/50 border-slate-200/60'}`}>
                {SYNTAX_GUIDE.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <code className={`px-2 py-1 rounded text-xs font-mono font-bold min-w-[4rem] text-center border ${isDark ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-violet-50 text-violet-600 border-violet-100'}`}>
                      {item.symbol}
                    </code>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'id' ? item.id : item.en}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {showHistory && (
            <motion.div key="history" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className={`p-5 rounded-xl border mt-2 ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50/50 border-slate-200/60'}`}>
                
                <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                  <span className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.history}</span>
                  {history.length > 0 && (
                    <button onClick={() => clearHistory()} className="text-[10px] font-bold uppercase tracking-wider text-pink-500 hover:text-pink-400 flex items-center gap-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> {t.clearAll}
                    </button>
                  )}
                </div>
                
                {(history.length === 0 && favorites.length === 0) ? (
                  <div className={`text-center py-6 text-sm font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{t.noHistory}</div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {favorites.length > 0 && (
                      <div>
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                          <Star className="w-3.5 h-3.5 fill-current" /> {lang === 'id' ? 'Favorit' : 'Favorites'}
                        </div>
                        <ul className="space-y-1.5">
                          {favorites.map((fav, idx) => (
                            <motion.li layout key={`fav-${fav}-${idx}`} className={`flex items-center justify-between p-2 rounded-lg border transition-all group ${isDark ? 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40' : 'bg-amber-50 border-amber-200 hover:border-amber-400 shadow-sm'}`}>
                              <button onClick={() => { setInput(fav); processRegex(fav); setShowHistory(false); }} className="flex-1 text-left flex items-center gap-2">
                                <span className={`font-mono text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{fav}</span>
                              </button>
                              <button onClick={(e) => toggleFavorite(e, fav)} className={`p-1.5 rounded transition-all ${isDark ? 'text-amber-500 hover:bg-amber-500/20' : 'text-amber-600 hover:bg-amber-100'}`} title={lang === 'id' ? 'Hapus dari Favorit' : 'Remove from Favorites'}>
                                <Star className="w-4 h-4 fill-current drop-shadow-sm" />
                              </button>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {history.length > 0 && (
                      <div>
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          <History className="w-3.5 h-3.5" /> {lang === 'id' ? 'Riwayat' : 'Recent'}
                        </div>
                        <ul className="space-y-1.5">
                          {history.map((item) => {
                            const isPinned = favorites.includes(item.regex);
                            return (
                              <motion.li layout key={item.regex} className={`flex items-center justify-between p-2 rounded-lg border transition-all group ${isDark ? 'bg-white/5 border-white/5 hover:border-violet-500/30' : 'bg-white border-slate-200 hover:border-violet-300 shadow-sm'}`}>
                                <button onClick={() => { setInput(item.regex); processRegex(item.regex); setShowHistory(false); }} className="flex-1 text-left flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden">
                                  <span className={`font-mono text-sm font-bold truncate ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>{item.regex}</span>
                                  <span className={`text-[10px] font-medium tracking-wide shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{formatTime(item.timestamp)}</span>
                                </button>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => toggleFavorite(e, item.regex)} className={`p-1.5 rounded transition-all ${isPinned ? 'text-amber-500' : (isDark ? 'text-slate-500 hover:text-amber-400 hover:bg-white/5' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50')}`} title={lang === 'id' ? 'Sematkan ke Favorit' : 'Pin to Favorites'}>
                                    <Star className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                                  </button>
                                  <button onClick={() => removeHistory(item.regex)} className={`p-1.5 rounded transition-all ${isDark ? 'text-slate-500 hover:text-pink-400 hover:bg-pink-500/20' : 'text-slate-400 hover:text-pink-600 hover:bg-pink-50'}`} title={lang === 'id' ? 'Hapus' : 'Delete'}>
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div key="error" initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="overflow-hidden mt-3">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-pink-50 border-pink-200 text-pink-600'}`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};