import React, { lazy, Suspense, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegexInput } from './RegexInput';
import { AutomataGraph } from './AutomataGraph';
import { TransitionTable } from './TransitionTable';
import { StringTester } from './StringTester';
import { InfoPanel } from './InfoPanel';
import { SimulatorPanel } from './SimulatorPanel';
import { EducationPanel } from './EducationPanel';
import { MinimizationPanel } from './MinimizationPanel';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';
import { RecentlyViewed } from './RecentlyViewed';

const InstallPWABanner = lazy(() => import('./InstallPWABanner').then(m => ({ default: m.InstallPWABanner })));
const OnboardingTour = lazy(() => import('./OnboardingTour').then(m => ({ default: m.OnboardingTour })));

export const MainDashboard = memo(() => {
  const { nfa, dfa, lang, theme } = useStore();
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';
  const isMobile = window.innerWidth < 768;

  return (
    <div className="transition-colors duration-300 w-full">
      <motion.div 
        initial={{ opacity: 0, y: isMobile ? 0 : -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: isMobile ? 0.3 : 0.5 }}
      >
        <div className="text-center mb-5 sm:mb-8 pt-2 sm:pt-4">
          <h1 className={`text-xl sm:text-4xl font-black tracking-tight mb-1.5 sm:mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.appTitle}
          </h1>
          <p className={`max-w-2xl mx-auto text-xs sm:text-base px-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.appDesc}
          </p>
        </div>
        
        <div id="regex-input-section">
          <RegexInput />
          <RecentlyViewed />
        </div>
      </motion.div>

      <AnimatePresence>
        {nfa && dfa && (
          <motion.div 
            initial={{ opacity: 0, y: isMobile ? 0 : 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: isMobile ? 0 : 20 }} 
            transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0 : 0.1 }} 
            className="space-y-6 pb-12 mt-8"
          >
            {/* TINGKAT 1: VISUALISASI GRAFIK */}
            <div id="visual-section" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AutomataGraph automaton={nfa} title={t.graphNfa} />
              <AutomataGraph automaton={dfa} title={t.graphDfa} />
            </div>

            {/* TINGKAT 2: SIMULATOR */}
            <SimulatorPanel />

            {/* TINGKAT 3: TABEL TRANSISI */}
            <div id="table-section" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TransitionTable automaton={nfa} title={t.tableNfa} />
              <TransitionTable automaton={dfa} title={t.tableDfa} />
            </div>

            <MinimizationPanel />
            <EducationPanel />
            
            <div id="info-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StringTester />
              <InfoPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <InstallPWABanner />
        <OnboardingTour />
      </Suspense>
    </div>
  );
});