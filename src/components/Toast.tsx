import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useStore, type ToastItem } from '../store/useStore';

// Sub-komponen untuk memproses timer dan progress bar individual toast
const ToastNode = ({ item }: { item: ToastItem }) => {
  const { dismissToast, theme } = useStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissToast(item.id);
    }, 3000); // Durasi default 3 detik
    return () => clearTimeout(timer);
  }, [item.id, dismissToast]);

  // Konfigurasi visual berdasarkan tipe toast
  const config = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
      classes: isDark 
        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.1)]' 
        : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm',
      barColor: 'bg-emerald-500'
    },
    error: {
      icon: <XCircle className="w-4 h-4 text-pink-500 shrink-0" />,
      classes: isDark 
        ? 'bg-pink-950/40 border-pink-500/30 text-pink-400 shadow-[0_4px_20px_rgba(236,72,153,0.1)]' 
        : 'bg-pink-50 border-pink-200 text-pink-800 shadow-sm',
      barColor: 'bg-pink-500'
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
      classes: isDark 
        ? 'bg-amber-950/40 border-amber-500/30 text-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.1)]' 
        : 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm',
      barColor: 'bg-amber-500'
    },
    info: {
      icon: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
      classes: isDark 
        ? 'bg-sky-950/40 border-sky-500/30 text-sky-400 shadow-[0_4px_20px_rgba(14,165,233,0.1)]' 
        : 'bg-sky-50 border-slate-200 text-slate-800 shadow-sm',
      barColor: 'bg-sky-500'
    }
  };

  const currentConfig = config[item.type] || config.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={() => dismissToast(item.id)}
      className={`w-80 p-4 rounded-xl border backdrop-blur-md flex items-start gap-3 cursor-pointer pointer-events-auto relative overflow-hidden select-none group transition-all hover:scale-[1.02] ${currentConfig.classes}`}
    >
      {currentConfig.icon}
      
      <div className="flex-1 text-xs font-semibold leading-relaxed pr-2">
        {item.message}
      </div>

      {/* Progress Bar Durasi Menguras Kebawah */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/5 dark:bg-white/5">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 3, ease: 'linear' }}
          className={`h-full ${currentConfig.barColor}`}
        />
      </div>
    </motion.div>
  );
};

export const Toast = () => {
  const { toasts } = useStore();

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-4 right-4 z-[99999] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastNode key={toast.id} item={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};