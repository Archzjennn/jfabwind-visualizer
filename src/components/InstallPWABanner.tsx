import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const InstallPWABanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme, lang, deferredPrompt, setDeferredPrompt } = useStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (deferredPrompt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const texts = {
    id: {
      title: 'Install JFABWIND',
      desc: 'Akses visualizer automata lebih cepat dari home screen dan jalankan secara offline dengan performa tinggi.',
      later: 'Nanti Saja',
      install: 'Install Aplikasi'
    },
    en: {
      title: 'Install JFABWIND',
      desc: 'Access the automata visualizer faster from your home screen and run it offline with native performance.',
      later: 'Maybe Later',
      install: 'Install App'
    }
  };

  const t = lang === 'id' ? texts.id : texts.en;

  return (
    <AnimatePresence>
      {isVisible && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className={`fixed bottom-6 right-6 left-6 sm:left-auto sm:w-[420px] z-[150] border backdrop-blur-2xl p-6 rounded-2xl shadow-2xl flex flex-col gap-4 ${
            isDark ? 'bg-[#080810]/95 border-violet-500/20 shadow-black' : 'bg-white border-violet-200 shadow-violet-500/10'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className={`p-2.5 rounded-2xl shrink-0 transition-colors border shadow-inner flex items-center justify-center ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <img 
                  src="/LogoJFABWIND.png" 
                  alt="JFABWIND Icon" 
                  className="w-8 h-8 object-contain drop-shadow-sm" 
                />
              </div>
              <div>
                <h4 className={`text-base font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.title}
                </h4>
                <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.desc}
                </p>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-600 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2 justify-end text-[11px] font-black uppercase tracking-widest mt-2">
            <button 
              onClick={handleDismiss}
              className={`px-5 py-3 rounded-xl transition-all ${isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {t.later}
            </button>
            <button 
              onClick={handleInstallClick}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all active:scale-95 flex items-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <Download className="w-4 h-4 relative z-10" /> 
              <span className="relative z-10">{t.install}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};