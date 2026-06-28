import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, GitCommit, Search, GitBranch, BarChart, GraduationCap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toPostfix } from '../algorithms/regexToNFA';
import { epsilonClosure } from '../algorithms/nfaToDFA';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const EducationPanel = () => {
  const { nfa, dfa, regex, isEduMode, lang, theme, setTestActiveElements, clearTestActiveElements } = useStore();
  const [step, setStep] = useState(1);
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  const postfix = useMemo(() => regex ? toPostfix(regex) : '', [regex]);
  
  const epsClosures = useMemo(() => {
    if (!nfa) return {};
    const closures: Record<string, string[]> = {};
    nfa.states.forEach(s => {
      closures[s] = epsilonClosure([s], nfa.transitions);
    });
    return closures;
  }, [nfa]);

  useEffect(() => {
    if (!isEduMode || !nfa || !dfa) {
      clearTestActiveElements();
      return;
    }

    switch (step) {
      case 1:
        clearTestActiveElements();
        break;
      case 2:
        setTestActiveElements(nfa.states, []);
        break;
      case 3:
        { const startStateClosure = epsClosures[nfa.startState] || [];
        setTestActiveElements(startStateClosure, []);
        break; }
      case 4:
        setTestActiveElements(dfa.states, []);
        break;
      case 5:
        clearTestActiveElements();
        break;
      default:
        clearTestActiveElements();
        break;
    }

    return () => clearTestActiveElements();
  }, [step, isEduMode, nfa, dfa, setTestActiveElements, clearTestActiveElements, epsClosures]);

  if (!isEduMode || !nfa || !dfa) return null;

  const steps = [
    {
      id: 1, title: t.step1Title, icon: <Search className="w-4 h-4 sm:w-5 sm:h-5" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t.step1Desc}</p>
          <div className={`p-3 sm:p-4 rounded-xl border font-mono transition-colors break-all ${isDark ? 'bg-black/40 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <span className="text-violet-500 font-bold shrink-0">Input :</span> {regex}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <span className="text-pink-500 font-bold shrink-0">Postfix:</span> {postfix}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2, title: t.step2Title, icon: <GitCommit className="w-4 h-4 sm:w-5 sm:h-5" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t.step2Desc}</p>
          <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            <li>{t.step2Bullet1}</li>
            <li>{t.step2Bullet2}</li>
            <li>{t.step2Bullet3}</li>
            <li>{t.step2Bullet4}</li>
          </ul>
          <p className="font-bold text-violet-500">{t.step2Total.replace('{count}', nfa.states.length.toString())}</p>
        </div>
      )
    },
    {
      id: 3, title: t.step3Title, icon: <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t.step3Desc}</p>
          <div className={`max-h-[180px] overflow-auto custom-scrollbar border rounded-xl ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
              <thead className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-[#080810]/90 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="px-3 py-2 sm:px-4 border-b uppercase tracking-widest font-black text-[9px] sm:text-[10px]">{t.step3TableCol1}</th>
                  <th className="px-3 py-2 sm:px-4 border-b uppercase tracking-widest font-black text-[9px] sm:text-[10px]">{t.step3TableCol2}</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {Object.entries(epsClosures).map(([s, cls]) => (
                  <tr 
                    key={s} 
                    className={`cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                    onMouseEnter={() => setTestActiveElements(cls, [])}
                    onMouseLeave={() => setTestActiveElements(epsClosures[nfa.startState] || [], [])}
                  >
                    <td className="px-3 py-2 sm:px-4 font-bold text-violet-400">{s}</td>
                    <td className="px-3 py-2 sm:px-4 text-sky-400">{`{${cls.join(', ')}}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[9px] sm:text-[10px] italic text-slate-500 text-center">{t.step3Hint}</p>
        </div>
      )
    },
    {
      id: 4, title: t.step4Title, icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t.step4Desc}</p>
          <div className={`max-h-[180px] overflow-auto custom-scrollbar border rounded-xl ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
              <thead className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-[#080810]/90 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="px-3 py-2 sm:px-4 border-b uppercase tracking-widest font-black text-[9px] sm:text-[10px]">{t.step4TableCol1}</th>
                  <th className="px-3 py-2 sm:px-4 border-b uppercase tracking-widest font-black text-[9px] sm:text-[10px]">{t.step4TableCol2}</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {dfa.mapping && Object.entries(dfa.mapping).map(([dfaS, nfaSet]) => (
                  <tr 
                    key={dfaS} 
                    className={`cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                    onMouseEnter={() => setTestActiveElements([dfaS], [])}
                    onMouseLeave={() => setTestActiveElements(dfa.states, [])}
                  >
                    <td className="px-3 py-2 sm:px-4 font-bold text-pink-400">{dfaS}</td>
                    <td className="px-3 py-2 sm:px-4 text-violet-400">{`{${nfaSet.join(', ')}}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[9px] sm:text-[10px] italic text-slate-500 text-center">{t.step4Hint}</p>
        </div>
      )
    },
    {
      id: 5, title: t.step5Title, icon: <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div 
              className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${isDark ? 'bg-violet-500/5 border-violet-500/20 hover:bg-violet-500/10' : 'bg-violet-50 border-violet-200 hover:bg-violet-100'}`}
              onMouseEnter={() => setTestActiveElements(nfa.states, [])}
              onMouseLeave={() => clearTestActiveElements()}
            >
              <h4 className={`font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{t.step5NfaStruct}</h4>
              <div className="flex justify-between font-mono"><span>{t.step5States}</span> <span className="font-bold">{nfa.states.length}</span></div>
              <div className="flex justify-between font-mono"><span>{t.step5Transitions}</span> <span className="font-bold">{nfa.transitions.length}</span></div>
            </div>
            <div 
              className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${isDark ? 'bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10' : 'bg-sky-50 border-sky-200 hover:bg-sky-100'}`}
              onMouseEnter={() => setTestActiveElements(dfa.states, [])}
              onMouseLeave={() => clearTestActiveElements()}
            >
              <h4 className={`font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-2 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>{t.step5DfaStruct}</h4>
              <div className="flex justify-between font-mono"><span>{t.step5States}</span> <span className="font-bold">{dfa.states.length}</span></div>
              <div className="flex justify-between font-mono"><span>{t.step5Transitions}</span> <span className="font-bold">{dfa.transitions.length}</span></div>
            </div>
          </div>
          <p className={`italic ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {t.step5Conclusion}
          </p>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      className={`rounded-2xl border backdrop-blur-xl mb-6 sm:mb-8 overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-white/2 border-white/5 shadow-xl' : 'bg-white/80 border-slate-200 shadow-lg'
      }`}
    >
      <div className={`px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className={`flex items-center gap-1.5 sm:gap-2 font-black uppercase tracking-widest text-[10px] sm:text-xs ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          <h2>{t.eduPanelTitle}</h2>
        </div>
        <div className={`text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${
          isDark ? 'text-slate-400 border-white/10 bg-white/5' : 'text-slate-500 border-slate-200 bg-white shadow-sm'
        }`}>
          {t.eduStepOf.replace('{current}', step.toString()).replace('{total}', '5')}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto custom-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {steps.map(s => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                step === s.id 
                  ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20 active:scale-95' 
                  : (isDark ? 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100')
              }`}
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="min-h-[160px] sm:min-h-[180px]"
          >
            {steps.find(s => s.id === step)?.content}
          </motion.div>
        </AnimatePresence>

        <div className={`flex items-center justify-between mt-6 pt-4 sm:mt-8 sm:pt-5 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-30 border ${
              isDark ? 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t.btnPrev}
          </button>
          <button
            onClick={() => setStep(Math.min(5, step + 1))}
            disabled={step === 5}
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all active:scale-95 disabled:opacity-30 shadow-lg shadow-violet-500/20 flex items-center gap-1.5"
          >
            {t.btnNext} <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};