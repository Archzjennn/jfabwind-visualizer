import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LevelData {
  completed: boolean;
  stars: number;
  bestCorrectFirst: number;
}

export interface QuizStats {
  totalCorrect: number;
  totalAttempts: number;
  totalLevelsCompleted: number;
  totalStars: number;
  totalStreaks: number;
}

interface QuizState {
  energy: number;
  lastEnergyUpdate: number;
  totalPoints: number;
  rank: string;
  currentStreak: number;
  levels: Record<number, LevelData>;
  stats: QuizStats;

  syncEnergy: () => void;
  deductEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  updateLevelProgress: (levelId: number, stars: number, correctFirst: number) => void;
  addPoints: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  updateStats: (updates: Partial<QuizStats>) => void;
  updateRank: () => void;
}

const getRank = (points: number, levelsCompleted: number) => {
  if (levelsCompleted === 100) return "ULTIMATE";
  if (points >= 22000) return "Legenda";
  if (points >= 16000) return "Grandmaster";
  if (points >= 11500) return "Master";
  if (points >= 8000) return "Ilmuwan";
  if (points >= 5500) return "Pakar";
  if (points >= 3500) return "Ahli";
  if (points >= 2000) return "Mahir";
  if (points >= 1000) return "Terampil";
  if (points >= 500) return "Penggiat";
  if (points >= 200) return "Pelajar";
  return "Pemula";
};

const initialLevels: Record<number, LevelData> = {};
for (let i = 1; i <= 100; i++) {
  initialLevels[i] = { completed: false, stars: 0, bestCorrectFirst: 0 };
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      energy: 15,
      lastEnergyUpdate: Date.now(),
      totalPoints: 0,
      rank: "Pemula",
      currentStreak: 0,
      levels: initialLevels,
      stats: {
        totalCorrect: 0,
        totalAttempts: 0,
        totalLevelsCompleted: 0,
        totalStars: 0,
        totalStreaks: 0,
      },

      syncEnergy: () => {
        const { energy, lastEnergyUpdate } = get();
        if (energy >= 25) {
          set({ lastEnergyUpdate: Date.now() });
          return;
        }

        const now = Date.now();
        const diffInMinutes = Math.floor((now - lastEnergyUpdate) / (1000 * 60));
        
        if (diffInMinutes >= 60) {
          const energyToAdd = Math.floor(diffInMinutes / 60);
          const newEnergy = Math.min(25, energy + energyToAdd);
          const remainderMinutes = diffInMinutes % 60;
          
          set({
            energy: newEnergy,
            lastEnergyUpdate: now - (remainderMinutes * 60 * 1000),
          });
        }
      },

      deductEnergy: (amount) => {
        const { energy } = get();
        if (energy >= amount) {
          set({ 
            energy: energy - amount,
            lastEnergyUpdate: energy === 25 ? Date.now() : get().lastEnergyUpdate 
          });
          return true;
        }
        return false;
      },

      addEnergy: (amount) => {
        set((state) => ({
          energy: Math.min(25, state.energy + amount)
        }));
      },

      updateLevelProgress: (levelId, stars, correctFirst) => {
        set((state) => {
          const currentLevel = state.levels[levelId];
          const isNewlyCompleted = !currentLevel.completed;
          const newStars = Math.max(currentLevel.stars, stars);
          
          return {
            levels: {
              ...state.levels,
              [levelId]: {
                completed: true,
                stars: newStars,
                bestCorrectFirst: Math.max(currentLevel.bestCorrectFirst, correctFirst)
              }
            },
            stats: {
              ...state.stats,
              totalLevelsCompleted: isNewlyCompleted ? state.stats.totalLevelsCompleted + 1 : state.stats.totalLevelsCompleted,
              totalStars: state.stats.totalStars + (newStars - currentLevel.stars)
            }
          };
        });
        get().updateRank();
      },

      addPoints: (points) => {
        set((state) => ({ totalPoints: state.totalPoints + points }));
        get().updateRank();
      },

      incrementStreak: () => {
        set((state) => ({
          currentStreak: state.currentStreak + 1,
          stats: { ...state.stats, totalStreaks: state.stats.totalStreaks + 1 }
        }));
      },

      resetStreak: () => set({ currentStreak: 0 }),

      updateStats: (updates) => set((state) => ({
        stats: { ...state.stats, ...updates }
      })),

      updateRank: () => {
        const { totalPoints, stats } = get();
        const newRank = getRank(totalPoints, stats.totalLevelsCompleted);
        set({ rank: newRank });
      }
    }),
    {
      name: 'automata-quiz-storage',
    }
  )
);