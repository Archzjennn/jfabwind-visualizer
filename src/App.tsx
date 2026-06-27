import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MainDashboard } from './components/MainDashboard';
import { LandingPage } from './components/LandingPage';
import { Toast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { NotFoundPage } from './components/NotFoundPage';
import { SplashScreen } from './components/SplashScreen';
import { useStore, type BeforeInstallPromptEvent } from './store/useStore';
import { Loader2 } from 'lucide-react';

const RegexBuilder = lazy(() => import('./components/RegexBuilder').then(m => ({ default: m.RegexBuilder })));
const QuizModal = lazy(() => import('./components/QuizModal').then(m => ({ default: m.QuizModal })));
const GlossaryModal = lazy(() => import('./components/GlossaryModal').then(m => ({ default: m.GlossaryModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const ShortcutsModal = lazy(() => import('./components/ShortcutsModal').then(m => ({ default: m.ShortcutsModal })));

const FallbackSpinner = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="p-4 rounded-2xl bg-white dark:bg-[#080810] shadow-2xl border border-slate-200 dark:border-white/10">
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  </div>
);

const ACCENT_COLORS: Record<string, Record<string, string>> = {
  violet: { 50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253', 400: '167 139 250', 500: '139 92 246', 600: '124 58 237', 700: '109 40 217', 800: '91 33 182', 900: '76 29 149', 950: '46 16 101' },
  blue: { 50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253', 400: '96 165 250', 500: '59 130 246', 600: '37 99 235', 700: '29 78 216', 800: '30 64 175', 900: '30 58 138', 950: '23 37 84' },
  emerald: { 50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183', 400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 800: '6 95 70', 900: '6 78 59', 950: '2 44 34' },
  rose: { 50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175', 400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60', 800: '159 18 57', 900: '136 19 55', 950: '76 5 25' },
  amber: { 50: '255 251 235', 100: '254 243 199', 200: '253 230 138', 300: '252 211 77', 400: '251 191 36', 500: '245 158 11', 600: '217 119 6', 700: '180 83 9', 800: '146 64 14', 900: '120 53 15', 950: '69 26 3' }
};

const AppLayout = () => {
  const { theme, toggleTheme } = useStore();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedAccent = localStorage.getItem('app-accent');
    if (savedAccent && ACCENT_COLORS[savedAccent]) {
      Object.entries(ACCENT_COLORS[savedAccent]).forEach(([shade, rgb]) => {
        document.documentElement.style.setProperty(`--accent-${shade}`, rgb);
      });
    }

    const size = localStorage.getItem('app-font-size') || 'normal';
    if (size === 'small') document.documentElement.style.fontSize = '14px';
    else if (size === 'large') document.documentElement.style.fontSize = '18px';
    else document.documentElement.style.fontSize = '16px';

    if (localStorage.getItem('app-animations') === 'false') document.body.classList.add('disable-animations');
    else document.body.classList.remove('disable-animations');

    const checkScheduledTheme = () => {
      if (localStorage.getItem('app-scheduled-theme') !== 'true') return;
      const overrideDate = localStorage.getItem('theme-override-date');
      const today = new Date().toDateString();
      if (overrideDate === today) return;

      const hour = new Date().getHours();
      const shouldBeDark = hour < 6 || hour >= 18;
      const currentIsDark = document.documentElement.classList.contains('dark');
      
      if (shouldBeDark && !currentIsDark && toggleTheme) toggleTheme(); 
      if (!shouldBeDark && currentIsDark && toggleTheme) toggleTheme();
    };

    checkScheduledTheme();
    const interval = setInterval(checkScheduledTheme, 60000);
    return () => clearInterval(interval);
  }, [toggleTheme]);

  return (
    <div className={`min-h-screen w-full font-sans transition-colors duration-300 pb-20 md:pb-0 relative z-10 ${isDark ? 'bg-[#080810]' : 'bg-slate-50 text-slate-900'}`}>
      <div 
        className="fixed inset-0 z-0 pointer-events-none hidden md:block"
        style={{
          backgroundImage: isDark 
            ? 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)' 
            : 'linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />
      
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        <MainDashboard />
      </main>
      <BottomNav />
      
      <Suspense fallback={<FallbackSpinner />}>
        <RegexBuilder />
        <QuizModal />
        <GlossaryModal />
        <SettingsModal />
        {!isMobile && <ShortcutsModal />}
      </Suspense>
      <Toast />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }} className="w-full min-h-screen"><LandingPage /></motion.div>} />
        <Route path="/app" element={<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, ease: "easeOut" }} className="w-full min-h-screen"><AppLayout /></motion.div>} />
        <Route path="*" element={<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}><NotFoundPage /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setDeferredPrompt } = useStore();

  useEffect(() => {
    if (isLoading) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isLoading]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setDeferredPrompt]);

  return (
    <>
      {isLoading ? (
        <SplashScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      )}
    </>
  );
}