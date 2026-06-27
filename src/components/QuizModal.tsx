import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, Trophy, Lock, Star, Zap, Activity, Flame, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useQuizStore, type LevelData } from '../store/useQuizStore';
import { AutomataGraph } from './AutomataGraph';

// bank soal
import { quizBankGroup1, type QuizQuestion } from '../data/quizBank1';
import { quizBankGroup2 } from '../data/quizBank2';
import { quizBankGroup3 } from '../data/quizBank3';
import { quizBankGroup4 } from '../data/quizBank4';
import { quizBankGroup5 } from '../data/quizBank5';
import { quizBankGroup6 } from '../data/quizBank6';

type QuizState = 'map' | 'playing' | 'result';
type TabCategory = 'pemula' | 'menengah' | 'lanjutan' | 'expert';

const DUMMY_QUESTIONS: QuizQuestion[] = Array(5).fill(null).map((_, i) => ({
  id: `dummy-${i}`,
  level_group: 0,
  difficulty: 'sangat_mudah',
  category: 'dummy',
  question: {
    id: `(Soal dalam tahap penyusunan) Pilih opsi B untuk melanjutkan.`,
    en: `(Question under construction) Choose option B to proceed.`
  },
  options: {
    id: ['Jawaban A salah', 'Jawaban B benar', 'Jawaban C salah', 'Jawaban D salah'],
    en: ['Option A is wrong', 'Option B is correct', 'Option C is wrong', 'Option D is wrong']
  },
  correctIdx: 1,
  explanation: {
    id: 'Opsi B adalah jawaban benar pada simulasi ini.',
    en: 'Option B is the correct answer in this simulation.'
  },
  type: 'text'
}));

const LETTERS = ['A', 'B', 'C', 'D'];

export const QuizModal = () => {
  const { isQuizOpen, closeQuiz, lang, theme, showToast } = useStore();
  const { energy, totalPoints, rank, currentStreak, levels, stats, syncEnergy, deductEnergy, addEnergy, updateLevelProgress, addPoints, updateStats, incrementStreak, resetStreak } = useQuizStore();

  const isDark = theme === 'dark';

  const [gameState, setGameState] = useState<QuizState>('map');
  const [activeTab, setActiveTab] = useState<TabCategory>('pemula');
  const [timeUntilNextEnergy, setTimeUntilNextEnergy] = useState<string>('');

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [playQuestions, setPlayQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answersStatus, setAnswersStatus] = useState<('unanswered' | 'correct' | 'wrong')[]>(Array(5).fill('unanswered'));

  const [wrongQueue, setWrongQueue] = useState<number[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);

  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [runPoints, setRunPoints] = useState(0);
  const [runCorrectFirst, setRunCorrectFirst] = useState(0);
  const [runAttempts, setRunAttempts] = useState(0);

  const [resultData, setResultData] = useState({ stars: 0, basePoints: 0, starBonus: 0, streakBonus: 0, totalPoints: 0, energyReward: 0, rankUpTo: null as string | null });

  useEffect(() => {
    if (!isQuizOpen) return;
    syncEnergy();
    const interval = setInterval(() => {
      const currentEnergy = useQuizStore.getState().energy;
      const lastUpdate = useQuizStore.getState().lastEnergyUpdate;
      if (currentEnergy >= 25) { setTimeUntilNextEnergy(''); return; }
      const diff = (lastUpdate + 3600000) - Date.now();
      if (diff <= 0) syncEnergy();
      else setTimeUntilNextEnergy(`${Math.floor(diff / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizOpen, syncEnergy]);

  const getRankProgress = (points: number, totalStars: number) => {
    if (rank === "ULTIMATE") return { current: "ULTIMATE", next: "MAX", progress: 100, max: points };
    if (points >= 22000) return { current: "Legenda", next: "ULTIMATE", progress: (totalStars/300)*100, currentVal: totalStars, maxVal: 300 };
    if (points >= 16000) return { current: "Grandmaster", next: "Legenda", progress: ((points-16000)/6000)*100, currentVal: points, maxVal: 22000 };
    if (points >= 11500) return { current: "Master", next: "Grandmaster", progress: ((points-11500)/4500)*100, currentVal: points, maxVal: 16000 };
    if (points >= 8000) return { current: "Ilmuwan", next: "Master", progress: ((points-8000)/3500)*100, currentVal: points, maxVal: 11500 };
    if (points >= 5500) return { current: "Pakar", text: "Ilmuwan", progress: ((points-5500)/2500)*100, currentVal: points, maxVal: 8000 };
    if (points >= 3500) return { current: "Ahli", next: "Pakar", progress: ((points-3500)/2000)*100, currentVal: points, maxVal: 5500 };
    if (points >= 2000) return { current: "Mahir", next: "Ahli", progress: ((points-2000)/1500)*100, currentVal: points, maxVal: 3500 };
    if (points >= 1000) return { current: "Terampil", next: "Mahir", progress: ((points-1000)/1000)*100, currentVal: points, maxVal: 2000 };
    if (points >= 500) return { current: "Penggiat", next: "Terampil", progress: ((points-500)/500)*100, currentVal: points, maxVal: 1000 };
    if (points >= 200) return { current: "Pelajar", next: "Penggiat", progress: ((points-200)/300)*100, currentVal: points, maxVal: 500 };
    return { current: "Pemula", next: "Pelajar", progress: (points/200)*100, currentVal: points, maxVal: 200 };
  };

  const rankInfo = getRankProgress(totalPoints, stats.totalStars);

  const getLevelsForTab = () => {
    let start = 1; let end = 25;
    if (activeTab === 'menengah') { start = 26; end = 50; }
    if (activeTab === 'lanjutan') { start = 51; end = 75; }
    if (activeTab === 'expert') { start = 76; end = 100; }
    const tabLevels = [];
    for (let i = start; i <= end; i++) tabLevels.push({ id: i, data: levels[i] });
    return tabLevels;
  };

  // 1. GOD MODE: Buka Semua Gembok Level
  // const isLevelUnlocked = (levelId: number) => {
  //   return true; 
  // };

  // // 2. GOD MODE: Abaikan energi tanpa memicu error ESLint
  // const handleStartLevel = (levelId: number) => {

  //   deductEnergy(0); 

  //   setCurrentLevel(levelId);
    
  //   let rawQuestions: QuizQuestion[];
  //   if (levelId <= 15) {
  //     rawQuestions = quizBankGroup1.slice((levelId - 1) * 5, (levelId - 1) * 5 + 5);
  //   } else if (levelId <= 30) {
  //     rawQuestions = quizBankGroup2.slice((levelId - 16) * 5, (levelId - 16) * 5 + 5);
  //   } else if (levelId <= 50) {
  //     rawQuestions = quizBankGroup3.slice((levelId - 31) * 5, (levelId - 31) * 5 + 5);
  //   } else if (levelId <= 70) {
  //     rawQuestions = quizBankGroup4.slice((levelId - 51) * 5, (levelId - 51) * 5 + 5);
  //   } else if (levelId <= 85) {
  //     rawQuestions = quizBankGroup5.slice((levelId - 71) * 5, (levelId - 71) * 5 + 5);
  //   } else {
  //     rawQuestions = quizBankGroup6.slice((levelId - 86) * 5, (levelId - 86) * 5 + 5);
  //   }

  //   if (rawQuestions.length < 5) {
  //     const padding = DUMMY_QUESTIONS.slice(0, 5 - rawQuestions.length);
  //     rawQuestions = [...rawQuestions, ...padding];
  //   }

  //   setPlayQuestions(rawQuestions);
  //   setQIndex(0);
  //   setAnswersStatus(Array(5).fill('unanswered'));
  //   setWrongQueue([]);
  //   setIsRetryMode(false);
  //   setIsAnswered(false);
  //   setSelectedOpt(null);
  //   setRunPoints(0);
  //   setRunCorrectFirst(0);
  //   setRunAttempts(0);
  //   setGameState('playing');
  // };

  // batas code god mode

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return levels[levelId - 1].completed;
  };

  const handleStartLevel = (levelId: number) => {
    if (!isLevelUnlocked(levelId)) return;
    if (energy < 5) {
      showToast(lang === 'id' ? 'Energi tidak cukup. Energi bertambah setiap jam.' : 'Not enough energy.', 'warning');
      return;
    }
    
    if (deductEnergy(5)) {
      setCurrentLevel(levelId);
      
      let rawQuestions: QuizQuestion[];
      if (levelId <= 15) {
        rawQuestions = quizBankGroup1.slice((levelId - 1) * 5, (levelId - 1) * 5 + 5);
      } else if (levelId <= 30) {
        rawQuestions = quizBankGroup2.slice((levelId - 16) * 5, (levelId - 16) * 5 + 5);
      } else if (levelId <= 50) {
        rawQuestions = quizBankGroup3.slice((levelId - 31) * 5, (levelId - 31) * 5 + 5);
      } else if (levelId <= 70) {
        rawQuestions = quizBankGroup4.slice((levelId - 51) * 5, (levelId - 51) * 5 + 5);
      } else if (levelId <= 85) {
        rawQuestions = quizBankGroup5.slice((levelId - 71) * 5, (levelId - 71) * 5 + 5);
      } else {
        rawQuestions = quizBankGroup6.slice((levelId - 86) * 5, (levelId - 86) * 5 + 5);
      }

      if (rawQuestions.length < 5) {
        const padding = DUMMY_QUESTIONS.slice(0, 5 - rawQuestions.length);
        rawQuestions = [...rawQuestions, ...padding];
      }

      setPlayQuestions(rawQuestions);
      setQIndex(0);
      setAnswersStatus(Array(5).fill('unanswered'));
      setWrongQueue([]);
      setIsRetryMode(false);
      setIsAnswered(false);
      setSelectedOpt(null);
      setRunPoints(0);
      setRunCorrectFirst(0);
      setRunAttempts(0);
      setGameState('playing');
    }
  };

  const handleSelectAnswer = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);
    setRunAttempts(prev => prev + 1);

    const activeQ = playQuestions[isRetryMode ? wrongQueue[0] : qIndex];
    const isCorrect = optIdx === activeQ.correctIdx;

    if (isCorrect) {
      if (!isRetryMode) {
        const newStatus = [...answersStatus];
        newStatus[qIndex] = 'correct';
        setAnswersStatus(newStatus);
        setRunPoints(prev => prev + 10);
        setRunCorrectFirst(prev => prev + 1);
        incrementStreak();
      } else {
        setRunPoints(prev => prev + 3);
      }
    } else {
      if (!isRetryMode) {
        const newStatus = [...answersStatus];
        newStatus[qIndex] = 'wrong';
        setAnswersStatus(newStatus);
        setWrongQueue(prev => [...prev, qIndex]);
        resetStreak();
      } else {
        resetStreak();
      }
    }
  };

  const handleFinishLevel = () => {
    let stars = 1;
    if (runCorrectFirst === 5) stars = 3;
    else if (runCorrectFirst >= 3) stars = 2;

    const starBonus = stars === 3 ? 15 : stars === 2 ? 7 : 2;
    const isPerfectStreak = runAttempts === 5;
    const streakBonus = isPerfectStreak ? 20 : 0;
    const totalEarnedPoints = runPoints + starBonus + streakBonus;

    const roll = Math.random() * 100;
    let eReward: number;
    if (isPerfectStreak) {
      if (roll <= 8.1) eReward = 5;
      else if (roll <= 25.6) eReward = 4;
      else if (roll <= 58.3) eReward = 3;
      else if (roll <= 83.0) eReward = 2;
      else eReward = 1;
    } else {
      if (roll <= 1.4) eReward = 5;
      else if (roll <= 8.1) eReward = 4;
      else if (roll <= 25.6) eReward = 3;
      else if (roll <= 58.3) eReward = 2;
      else eReward = 1;
    }

    const oldRank = useQuizStore.getState().rank;
    updateLevelProgress(currentLevel, stars, runCorrectFirst);
    addPoints(totalEarnedPoints);
    addEnergy(eReward);
    updateStats({
      totalAttempts: useQuizStore.getState().stats.totalAttempts + runAttempts,
      totalCorrect: useQuizStore.getState().stats.totalCorrect + 5
    });

    const newRank = useQuizStore.getState().rank;
    const rankUpTo = oldRank !== newRank ? newRank : null;

    setResultData({ stars, basePoints: runPoints, starBonus, streakBonus, totalPoints: totalEarnedPoints, energyReward: eReward, rankUpTo });
    setGameState('result');
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOpt(null);
    const activeQ = playQuestions[isRetryMode ? wrongQueue[0] : qIndex];
    const isCorrect = selectedOpt === activeQ.correctIdx;

    if (!isRetryMode) {
      if (qIndex < 4) setQIndex(prev => prev + 1);
      else {
        if (wrongQueue.length > 0) setIsRetryMode(true);
        else handleFinishLevel();
      }
    } else {
      if (isCorrect) {
        const newQueue = [...wrongQueue];
        newQueue.shift();
        setWrongQueue(newQueue);
        if (newQueue.length === 0) handleFinishLevel();
      } else {
        const newQueue = [...wrongQueue];
        const failedQ = newQueue.shift()!;
        newQueue.push(failedQ);
        setWrongQueue(newQueue);
      }
    }
  };

  const LevelCard = ({ levelId, data }: { levelId: number, data: LevelData }) => {
    const unlocked = isLevelUnlocked(levelId);
    let borderColor = isDark ? 'border-white/10' : 'border-slate-200';
    let bgColor = isDark ? 'bg-white/5' : 'bg-slate-50';
    let textColor = isDark ? 'text-slate-500' : 'text-slate-400';

    if (unlocked) {
      textColor = isDark ? 'text-white' : 'text-slate-800';
      bgColor = isDark ? 'bg-[#0b0b14] hover:bg-white/5' : 'bg-white hover:bg-slate-50';
      if (data.completed) {
        if (data.stars === 3) borderColor = isDark ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-violet-500 shadow-md';
        else if (data.stars === 2) borderColor = isDark ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-emerald-400';
        else borderColor = isDark ? 'border-lime-500/50' : 'border-lime-400';
      } else {
        borderColor = isDark ? 'border-sky-500/50' : 'border-sky-400';
      }
    }

    return (
      <button disabled={!unlocked} onClick={() => handleStartLevel(levelId)} className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${!unlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 active:scale-95'} ${borderColor} ${bgColor}`}>
        {!unlocked ? ( <Lock className={`w-6 h-6 mb-1 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} /> ) : (
          <div className="flex gap-0.5 mb-1.5 h-3">
            {[1, 2, 3].map((star) => (
              <Star key={star} className={`w-3 h-3 ${star <= data.stars ? (data.stars === 3 ? 'text-violet-500 fill-violet-500' : 'text-amber-400 fill-amber-400') : (isDark ? 'text-slate-700' : 'text-slate-200')}`} />
            ))}
          </div>
        )}
        <span className={`text-xl font-black font-mono tracking-tighter ${textColor}`}>{levelId}</span>
      </button>
    );
  };

  if (!isQuizOpen) return null;
  const activeQuestion = playQuestions[isRetryMode ? wrongQueue[0] : qIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeQuiz} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`relative w-full max-w-4xl h-[90vh] overflow-hidden rounded-3xl border shadow-2xl flex flex-col ${isDark ? 'bg-[#080810] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`px-4 sm:px-6 py-4 flex justify-between items-center shrink-0 z-20 ${isDark ? 'bg-[#080810]/95 backdrop-blur border-b border-white/10' : 'bg-white/95 backdrop-blur border-b border-slate-200'}`}>
            <div className={`flex items-center gap-2.5 font-black tracking-widest uppercase text-sm ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              <Target className="w-5 h-5 hidden sm:block" /> <span className="hidden sm:inline">Automata Quiz</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-1 sm:flex-none justify-end">
              <div className="flex flex-col items-end justify-center min-w-[100px] sm:min-w-[140px] text-right">
                <div className="flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                  <div className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>{rankInfo.current}</div>
                </div>
                <div className={`w-full h-1 mt-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, rankInfo.progress))}%` }} />
                </div>
              </div>
              
              <div className={`w-px h-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
              
              <div className="flex flex-col items-end justify-center min-w-[70px]">
                <div className="flex items-center gap-1.5">
                  <Zap className={`w-4 h-4 fill-current ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
                  <div className={`text-lg font-black font-mono tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {energy} <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ 25</span>
                  </div>
                </div>
                <div className={`w-full h-1 mt-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${(energy/25)*100}%` }} />
                </div>
                {energy < 25 && timeUntilNextEnergy && (
                  <div className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-sky-400/80' : 'text-sky-600/80'}`}>
                    +1 {lang === 'id' ? 'dalam' : 'in'} {timeUntilNextEnergy}
                  </div>
                )}
              </div>
              <button onClick={closeQuiz} className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><X className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative flex flex-col">
            {gameState === 'map' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full">
                <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b shrink-0 ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50/50'}`}>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang === 'id' ? 'Total Poin' : 'Total Points'}</div>
                      <div className={`text-xl font-black font-mono tracking-tighter ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{totalPoints.toLocaleString()}</div>
                    </div>
                    <div className={`w-px h-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                    <div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang === 'id' ? 'Penyelesaian' : 'Completion'}</div>
                      <div className={`text-sm font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} /> {stats.totalLevelsCompleted} / 100
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex overflow-x-auto custom-scrollbar px-4 sm:px-6 py-3 gap-2 shrink-0 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                  {(['pemula', 'menengah', 'lanjutan', 'expert'] as TabCategory[]).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? (isDark ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-violet-600 text-white shadow-md') : (isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200')}`}>
                      {lang === 'id' ? tab : tab === 'pemula' ? 'Beginner' : tab === 'menengah' ? 'Intermediate' : tab === 'lanjutan' ? 'Advanced' : 'Expert'}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 gap-3 sm:gap-4 max-w-4xl mx-auto">
                    {getLevelsForTab().map((lvl) => ( <LevelCard key={lvl.id} levelId={lvl.id} data={lvl.data} /> ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && activeQuestion && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col h-full bg-transparent">
                <div className={`px-6 py-4 flex flex-col gap-3 shrink-0 border-b ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50/50'}`}>
                  <div className="flex justify-between items-center">
                    <div className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {!isRetryMode ? `${lang === 'id' ? 'Level' : 'Level'} ${currentLevel} - ${lang === 'id' ? 'Soal' : 'Q'} ${qIndex + 1}/5` : `${lang === 'id' ? 'Ulangi Soal Salah' : 'Retry Wrong Questions'} (${wrongQueue.length})`}
                    </div>
                    {currentStreak >= 3 && (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                        <Flame className="w-3.5 h-3.5" /> Streak x{currentStreak}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-1.5 w-full h-2">
                    {answersStatus.map((status, idx) => (
                      <div key={idx} className={`flex-1 rounded-full transition-colors duration-500 ${status === 'correct' ? (isDark ? 'bg-emerald-500' : 'bg-emerald-400') : status === 'wrong' ? (isDark ? 'bg-pink-500' : 'bg-pink-400') : (idx === qIndex && !isRetryMode) ? (isDark ? 'bg-violet-500/50 animate-pulse' : 'bg-violet-400 animate-pulse') : (isDark ? 'bg-white/10' : 'bg-slate-200')}`} />
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <h3 className={`text-lg sm:text-xl font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>{activeQuestion.question[lang]}</h3>

                    {(activeQuestion.type === 'visual_nfa' || activeQuestion.type === 'visual_dfa') && activeQuestion.dfa && (
                      <div className={`h-[280px] w-full rounded-2xl border overflow-hidden relative ${isDark ? 'border-white/10 bg-black/40' : 'border-slate-200 bg-slate-50'}`}>
                        {/* Mengaitkan activeStates ke komponen internal */}
                        <AutomataGraph key={`quiz-graph-${activeQuestion.id}`} automaton={activeQuestion.dfa} title="Graf Referensi" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 mt-6">
                      {activeQuestion.options[lang].map((opt, idx) => {
                        let btnStyle = isDark ? 'border-white/10 hover:border-white/30 text-slate-300' : 'border-slate-200 hover:border-slate-400 text-slate-700';
                        let labelStyle = isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500';

                        if (isAnswered) {
                          if (idx === activeQuestion.correctIdx) {
                            btnStyle = isDark ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-emerald-500 bg-emerald-50 text-emerald-700';
                            labelStyle = isDark ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white';
                          } else if (idx === selectedOpt) {
                            btnStyle = isDark ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-pink-500 bg-pink-50 text-pink-700';
                            labelStyle = isDark ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white';
                          } else {
                            btnStyle = isDark ? 'border-white/5 text-slate-600 opacity-50' : 'border-slate-100 text-slate-400 opacity-50';
                            labelStyle = isDark ? 'bg-white/5 text-slate-600' : 'bg-slate-100 text-slate-400';
                          }
                        }

                        return (
                          <button key={idx} disabled={isAnswered} onClick={() => handleSelectAnswer(idx)} className={`flex items-center gap-4 p-4 text-left rounded-2xl border transition-all ${!isAnswered ? 'hover:-translate-y-1 cursor-pointer' : 'cursor-default'} ${btnStyle}`}>
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-xs font-black transition-colors ${labelStyle}`}>{LETTERS[idx]}</div>
                            <span className="text-sm font-semibold">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-4">
                        {selectedOpt !== activeQuestion.correctIdx && (
                          <div className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>{lang === 'id' ? 'Soal ini akan muncul lagi nanti.' : 'This question will appear again later.'}</div>
                        )}
                        <div className={`p-4 sm:p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                          <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{lang === 'id' ? 'Jawaban Benar:' : 'Correct Answer:'} {activeQuestion.options[lang][activeQuestion.correctIdx]}</div>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{activeQuestion.explanation[lang]}</p>
                        </div>
                        <button onClick={handleNextQuestion} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg ${isDark ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-violet-500/20' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-500/30'}`}>
                          {lang === 'id' ? 'Lanjut' : 'Next'}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'result' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6 sm:p-10">
                <div className="max-w-xl mx-auto w-full space-y-8">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3].map((star, i) => (
                        <motion.div key={star} initial={{ opacity: 0, y: 20, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.15, type: 'spring' }}>
                          <Star className={`w-14 h-14 ${star <= resultData.stars ? (resultData.stars === 3 ? 'text-violet-500 fill-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]') : (isDark ? 'text-white/10 fill-white/5' : 'text-slate-200 fill-slate-100')}`} />
                        </motion.div>
                      ))}
                    </div>
                    <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Level {currentLevel} {lang === 'id' ? 'Selesai!' : 'Completed!'}</h2>
                    {resultData.rankUpTo && (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }} className={`inline-block px-4 py-2 mt-2 rounded-xl border text-sm font-black uppercase tracking-widest shadow-lg ${isDark ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-amber-500/20' : 'bg-amber-100 border-amber-300 text-amber-700 shadow-amber-500/10'}`}>
                        🎉 {lang === 'id' ? 'Peringkat Naik:' : 'Rank Up:'} {resultData.rankUpTo}
                      </motion.div>
                    )}
                  </div>

                  <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{lang === 'id' ? 'Benar di percobaan pertama' : 'Correct on first try'}</span>
                        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{runCorrectFirst} / 5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{lang === 'id' ? 'Total percobaan menjawab' : 'Total answer attempts'}</span>
                        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{runAttempts}</span>
                      </div>
                      <div className={`w-full h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{lang === 'id' ? 'Poin Soal' : 'Base Points'}</span>
                        <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>+{resultData.basePoints}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{lang === 'id' ? 'Bonus Bintang' : 'Star Bonus'}</span>
                        <span className={`text-sm font-bold font-mono ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>+{resultData.starBonus}</span>
                      </div>
                      {resultData.streakBonus > 0 && (
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Flame className="w-4 h-4 text-orange-500" /> Perfect Streak</span>
                          <span className={`text-sm font-bold font-mono ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>+{resultData.streakBonus}</span>
                        </div>
                      )}
                    </div>
                    <div className={`px-5 py-4 flex justify-between items-center border-t ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang === 'id' ? 'Total Poin Didapat' : 'Total Points Earned'}</span>
                      <span className={`text-2xl font-black font-mono tracking-tighter ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>+{resultData.totalPoints}</span>
                    </div>
                  </div>

                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: 'spring' }} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-200 text-sky-600'}`}>
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isDark ? 'text-sky-400/70' : 'text-sky-600/70'}`}>{lang === 'id' ? 'Hadiah Energi' : 'Energy Reward'}</div>
                        <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>+{resultData.energyReward} Energi</div>
                      </div>
                    </div>
                    {runAttempts === 5 && (
                      <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                        Gacha Boost!
                      </div>
                    )}
                  </motion.div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button onClick={() => setGameState('map')} className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {lang === 'id' ? 'Pilih Level' : 'Select Level'}
                    </button>
                    {currentLevel < 100 && (
                      <button onClick={() => handleStartLevel(currentLevel + 1)} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${isDark ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-violet-500/20' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-500/30'}`}>
                        {lang === 'id' ? 'Level Berikutnya' : 'Next Level'} <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};