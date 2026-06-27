import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Rocket } from 'lucide-react';
import { useStore } from '../store/useStore';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { theme, lang } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#020204] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] -z-10 opacity-20 transition-colors duration-500 ${isDark ? 'bg-violet-900/30' : 'bg-violet-300/30'}`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] -z-10 opacity-20 transition-colors duration-500 ${isDark ? 'bg-pink-900/20' : 'bg-pink-300/30'}`} />

      {/* CSS EFEK CLASSIC RGB SPLIT GLITCH (CYAN & RED) */}
      <style>{`
        .glitch-text {
          position: relative;
        }

        .glitch-text::before, .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        
        /* Lapisan glitch MERAH */
        .glitch-text::before {
          left: 3px;
          text-shadow: -3px 0 #ff0000;
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        
        /* Lapisan glitch CYAN */
        .glitch-text::after {
          left: -3px;
          text-shadow: 3px 0 #00ffff;
          animation: glitch-anim-2 2.5s infinite linear alternate-reverse;
        }

        /* Potongan horizontal acak */
        @keyframes glitch-anim-1 {
          0% { clip: rect(10px, 9999px, 25px, 0); transform: translate(-4px, 0); }
          10% { clip: rect(50px, 9999px, 65px, 0); transform: translate(4px, 0); }
          20% { clip: rect(30px, 9999px, 50px, 0); transform: translate(-4px, 0); }
          30% { clip: rect(80px, 9999px, 95px, 0); transform: translate(4px, 0); }
          40% { clip: rect(20px, 9999px, 40px, 0); transform: translate(-4px, 0); }
          50% { clip: rect(100px, 9999px, 120px, 0); transform: translate(4px, 0); }
          60% { clip: rect(40px, 9999px, 60px, 0); transform: translate(-4px, 0); }
          70% { clip: rect(120px, 9999px, 140px, 0); transform: translate(4px, 0); }
          80% { clip: rect(60px, 9999px, 75px, 0); transform: translate(-4px, 0); }
          90% { clip: rect(130px, 9999px, 150px, 0); transform: translate(4px, 0); }
          100% { clip: rect(15px, 9999px, 30px, 0); transform: translate(-4px, 0); }
        }
        
        @keyframes glitch-anim-2 {
          0% { clip: rect(65px, 9999px, 80px, 0); transform: translate(4px, 0); }
          10% { clip: rect(15px, 9999px, 30px, 0); transform: translate(-4px, 0); }
          20% { clip: rect(105px, 9999px, 120px, 0); transform: translate(4px, 0); }
          30% { clip: rect(35px, 9999px, 50px, 0); transform: translate(-4px, 0); }
          40% { clip: rect(85px, 9999px, 95px, 0); transform: translate(4px, 0); }
          50% { clip: rect(20px, 9999px, 35px, 0); transform: translate(-4px, 0); }
          60% { clip: rect(110px, 9999px, 125px, 0); transform: translate(4px, 0); }
          70% { clip: rect(45px, 9999px, 60px, 0); transform: translate(-4px, 0); }
          80% { clip: rect(125px, 9999px, 140px, 0); transform: translate(4px, 0); }
          90% { clip: rect(55px, 9999px, 70px, 0); transform: translate(-4px, 0); }
          100% { clip: rect(140px, 9999px, 155px, 0); transform: translate(4px, 0); }
        }

        .error-metal-text {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.2em;
          transform: skewX(-6deg);
          text-shadow: 3px 3px 0px rgba(220, 38, 38, 0.5), -2px -2px 0px rgba(124, 58, 237, 0.3);
        }
        .error-subtext {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          line-height: 1.8;
        }
      `}</style>

      <div className="w-full max-w-2xl mx-auto text-center flex flex-col items-center z-10">
        
        {/* ILUSTRASI STATE (TIDAK DIUBAH) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <svg width="240" height="100" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto overflow-visible">
            <path d="M10 50L30 50" stroke={isDark ? '#475569' : '#64748b'} strokeWidth="3" markerEnd="url(#arrow)" />
            
            <circle cx="55" cy="50" r="20" fill={isDark ? '#090911' : '#ede9fe'} stroke={isDark ? '#5b21b6' : '#7c3aed'} strokeWidth="3" />
            <text x="55" y="55" textAnchor="middle" fill={isDark ? '#94a3b8' : '#334155'} fontSize="14" fontFamily="monospace" fontWeight="bold">q0</text>
            
            <path d="M75 50L135 50" stroke={isDark ? '#475569' : '#64748b'} strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="105" y="40" textAnchor="middle" fill={isDark ? '#94a3b8' : '#0f172a'} fontSize="14" fontFamily="monospace" fontWeight="bold">a,b</text>
            
            <circle cx="160" cy="50" r="20" fill={isDark ? '#090911' : '#ede9fe'} stroke={isDark ? '#5b21b6' : '#7c3aed'} strokeWidth="3" />
            <text x="160" y="55" textAnchor="middle" fill={isDark ? '#94a3b8' : '#334155'} fontSize="14" fontFamily="monospace" fontWeight="bold">q1</text>

            <path d="M175 40 Q 195 10 215 35" stroke={isDark ? '#b91c1c' : '#f43f5e'} strokeWidth="3" markerEnd="url(#arrow-red)" strokeDasharray="6 6" />
            <text x="195" y="20" textAnchor="middle" fill={isDark ? '#f87171' : '#e11d48'} fontSize="16" fontFamily="monospace" fontWeight="bold">?</text>

            <circle cx="225" cy="50" r="20" fill="transparent" stroke={isDark ? '#b91c1c' : '#f43f5e'} strokeWidth="3" strokeDasharray="4 4" />
            <text x="225" y="55" textAnchor="middle" fill={isDark ? '#b91c1c' : '#f43f5e'} fontSize="18" fontFamily="monospace" fontWeight="bold">?</text>

            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={isDark ? '#475569' : '#64748b'} />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={isDark ? '#b91c1c' : '#f43f5e'} />
              </marker>
            </defs>
          </svg>
        </motion.div>

        {/* Teks 404 kembali menjadi putih solid */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-8xl sm:text-[140px] font-black tracking-tighter leading-none mb-6 glitch-text ${isDark ? 'text-white' : 'text-slate-900'}`}
          data-text="404"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-xl mx-auto"
        >
          <h2 className={`text-xl sm:text-2xl mb-5 error-metal-text ${isDark ? 'text-slate-400' : 'text-slate-900'}`}>
            {lang === 'id' ? 'Halaman tidak ditemukan' : 'Page not found'}
          </h2>
          
          <div className={`p-4 border-l-2 border-b-2 text-left mb-12 backdrop-blur-md ${isDark ? 'border-red-900/30 bg-black/80 shadow-[inset_0_0_30px_rgba(255,0,0,0.03)]' : 'border-red-600/60 bg-red-50'}`}>
            <p className={`text-[10px] sm:text-[11px] error-subtext ${isDark ? 'text-slate-600' : 'text-slate-600'}`}>
              {lang === 'id' 
                ? 'Sepertinya state ini tidak ada dalam automata kami. Mungkin kamu salah memasukkan input string? 😄' 
                : 'It seems this state does not exist in our automata. Perhaps an invalid input string? 😄'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/')}
            className={`px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all active:translate-y-1 ${
              isDark 
                ? 'border border-[#111] bg-[#050505] text-slate-600 hover:text-slate-400 hover:border-[#222] shadow-[4px_4px_0_0_#000]' 
                : 'border-2 border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Home className="w-4 h-4" />
            {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          </button>
          
          <button 
            onClick={() => navigate('/app')}
            className={`px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all active:translate-y-1 ${
              isDark 
                ? 'border border-red-900/30 bg-[#0a0202] text-red-700/80 hover:bg-[#120202] hover:text-red-500 hover:border-red-900/60 shadow-[4px_4px_0_0_#050000]' 
                : 'border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 shadow-[4px_4px_0_0_#000]'
            }`}
          >
            <Rocket className="w-4 h-4" />
            {lang === 'id' ? 'Buka Aplikasi' : 'Launch App'}
          </button>
        </motion.div>

      </div>
    </div>
  );
};