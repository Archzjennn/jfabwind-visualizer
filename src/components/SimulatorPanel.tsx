import { useState, useEffect, useMemo, memo } from 'react';
import { Play, Pause, RotateCcw, SkipForward, FastForward, CheckCircle2, XCircle, TerminalSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { epsilonClosure } from '../algorithms/nfaToDFA';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const move = (states: string[], symbol: string, transitions: any[]): string[] => {
  const result = new Set<string>();
  states.forEach(state => {
    transitions.filter(t => t.from === state && t.symbol === symbol).forEach(t => result.add(t.to));
  });
  return Array.from(result).sort();
};

export const SimulatorPanel = memo(() => {
  const { nfa, dfa, theme, lang, setTestActiveElements, clearTestActiveElements } = useStore();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'NFA' | 'DFA'>('DFA');
  const automaton = mode === 'DFA' ? dfa : nfa;

  const [inputString, setInputString] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    if (!dfa && nfa) setMode('NFA');
  }, [dfa, nfa]);

  const simulationSteps = useMemo(() => {
    if (!automaton) return [];
    const steps = [];
    const chars = inputString.split('');
    const transitions = automaton.transitions;

    let currentNodes = mode === 'NFA' 
      ? epsilonClosure([automaton.startState], transitions)
      : [automaton.startState];
    
    steps.push({ char: 'Start', nodes: currentNodes, edges: [] });

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const nextNodesRaw = move(currentNodes, char, transitions);
      const nextNodes = mode === 'NFA' ? epsilonClosure(nextNodesRaw, transitions) : nextNodesRaw;

      const usedEdges: string[] = [];
      currentNodes.forEach(fromNode => {
        transitions.forEach(t => {
          if (t.from === fromNode && t.symbol === char && nextNodesRaw.includes(t.to)) {
            usedEdges.push(`${t.from}-${t.to}`);
          }
        });
      });

      steps.push({ char, nodes: nextNodes, edges: usedEdges });
      currentNodes = nextNodes;
      if (currentNodes.length === 0) break;
    }
    return steps;
  }, [automaton, inputString, mode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentStep < simulationSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (isPlaying && currentStep >= simulationSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, simulationSteps.length, speed]);

  useEffect(() => {
    if (simulationSteps.length > 0 && currentStep < simulationSteps.length) {
      const step = simulationSteps[currentStep];
      setTestActiveElements(step.nodes, step.edges);
    } else {
      clearTestActiveElements();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, simulationSteps]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    clearTestActiveElements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputString, automaton]);

  if (!automaton) return null;

  const isFinished = currentStep === simulationSteps.length - 1 && simulationSteps.length > 0;
  const finalNodes = isFinished ? simulationSteps[currentStep].nodes : [];
  const isAccepted = finalNodes.some(node => automaton.acceptStates.includes(node));
  const isDeadEnd = finalNodes.length === 0;

  return (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${isDark ? 'bg-white/2 border-white/5 shadow-md shadow-black/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
      
      <div className={`px-4 py-2 flex items-center justify-between border-b ${isDark ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className="flex items-center gap-2">
          <TerminalSquare className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
          <h3 className={`font-black uppercase tracking-widest text-[10px] ${isDark ? 'text-white' : 'text-slate-800'}`}>Simulator</h3>
        </div>
        {dfa && nfa && (
          <div className={`flex p-0.5 rounded-md border ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            {(['NFA', 'DFA'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-2 py-0.5 text-[9px] font-bold rounded ${mode === m ? (isDark ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                {m === 'NFA' ? (lang === 'id' ? 'UJI NFA' : 'TEST NFA') : (lang === 'id' ? 'UJI DFA' : 'TEST DFA')}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 space-y-2.5">
        
        <div className="flex gap-2">
          <input
            type="text" value={inputString} onChange={(e) => setInputString(e.target.value)}
            placeholder={lang === 'id' ? 'Uji string (misal: aab)...' : 'Test string (e.g: aab)...'}
            className={`flex-1 px-3 py-1.5 rounded-lg border outline-none font-mono font-bold text-xs ${isDark ? 'bg-[#0b0b14] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
          />
          {inputString && isFinished && (
            <div className={`flex items-center justify-center gap-1 px-3 py-1 rounded-lg border shrink-0 ${isAccepted ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-600') : (isDark ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-pink-50 border-pink-300 text-pink-600')}`}>
              {isAccepted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span className="font-black uppercase tracking-widest text-[9px]">
                {isAccepted ? (lang === 'id' ? 'Diterima' : 'Accepted') : (isDeadEnd ? (lang === 'id' ? 'Buntu' : 'Dead End') : (lang === 'id' ? 'Ditolak' : 'Rejected'))}
              </span>
            </div>
          )}
        </div>

        {inputString && (
          <div className={`p-2 flex flex-wrap gap-1 rounded-lg border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <div className={`w-6 h-6 flex items-center justify-center rounded border ${currentStep === 0 ? (isDark ? 'bg-sky-600 border-sky-400 text-white' : 'bg-sky-500 border-sky-300 text-white') : (isDark ? 'bg-black/50 border-white/10 text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}>
              <span className="text-[7px] font-bold">START</span>
            </div>
            {inputString.split('').map((char, idx) => {
              const isActive = currentStep === idx + 1;
              const isPast = currentStep > idx + 1;
              return (
                <div key={idx} className={`w-6 h-6 flex items-center justify-center rounded border font-mono font-black text-[10px] transition-all ${isActive ? (isDark ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-110' : 'bg-amber-100 border-amber-500 text-amber-700 scale-110') : isPast ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500/50' : 'bg-emerald-50 border-emerald-200 text-emerald-400') : (isDark ? 'bg-black/50 border-white/10 text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}>
                  {char}
                </div>
              )
            })}
          </div>
        )}

        <div className={`flex items-center justify-between p-1 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={currentStep === 0} className={`p-1.5 rounded transition-all ${currentStep === 0 ? 'opacity-30' : (isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600')}`}>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setIsPlaying(!isPlaying); if(isFinished) setCurrentStep(0); }} disabled={!inputString} className={`p-1.5 rounded transition-all flex items-center gap-1 ${!inputString ? 'opacity-30' : (isDark ? 'bg-sky-600 text-white' : 'bg-sky-500 text-white')}`}>
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button onClick={() => setCurrentStep(prev => Math.min(simulationSteps.length - 1, prev + 1))} disabled={isFinished || !inputString || isPlaying} className={`p-1.5 rounded transition-all ${isFinished || !inputString || isPlaying ? 'opacity-30' : (isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600')}`}>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-2">
            <FastForward className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input type="range" min="200" max="2000" step="200" value={2200 - speed} onChange={(e) => setSpeed(2200 - Number(e.target.value))} className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500" />
          </div>
        </div>

      </div>
    </div>
  );
});