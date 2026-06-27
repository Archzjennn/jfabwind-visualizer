import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Automaton } from '../types/automata';
import type { Node, Edge } from 'reactflow';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppState {
  regex: string;
  nfa: Automaton | null;
  dfa: Automaton | null;
  history: { regex: string; timestamp: number }[];
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  isEduMode: boolean;
  isAboutOpen: boolean;
  isShortcutsOpen: boolean;
  isQuizOpen: boolean;
  isGlossaryOpen: boolean;
  isBuilderOpen: boolean;
  hasSeenTour: boolean;
  runTour: boolean;
  builderNodes: Node[];
  builderEdges: Edge[];
  generatedRegex: string;
  testActiveNodes: string[];
  testActiveEdges: string[];
  toasts: ToastItem[];
  deferredPrompt: BeforeInstallPromptEvent | null;

  setRegex: (regex: string) => void;
  setAutomata: (nfa: Automaton | null, dfa: Automaton | null) => void;
  addHistory: (regex: string) => void;
  removeHistory: (regex: string) => void;
  clearHistory: () => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  toggleEduMode: () => void;
  setRunTour: (run: boolean) => void;
  completeTour: () => void;
  toggleAbout: () => void;
  closeAbout: () => void;
  toggleShortcuts: () => void;
  toggleQuiz: () => void;
  closeQuiz: () => void;
  toggleGlossary: () => void;
  closeGlossary: () => void;
  toggleBuilder: () => void;
  setBuilderNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setBuilderEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  setGeneratedRegex: (regex: string) => void;
  setTestActiveElements: (nodes: string[], edges: string[]) => void;
  clearTestActiveElements: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      regex: '',
      nfa: null,
      dfa: null,
      history: [],
      theme: 'dark',
      lang: 'id',
      isEduMode: false,
      isAboutOpen: false,
      isShortcutsOpen: false,
      isQuizOpen: false,
      isGlossaryOpen: false,
      isBuilderOpen: false,
      hasSeenTour: false,
      runTour: false,
      builderNodes: [],
      builderEdges: [],
      generatedRegex: '',
      testActiveNodes: [],
      testActiveEdges: [],
      toasts: [],
      deferredPrompt: null,

      setRegex: (regex) => set({ regex }),
      setAutomata: (nfa, dfa) => set({ nfa, dfa }),
      addHistory: (regex) => set((state) => {
        const newHistory = state.history.filter(h => h.regex !== regex);
        return { history: [{ regex, timestamp: Date.now() }, ...newHistory].slice(0, 10) };
      }),
      removeHistory: (regex) => set((state) => ({ history: state.history.filter(h => h.regex !== regex) })),
      clearHistory: () => set({ history: [] }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleLang: () => set((state) => ({ lang: state.lang === 'id' ? 'en' : 'id' })),
      toggleEduMode: () => set((state) => ({ isEduMode: !state.isEduMode })),
      setRunTour: (run) => set({ runTour: run }),
      completeTour: () => set({ hasSeenTour: true, runTour: false }),
      toggleAbout: () => set((state) => ({ isAboutOpen: !state.isAboutOpen })),
      closeAbout: () => set({ isAboutOpen: false }),
      toggleShortcuts: () => set((state) => ({ isShortcutsOpen: !state.isShortcutsOpen })),
      toggleQuiz: () => set((state) => ({ isQuizOpen: !state.isQuizOpen })),
      closeQuiz: () => set({ isQuizOpen: false }),
      toggleGlossary: () => set((state) => ({ isGlossaryOpen: !state.isGlossaryOpen })),
      closeGlossary: () => set({ isGlossaryOpen: false }),
      toggleBuilder: () => set((state) => ({ isBuilderOpen: !state.isBuilderOpen })),
      setBuilderNodes: (updater) => set((state) => ({
        builderNodes: typeof updater === 'function' ? updater(state.builderNodes) : updater
      })),
      setBuilderEdges: (updater) => set((state) => ({
        builderEdges: typeof updater === 'function' ? updater(state.builderEdges) : updater
      })),
      setGeneratedRegex: (generatedRegex) => set({ generatedRegex }),
      setTestActiveElements: (nodes, edges) => set({ testActiveNodes: nodes, testActiveEdges: edges }),
      clearTestActiveElements: () => set({ testActiveNodes: [], testActiveEdges: [] }),
      showToast: (message, type = 'info') => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { id, message, type };
        const updatedToasts = [...state.toasts, newToast].slice(-3);
        return { toasts: updatedToasts };
      }),
      dismissToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
      setDeferredPrompt: (deferredPrompt) => set({ deferredPrompt }),
    }),
    {
      name: 'automata-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        history: state.history,
        isEduMode: state.isEduMode,
        lang: state.lang,
        hasSeenTour: state.hasSeenTour,
        builderNodes: state.builderNodes,
        builderEdges: state.builderEdges
      }),
    }
  )
);