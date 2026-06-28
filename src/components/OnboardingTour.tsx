import { useEffect } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const OnboardingTour = () => {
  const { hasSeenTour, runTour, completeTour, lang } = useStore();
  const t = lang === 'id' ? id : en;

  useEffect(() => {
    if (!hasSeenTour || runTour) {
      const timer = setTimeout(() => {
        const isMobile = window.innerWidth < 1024;

        const driverObj = driver({
          showProgress: true,
          animate: true,
          smoothScroll: true,
          allowClose: true,
          nextBtnText: t.tourNext || (lang === 'id' ? 'Lanjut' : 'Next'),
          prevBtnText: t.tourPrev || (lang === 'id' ? 'Kembali' : 'Prev'),
          doneBtnText: t.tourClose || (lang === 'id' ? 'Selesai' : 'Done'),
          onDestroyStarted: () => {
            completeTour(); 
            driverObj.destroy();
          },
          steps: [
            {
              element: 'body',
              popover: {
                title: t.tour1Title || (lang === 'id' ? 'Selamat Datang di JFABWIND!' : 'Welcome to JFABWIND!'),
                description: t.tour1Desc || (lang === 'id' ? 'Mari ikuti tur singkat untuk mengenal fitur-fitur ajaib aplikasi ini.' : 'Let\'s take a quick tour to explore the magic features of this app.'),
                side: 'over' as const,
                align: 'center' as const,
              },
            },
            {
              element: '#tour-regex-input',
              popover: {
                title: t.tour2Title || (lang === 'id' ? 'Input Regex' : 'Regex Input'),
                description: t.tour2Desc || (lang === 'id' ? 'Ketik ekspresi reguler Anda di sini. Gunakan icon jam untuk melihat panduan sintaks jika bingung!' : 'Type your regular expression here. Use the clock icon to see the syntax guide if you need help!'),
                side: 'bottom' as const,
              },
            },
            {
              element: '#tour-recent-panel',
              popover: {
                title: lang === 'id' ? 'Terakhir Dilihat & Favorit' : 'Recently Viewed & Favorites',
                description: lang === 'id' ? 'Akses cepat riwayat regex Anda sebelumnya dan klik ikon bintang untuk menyematkan regex favorit Anda di sini.' : 'Quickly access your previous regex history and click the star icon to pin your favorites here.',
                side: 'bottom' as const,
              },
            },
            {
              element: '#tour-visualize-btn',
              popover: {
                title: t.tour3Title || (lang === 'id' ? 'Proses Automata' : 'Process Automata'),
                description: t.tour3Desc || (lang === 'id' ? 'Klik tombol ini untuk mulai menghasilkan graf NFA, DFA, dan tabel transisi secara instan.' : 'Click this to instantly generate NFA, DFA graphs, and transition tables.'),
                side: 'bottom' as const,
              },
            },
            ...(!isMobile ? [{
              element: '#tour-builder-btn',
              popover: {
                title: lang === 'id' ? 'Regex Builder' : 'Regex Builder',
                description: lang === 'id' ? 'Pusing mengetik manual? Rancang automata secara visual dengan drag-and-drop untuk menghasilkan regex secara otomatis.' : 'Tired of typing? Visually design automata with drag-and-drop to auto-generate regex.',
                side: 'bottom' as const,
              },
            } satisfies DriveStep] : []),
            {
              element: '#tour-quiz-btn',
              popover: {
                title: lang === 'id' ? 'Kuis Interaktif' : 'Interactive Quiz',
                description: lang === 'id' ? 'Uji pemahaman Anda tentang konsep automata melalui kuis dinamis yang seru ini.' : 'Test your understanding of automata concepts through this fun dynamic quiz.',
                side: 'bottom' as const,
              },
            },
            {
              element: '#tour-glossary-btn',
              popover: {
                title: lang === 'id' ? 'Kamus Glosarium' : 'Glossary Dictionary',
                description: lang === 'id' ? 'Temukan penjelasan ringkas mengenai istilah-istilah sulit dalam Teori Bahasa dan Automata.' : 'Find quick explanations of difficult terms in Formal Language and Automata Theory.',
                side: 'bottom' as const,
              },
            },
            {
              element: '#tour-edu-btn',
              popover: {
                title: t.tour4Title || (lang === 'id' ? 'Mode Edukasi' : 'Education Mode'),
                description: t.tour4Desc || (lang === 'id' ? 'Aktifkan untuk melihat penjelasan langkah demi langkah pembuatan algoritma Thompson dan Subset secara teoritis.' : 'Enable this to see step-by-step theoretical explanations of Thompson and Subset algorithm creation.'),
                side: 'bottom' as const,
              },
            },
            {
              element: '#tour-controls',
              popover: {
                title: t.tour5Title || (lang === 'id' ? 'Pusat Kontrol & Pengaturan' : 'Control Center & Settings'),
                description: t.tour5Desc || (lang === 'id' ? 'Ubah bahasa, ganti tema warna, lihat shortcut, dan buka menu Pengaturan (Settings) untuk menyesuaikan tampilan aplikasi.' : 'Change language, change color themes, view shortcuts, and open the Settings menu to customize the app appearance.'),
                side: 'bottom' as const,
              },
            },
          ] satisfies DriveStep[],
        });

        driverObj.drive();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [hasSeenTour, runTour, completeTour, lang, t]);

  return null;
};