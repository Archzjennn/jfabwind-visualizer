/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Settings, Palette, Type, Zap, Clock, AlertTriangle, CheckCircle2, LayoutPanelLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

const ACCENT_COLORS = [
  { id: 'violet', name: 'Violet', hex: '#7c3aed', vars: { 50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253', 400: '167 139 250', 500: '139 92 246', 600: '124 58 237', 700: '109 40 217', 800: '91 33 182', 900: '76 29 149', 950: '46 16 101' } },
  { id: 'blue', name: 'Blue', hex: '#2563eb', vars: { 50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253', 400: '96 165 250', 500: '59 130 246', 600: '37 99 235', 700: '29 78 216', 800: '30 64 175', 900: '30 58 138', 950: '23 37 84' } },
  { id: 'emerald', name: 'Emerald', hex: '#059669', vars: { 50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183', 400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 800: '6 95 70', 900: '6 78 59', 950: '2 44 34' } },
  { id: 'rose', name: 'Rose', hex: '#e11d48', vars: { 50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175', 400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60', 800: '159 18 57', 900: '136 19 55', 950: '76 5 25' } },
  { id: 'amber', name: 'Amber', hex: '#d97706', vars: { 50: '255 251 235', 100: '254 243 199', 200: '253 230 138', 300: '252 211 77', 400: '251 191 36', 500: '245 158 11', 600: '217 119 6', 700: '180 83 9', 800: '146 64 14', 900: '120 53 15', 950: '69 26 3' } },
];

export const SettingsModal = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, lang, showToast } = useStore();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  // States
  const [accent, setAccent] = useState(localStorage.getItem('app-accent') || 'violet');
  const [fontSize, setFontSize] = useState(localStorage.getItem('app-font-size') || 'normal');
  const [animations, setAnimations] = useState(localStorage.getItem('app-animations') !== 'false');
  const [schedule, setSchedule] = useState(localStorage.getItem('app-scheduled-theme') === 'true');
  const [showRecent, setShowRecent] = useState(localStorage.getItem('app-show-recent') !== 'false');

  const t = lang === 'id' ? {
    title: 'Pengaturan', appearance: 'Tampilan & Aksesibilitas', color: 'Warna Aksen', font: 'Ukuran Teks',
    small: 'Kecil', normal: 'Normal', large: 'Besar', anim: 'Animasi Antarmuka',
    animDesc: 'Matikan untuk performa maksimal tanpa efek transisi.',
    recentPanel: 'Panel Terakhir Dilihat', recentDesc: 'Tampilkan riwayat cepat di bawah kotak input.',
    schedule: 'Tema Otomatis (Waktu)', scheduleDesc: 'Terang: 06:00-18:00 | Gelap: 18:00-06:00',
    danger: 'Zona Berbahaya', reset: 'Reset Pengaturan', clear: 'Hapus Semua Data', confirm: 'Anda yakin?'
  } : {
    title: 'Settings', appearance: 'Appearance & Accessibility', color: 'Accent Color', font: 'Text Size',
    small: 'Small', normal: 'Normal', large: 'Large', anim: 'Interface Animations',
    animDesc: 'Disable for maximum performance without transition effects.',
    recentPanel: 'Recently Viewed Panel', recentDesc: 'Show quick history below the input box.',
    schedule: 'Scheduled Theme', scheduleDesc: 'Light: 06:00-18:00 | Dark: 18:00-06:00',
    danger: 'Danger Zone', reset: 'Reset Settings', clear: 'Clear All Data', confirm: 'Are you sure?'
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-settings', handleOpen);
    return () => window.removeEventListener('open-settings', handleOpen);
  }, []);

  const applyAccent = (colorId: string) => {
    setAccent(colorId);
    localStorage.setItem('app-accent', colorId);
    const color = ACCENT_COLORS.find(c => c.id === colorId);
    if (color) {
      Object.entries(color.vars).forEach(([shade, rgb]) => {
        document.documentElement.style.setProperty(`--accent-${shade}`, rgb);
      });
    }
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem('app-font-size', size);
    if (size === 'small') document.documentElement.style.fontSize = '14px';
    else if (size === 'large') document.documentElement.style.fontSize = '18px';
    else document.documentElement.style.fontSize = '16px';
  };

  const applyAnimations = (val: boolean) => {
    setAnimations(val);
    localStorage.setItem('app-animations', val.toString());
    if (!val) document.body.classList.add('disable-animations');
    else document.body.classList.remove('disable-animations');
  };

  const applySchedule = (val: boolean) => {
    setSchedule(val);
    localStorage.setItem('app-scheduled-theme', val.toString());
  };

  const applyShowRecent = (val: boolean) => {
    setShowRecent(val);
    localStorage.setItem('app-show-recent', val.toString());
    window.dispatchEvent(new Event('setting-recent-changed'));
  };

  const handleResetSettings = () => {
    if (window.confirm(t.confirm)) {
      ['app-accent', 'app-font-size', 'app-animations', 'app-scheduled-theme', 'app-show-recent'].forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (window.confirm(t.confirm)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#080810] border-white/10' : 'bg-slate-50 border-slate-200'}`}
        >
          <div className={`px-6 py-5 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-white/10 bg-[#080810]/95' : 'border-slate-200 bg-white/95'}`}>
            <h2 className={`font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              <Settings className="w-5 h-5" /> {t.title}
            </h2>
            <button onClick={() => setIsOpen(false)} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            <section className="space-y-5">
              <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Palette className="w-4 h-4" /> {t.appearance}
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.color}</label>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color.id} onClick={() => applyAccent(color.id)} title={color.name} style={{ backgroundColor: color.hex }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${accent === color.id ? 'ring-4 ring-offset-2 ring-current scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'} ${isDark ? 'ring-offset-[#080810]' : 'ring-offset-slate-50'}`}
                    >
                      {accent === color.id && <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.font}</label>
                <div className={`flex rounded-xl p-1 border ${isDark ? 'bg-black/50 border-white/10' : 'bg-slate-200/50 border-slate-300'}`}>
                  {['small', 'normal', 'large'].map(size => (
                    <button key={size} onClick={() => applyFontSize(size)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all capitalize ${fontSize === size ? (isDark ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-violet-700 shadow-sm') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')}`}>
                      {size === 'small' ? t.small : size === 'normal' ? t.normal : t.large}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className={`text-sm font-bold flex items-center gap-2 mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}><Zap className="w-4 h-4 text-amber-500" /> {t.anim}</div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.animDesc}</div>
                </div>
                <button onClick={() => applyAnimations(!animations)} className={`relative w-12 h-6 rounded-full transition-colors ${animations ? 'bg-violet-500' : 'bg-slate-400'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${animations ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* TOGGLE PANEL TERAKHIR DILIHAT */}
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className={`text-sm font-bold flex items-center gap-2 mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}><LayoutPanelLeft className="w-4 h-4 text-sky-500" /> {t.recentPanel}</div>
                  <div className={`text-xs pr-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.recentDesc}</div>
                </div>
                <button onClick={() => applyShowRecent(!showRecent)} className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${showRecent ? 'bg-violet-500' : 'bg-slate-400'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showRecent ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

            </section>

            <div className={`border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />

            <section className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock className="w-4 h-4" /> {t.schedule}
              </h3>
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.schedule}</div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.scheduleDesc}</div>
                </div>
                <button onClick={() => applySchedule(!schedule)} className={`relative w-12 h-6 rounded-full transition-colors ${schedule ? 'bg-violet-500' : 'bg-slate-400'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${schedule ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </section>

            <div className={`border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />

            <section className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-pink-500`}>
                <AlertTriangle className="w-4 h-4" /> {t.danger}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleResetSettings} className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors flex flex-col items-center gap-2 ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                  <Settings className="w-5 h-5" /> {t.reset}
                </button>
                <button onClick={handleClearData} className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-colors flex flex-col items-center gap-2 ${isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-500 hover:bg-pink-500/20' : 'bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100'}`}>
                  <AlertTriangle className="w-5 h-5" /> {t.clear}
                </button>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};