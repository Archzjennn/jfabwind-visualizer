import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [text, setText] = useState('');
  const fullText = "JFABWIND Visualizer";
  const [showCursor, setShowCursor] = useState(true);

  // Efek Mengetik (Typing Effect)
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Setelah selesai mengetik, tunggu sebentar lalu selesaikan splash screen
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 100); // Kecepatan ketik (100ms per huruf)

    return () => clearInterval(typingInterval);
  }, [onComplete, fullText]);

  // Efek Kursor Berkedip
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020204]"
      >
        {/* Glow Background */}
        <div className="absolute w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[100px] opacity-50 animate-pulse" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Logo Animasi Berputar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)] backdrop-blur-sm"
          >
            {/* Logo JFABWIND Versi Transparan */}
            <img 
              src="/LogoJFABWIND.png" 
              alt="JFABWIND Logo" 
              className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
            />
          </motion.div>

          {/* Typing Effect Container */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center h-10">
              <span className="text-xl sm:text-2xl font-black tracking-[0.2em] text-white font-mono uppercase">
                {text}
              </span>
              <span className={`text-xl sm:text-2xl font-black text-violet-500 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                _
              </span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
              Compiling Automata...
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};