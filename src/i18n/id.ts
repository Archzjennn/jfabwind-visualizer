export const id = {
  // Navbar & Global
  about: 'Tentang',
  eduMode: 'Mode Edukasi',
  toastCopied: 'Tautan disalin!',
  toastExported: 'Berhasil diekspor!',
  toastPdfSuccess: 'Laporan PDF berhasil diunduh!',
  toastPdfError: 'Gagal memproses laporan PDF.',

  // RegexInput
  inputLabel: 'Masukkan Ekspresi Reguler',
  example: 'Contoh:',
  inputPlaceholder: 'Ketik regex... misal: (a|b)*c',
  visualize: 'Visualisasi',
  copyLink: 'Salin Tautan',
  syntaxGuide: 'Panduan Sintaks',
  history: 'Riwayat',
  clearAll: 'Bersihkan Semua',
  noHistory: 'Belum ada riwayat regex.',

  // Validasi & Error
  errEmpty: 'Ekspresi regex tidak boleh kosong',
  errParenClose: 'Terdapat kurung tutup ")" yang tidak memiliki pasangan',
  errParenOpen: 'Terdapat kurung buka "(" yang tidak memiliki pasangan',
  errInvalid: 'Format regex tidak valid atau tidak didukung.',

  // String Tester
  singleTest: 'Uji Tunggal',
  batchTest: 'Uji Massal',
  testDesc: 'Uji string tunggal terhadap aturan DFA.',
  testPlaceholder: 'Masukkan string... (kosong = ε)',
  btnTest: 'Uji String',
  batchDesc: 'Masukkan beberapa string (satu string per baris) untuk menguji DFA secara massal.',
  batchPlaceholder: 'Masukkan string...\nContoh:\nab\naac\nbb',
  btnExportCsv: 'Ekspor ke CSV',

  // InfoPanel
  infoTitle: 'Analisis Automata',
  btnPdf: 'Generate PDF Report',
  btnProcessing: 'Memproses...',
  stateNfa: 'State NFA',
  stateDfa: 'State DFA',
  initEps: 'ε-Closure State Awal',
  alphabet: 'Alfabet (Σ)',
  descExpand: 'DFA terbentuk dari {dfa} state, merupakan perluasan dari struktur asli NFA yang memiliki {nfa} state. Peningkatan ukuran ini wajar untuk menghilangkan sifat non-deterministik.',
  descReduce: 'DFA terbentuk dari {dfa} state, berhasil mereduksi kompleksitas ruang secara efisien dari struktur asli NFA yang memiliki {nfa} state.',
  descEqual: 'DFA terbentuk dari {dfa} state, mempertahankan efisiensi ruang yang setara dengan susunan asli NFA yang memiliki {nfa} state.',

  // EducationPanel
  eduPanelTitle: 'Mode Edukasi: Langkah Konversi',
  eduStepOf: 'Langkah {current} dari {total}',
  btnPrev: 'Sebelumnya',
  btnNext: 'Selanjutnya',
  
  step1Title: 'Parsing & Validasi Regex',
  step1Desc: 'Notasi postfix (Reverse Polish Notation) menyusun operator setelah operand, menghilangkan ambiguitas hierarki operasi tanpa tanda kurung.',
  
  step2Title: "Thompson's Construction (NFA)",
  step2Desc: 'Membaca karakter postfix kiri ke kanan untuk membentuk fragmen NFA tunggal berdasarkan aturan basis dan induktif:',
  step2Bullet1: 'Karakter Alfabet: Transisi linear state awal ke akhir.',
  step2Bullet2: 'Union (|): Percabangan paralel (ε) ke 2 fragmen.',
  step2Bullet3: 'Kleene Star (*): Transisi rekursif (looping ε).',
  step2Bullet4: 'Concatenation (.): Penghubungan ekor fragmen A ke kepala B.',
  step2Total: 'Total NFA: {count} State',

  step3Title: 'ε-Closure Calculation',
  step3Desc: 'Himpunan state yang dapat diakses langsung menggunakan transisi kosong (ε) tanpa mengonsumsi input karakter alfabet apa pun.',
  step3TableCol1: 'State NFA',
  step3TableCol2: 'Himpunan ε-Closure',

  step4Title: 'Subset Construction (DFA)',
  step4Desc: 'Menyelesaikan sifat non-deterministik dengan membungkus sekumpulan state NFA menjadi satu entitas state DFA tunggal.',
  step4TableCol1: 'State DFA',
  step4TableCol2: 'Subset State NFA',

  step3Hint: "Sorot baris tabel untuk melihat closure pada graf.",
  step4Hint: "Sorot baris tabel untuk melihat state DFA pada graf.",

  step5Title: 'Hasil Analisis Akhir',
  step5NfaStruct: 'Struktur NFA',
  step5DfaStruct: 'Struktur DFA',
  step5States: 'States:',
  step5Transitions: 'Transisi:',
  step5Conclusion: 'DFA memberikan komputasi eksekusi lebih cepat (linear) karena hilangnya ambiguitas transisi, namun representasi matematisnya terkadang mengonsumsi memori state yang lebih besar.',

  // AboutModal
  aboutDesc: 'Aplikasi interaktif berbasis web untuk memvisualisasikan konversi Ekspresi Reguler menjadi Non-deterministic Finite Automaton (NFA) menggunakan Thompson\'s Construction, dan selanjutnya divalidasi menjadi Deterministic Finite Automaton (DFA) melalui Subset Construction.',
  academicTitle: 'Informasi Akademik',
  course: 'Mata Kuliah:',
  prodi: 'Program Studi:',
  semester: 'Semester:',
  year: 'Tahun:',
  techTitle: 'Tech Stack',
  teamTitle: 'Tim JFABWIND',

  // App & Graph Titles
  appTitle: 'Regex to Automata Visualizer',
  appDesc: 'Ubah ekspresi reguler menjadi Non-deterministic Finite Automaton (NFA), lalu konversi menjadi Deterministic Finite Automaton (DFA).',
  graphNfa: 'Visualisasi NFA',
  graphDfa: 'Visualisasi DFA',
  tableNfa: 'Tabel Transisi NFA',
  tableDfa: 'Tabel Transisi DFA',
  
  // Academic Values
  courseName: 'Teori Bahasa dan Automata',
  prodiName: 'Teknik Informatika',

  // Shortcuts Modal
  scTitle: 'Pintasan Keyboard',
  scVisualize: 'Visualisasi regex (Mulai Proses)',
  scEduMode: 'Aktifkan/Matikan Mode Edukasi',
  scTheme: 'Ubah Tema Gelap / Terang',
  scExportPng: 'Ekspor PNG (Graf Aktif)',
  scCopyLink: 'Salin tautan untuk dibagikan',
  scHistory: 'Buka/Tutup panel Riwayat',
  scGuide: 'Tampilkan panduan pintasan ini',

  // Onboarding Tour
  tour1Title: 'Selamat Datang!',
  tour1Desc: 'Mari ikuti tur singkat untuk mengenal fitur utama JFABWIND Visualizer.',
  tour2Title: '1. Input Regex',
  tour2Desc: 'Ketik ekspresi reguler Anda di sini. Anda juga bisa mencoba contoh yang tersedia.',
  tour3Title: '2. Visualisasi Automata',
  tour3Desc: 'Klik tombol ini untuk memproses Regex menjadi mesin Automata. Setelah diproses, panel Analisis dan Uji String akan muncul di bawah.',
  tour4Title: '3. Mode Edukasi',
  tour4Desc: 'Aktifkan mode ini untuk melihat penjelasan matematis langkah demi langkah dari algoritma konversi.',
  tour5Title: '4. Kontrol Tambahan',
  tour5Desc: 'Di area ini Anda dapat mengubah bahasa, melihat pintasan keyboard, dan mengganti tema (Gelap/Terang).',
  tourNext: 'Lanjut',
  tourPrev: 'Kembali',
  tourSkip: 'Lewati',
  tourClose: 'Mulai Jelajah!',

  // Regex Builder
  rbTitle: 'Regex Builder',
  rbAddState: '+ Add State',
  rbAddTrans: '→ Add Trans',
  rbSetInit: '◉ Set Init',
  rbSetFinal: '◎ Set Final',
  rbDelete: '🗑 Delete',
  rbClearAll: 'Clear All',
  rbGenerate: 'Generate Regex',
  rbGeneratedLabel: 'Generated Regex:',
  rbSendToVis: 'Send to Visualizer →',
  rbCopy: 'Copy Regex',
  rbPlaceholder: 'Buat automata di atas lalu klik Generate Regex',
  errNoInit: 'Minimal harus ada 1 Initial State',
  errNoFinal: 'Minimal harus ada 1 Final State',
  errNoState: 'Canvas tidak boleh kosong',
  errNoLabel: 'Semua transisi harus memiliki label',
  rbConfirmClear: 'Yakin ingin menghapus semua state dan transisi?',
  rbLoadPreset: 'Load Preset...',
};