import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookText, X, Search, User, Hash, Cpu, Shuffle, ArrowLeft, ChevronRight, ExternalLink, Quote } from 'lucide-react';
import { useStore } from '../store/useStore';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

type Category = 'Semua' | 'Automata' | 'Regex' | 'Algoritma' | 'Tokoh';

interface Term {
  id: string;
  category: Exclude<Category, 'Semua'>;
  term: { id: string; en: string };
  notation?: string;
  preview: { id: string; en: string };
  definition: { id: string[]; en: string[] };
  example?: { id: string; en: string };
  related: string[];
  image?: string;
  years?: string;
  nationality?: { id: string; en: string };
  discoveries?: { id: string[]; en: string[] };
  quote?: { id: string; en: string };
  wiki?: string;
}

const GLOSSARY_DATA: Term[] = [
  // --- KONSEP AUTOMATA ---
  {
    id: 'fa', category: 'Automata',
    term: { id: 'Finite Automaton (FA)', en: 'Finite Automaton (FA)' },
    preview: { id: 'Model komputasi teoretis dengan memori sangat terbatas.', en: 'A theoretical model of computation with very limited memory.' },
    definition: {
      id: ['Mesin abstrak yang memiliki sejumlah state berhingga (finite).', 'FA digunakan untuk mengenali pola dan memvalidasi string dalam bahasa reguler.'],
      en: ['An abstract machine having a finite number of states.', 'FA is used to recognize patterns and validate strings in regular languages.']
    },
    example: { id: 'Pintu putar otomatis (turnstile) dengan state Terkunci dan Terbuka.', en: 'A turnstile with Locked and Unlocked states.' },
    related: ['dfa', 'nfa', 'state', 'alphabet']
  },
  {
    id: 'dfa', category: 'Automata', notation: 'M = (Q, Σ, δ, q0, F)',
    term: { id: 'DFA (Deterministic Finite Automaton)', en: 'DFA (Deterministic Finite Automaton)' },
    preview: { id: 'Automata dengan tepat satu transisi untuk setiap simbol.', en: 'Automaton with exactly one transition per symbol.' },
    definition: {
      id: ['Mesin state berhingga di mana untuk setiap state dan setiap simbol input, hanya ada tepat satu state tujuan berikutnya.', 'DFA tidak mengizinkan transisi ganda atau transisi tanpa input (epsilon).'],
      en: ['A finite state machine where for each state and input symbol, there is exactly one next state.', 'DFA does not allow multiple transitions or empty (epsilon) transitions.']
    },
    related: ['fa', 'nfa', 'minimize', 'transition']
  },
  {
    id: 'nfa', category: 'Automata', notation: 'M = (Q, Σ, δ, q0, F)',
    term: { id: 'NFA (Non-deterministic Finite Automaton)', en: 'NFA (Non-deterministic Finite Automaton)' },
    preview: { id: 'Automata dengan kemungkinan transisi bercabang.', en: 'Automaton with branching transition possibilities.' },
    definition: {
      id: ['Mesin state berhingga yang membolehkan transisi ke lebih dari satu state untuk simbol yang sama.', 'NFA juga membolehkan transisi epsilon (tanpa mengonsumsi input). NFA dan DFA memiliki kekuatan komputasi yang ekuivalen.'],
      en: ['A finite state machine that allows transitions to multiple states for the same symbol.', 'It also allows epsilon transitions. NFA and DFA have equivalent computational power.']
    },
    related: ['fa', 'dfa', 'epsilon', 'subset']
  },
  {
    id: 'alphabet', category: 'Automata', notation: 'Σ (Sigma)',
    term: { id: 'Alphabet (Σ)', en: 'Alphabet (Σ)' },
    preview: { id: 'Himpunan simbol berhingga.', en: 'A finite set of symbols.' },
    definition: {
      id: ['Himpunan tidak kosong dan berhingga dari simbol-simbol dasar yang digunakan untuk membentuk string.', 'Contoh paling umum adalah alfabet biner atau huruf latin.'],
      en: ['A non-empty, finite set of basic symbols used to form strings.', 'The most common examples are the binary alphabet or Latin letters.']
    },
    example: { id: 'Σ = {0, 1} atau Σ = {a, b, c}', en: 'Σ = {0, 1} or Σ = {a, b, c}' },
    related: ['regex', 'language']
  },
  {
    id: 'language', category: 'Automata', notation: 'L',
    term: { id: 'Regular Language', en: 'Regular Language' },
    preview: { id: 'Himpunan string yang dikenali oleh FA.', en: 'A set of strings recognized by an FA.' },
    definition: {
      id: ['Sebuah bahasa formal yang dapat diekspresikan menggunakan ekspresi reguler atau dikenali oleh DFA/NFA.', 'Bahasa ini tertutup terhadap operasi union, konkatenasi, dan Kleene star.'],
      en: ['A formal language that can be expressed using regular expressions or recognized by a DFA/NFA.', 'This language is closed under union, concatenation, and Kleene star.']
    },
    related: ['fa', 'regex', 'kleene']
  },
  {
    id: 'state', category: 'Automata', notation: 'Q',
    term: { id: 'State', en: 'State' },
    preview: { id: 'Kondisi memori mesin pada waktu tertentu.', en: 'The memory condition of the machine at a given time.' },
    definition: {
      id: ['Representasi memori dari mesin automata. Sebuah mesin berpindah dari satu state ke state lain berdasarkan simbol input yang dibaca.'],
      en: ['A memory representation of an automaton machine. A machine transitions from one state to another based on the input symbol read.']
    },
    related: ['init', 'final', 'dead']
  },
  {
    id: 'init', category: 'Automata', notation: 'q0',
    term: { id: 'Initial State', en: 'Initial State' },
    preview: { id: 'State awalan saat mesin mulai membaca input.', en: 'The starting state when the machine begins reading input.' },
    definition: {
      id: ['State tunggal tempat mesin automata mulai memproses string input pertama kalinya.', 'Dalam diagram, biasanya ditandai dengan anak panah yang masuk dari luar.'],
      en: ['The single state where the automaton begins processing the input string.', 'In diagrams, it is usually marked by an incoming arrow from nowhere.']
    },
    related: ['state', 'final']
  },
  {
    id: 'final', category: 'Automata', notation: 'F',
    term: { id: 'Final / Accept State', en: 'Final / Accept State' },
    preview: { id: 'State yang menentukan string diterima.', en: 'State that determines if a string is accepted.' },
    definition: {
      id: ['Himpunan state yang jika mesin berhenti di salah satunya setelah membaca seluruh input, maka string tersebut dianggap diterima (Valid).', 'Digambarkan dengan lingkaran ganda pada diagram.'],
      en: ['A set of states such that if the machine halts in one of them after reading all input, the string is accepted (Valid).', 'Represented by double circles in diagrams.']
    },
    related: ['state', 'init']
  },
  {
    id: 'dead', category: 'Automata',
    term: { id: 'Dead / Trap State', en: 'Dead / Trap State' },
    preview: { id: 'State jebakan tanpa jalan keluar menuju Final State.', en: 'A trap state with no path to a Final State.' },
    definition: {
      id: ['Sebuah state yang tidak termasuk Final State dan memiliki transisi ke dirinya sendiri untuk setiap simbol.', 'Jika mesin masuk ke state ini, ia tidak akan pernah bisa menerima string input tersebut.'],
      en: ['A non-final state that transitions to itself for every possible input symbol.', 'Once a machine enters this state, it can never accept the string.']
    },
    related: ['state', 'dfa']
  },
  {
    id: 'transition', category: 'Automata', notation: 'δ (Delta)',
    term: { id: 'Transition Function', en: 'Transition Function' },
    preview: { id: 'Aturan pergerakan antar state.', en: 'The rules of movement between states.' },
    definition: {
      id: ['Fungsi matematika yang memetakan (State Saat Ini, Simbol Input) menjadi State Berikutnya.', 'Pada DFA fungsinya memetakan tepat 1 state, sedangkan pada NFA bisa himpunan state.'],
      en: ['A mathematical function mapping (Current State, Input Symbol) to the Next State.', 'In DFA it maps to exactly 1 state, while in NFA it maps to a set of states.']
    },
    related: ['fa', 'alphabet']
  },
  {
    id: 'epsilon', category: 'Automata', notation: 'ε',
    term: { id: 'Epsilon (ε) Transition', en: 'Epsilon (ε) Transition' },
    preview: { id: 'Pindah state secara gratis tanpa membaca input.', en: 'Free state movement without reading input.' },
    definition: {
      id: ['Transisi dalam NFA yang membolehkan mesin berpindah state secara instan tanpa mengonsumsi karakter input apa pun.', 'Sangat berguna dalam menggabungkan automata kecil menjadi besar.'],
      en: ['A transition in NFA allowing the machine to instantly change states without consuming any input characters.', 'Very useful when combining smaller automata.']
    },
    related: ['nfa', 'closure', 'thompson']
  },
  {
    id: 'closure', category: 'Automata', notation: 'ε-closure(q)',
    term: { id: 'Epsilon Closure', en: 'Epsilon Closure' },
    preview: { id: 'Kumpulan state yang dapat dicapai via Epsilon.', en: 'Set of states reachable via Epsilon.' },
    definition: {
      id: ['Himpunan semua state yang dapat dicapai dari suatu state q hanya dengan mengikuti jalur transisi epsilon, termasuk state q itu sendiri.', 'Ini adalah langkah kunci dalam mengonversi NFA ke DFA.'],
      en: ['The set of all states reachable from a state q using only epsilon transitions, including q itself.', 'This is a key step in NFA to DFA conversion.']
    },
    related: ['epsilon', 'subset']
  },
  {
    id: 'cfg', category: 'Automata',
    term: { id: 'Context-Free Grammar (CFG)', en: 'Context-Free Grammar (CFG)' },
    preview: { id: 'Sistem aturan tata bahasa tingkat lanjut.', en: 'An advanced grammatical rule system.' },
    definition: {
      id: ['Sistem aturan (produksi) untuk menghasilkan string dalam suatu bahasa formal.', 'CFG lebih kuat dari Regular Expression dan merupakan dasar teori pembuatan *Compiler* bahasa pemrograman.'],
      en: ['A set of production rules to generate strings in a formal language.', 'More powerful than Regex, CFGs are the theoretical foundation for programming language compilers.']
    },
    related: ['pda', 'chomsky']
  },
  {
    id: 'pda', category: 'Automata',
    term: { id: 'Push-down Automaton (PDA)', en: 'Push-down Automaton (PDA)' },
    preview: { id: 'Automata yang dilengkapi dengan memori stack.', en: 'Automaton equipped with stack memory.' },
    definition: {
      id: ['Mesin state berhingga yang ditambahkan sebuah memori berbentuk Stack (tumpukan) berukuran tak terhingga.', 'PDA digunakan untuk mengenali bahasa bebas konteks (Context-Free Language), seperti kurung kurawal bersarang pada kode program.'],
      en: ['A finite state machine augmented with an infinite Stack memory.', 'PDAs are used to recognize Context-Free Languages, such as matching nested parentheses in code.']
    },
    related: ['cfg', 'fa']
  },
  {
    id: 'tm', category: 'Automata',
    term: { id: 'Turing Machine', en: 'Turing Machine' },
    preview: { id: 'Model dasar komputer modern yang universal.', en: 'The fundamental model of modern universal computers.' },
    definition: {
      id: ['Model komputasi matematis dengan pita memori memanjang tak terbatas yang bisa dibaca dan ditulis.', 'Mesin ini dapat mensimulasikan segala jenis algoritma komputer modern apa pun. Jika sesuatu bisa dikomputasi, Mesin Turing bisa menyelesaikannya.'],
      en: ['A mathematical computation model with an infinitely long tape that can be read and written.', 'It can simulate any modern computer algorithm. If something is computable, a Turing Machine can do it.']
    },
    related: ['turing', 'decide']
  },
  {
    id: 'decide', category: 'Automata',
    term: { id: 'Decidability', en: 'Decidability' },
    preview: { id: 'Sifat apakah suatu masalah bisa diselesaikan algoritma.', en: 'Property of whether a problem is solvable by algorithms.' },
    definition: {
      id: ['Konsep yang mempertanyakan apakah ada algoritma yang dapat memberikan jawaban "Ya" atau "Tidak" untuk seluruh input yang mungkin pada suatu permasalahan.', 'Masalah yang tidak bisa dijawab oleh mesin mana pun disebut Undecidable (contoh: Halting Problem).'],
      en: ['A concept questioning if an algorithm exists that can yield a "Yes" or "No" answer for all possible inputs of a problem.', 'Problems that no machine can solve are Undecidable (e.g., Halting Problem).']
    },
    related: ['tm', 'turing']
  },

  // --- REGEX ---
  {
    id: 'regex', category: 'Regex',
    term: { id: 'Regular Expression (Regex)', en: 'Regular Expression (Regex)' },
    preview: { id: 'Notasi aljabar untuk mendeskripsikan pola teks.', en: 'Algebraic notation to describe text patterns.' },
    definition: {
      id: ['Sebuah urutan karakter yang menentukan sebuah pola pencarian teoretis.', 'Regex digunakan untuk mencocokkan string, validasi form, dan secara ekuivalen dapat diubah menjadi mesin NFA/DFA.'],
      en: ['A sequence of characters that specifies a theoretical search pattern.', 'Used for string matching, form validation, and can be equivalently converted to NFA/DFA.']
    },
    example: { id: '(a|b)*abb', en: '(a|b)*abb' },
    related: ['kleene', 'concat', 'union', 'thompson', 'kleene_person']
  },
  {
    id: 'kleene', category: 'Regex', notation: '*',
    term: { id: 'Kleene Star', en: 'Kleene Star' },
    preview: { id: 'Operasi pengulangan nol atau lebih.', en: 'Operation for zero or more repetitions.' },
    definition: {
      id: ['Operasi yang menghasilkan kumpulan string yang dibuat dengan menggabungkan elemen dasar sebanyak nol kali, satu kali, atau lebih.', 'Ditemukan oleh Stephen Kleene, melambangkan perulangan tak berhingga dalam automata.'],
      en: ['An operation producing a set of strings formed by concatenating the base element zero, one, or multiple times.', 'Invented by Stephen Kleene, representing infinite loops in automata.']
    },
    example: { id: 'a* = {ε, a, aa, aaa, ...}', en: 'a* = {ε, a, aa, aaa, ...}' },
    related: ['regex', 'kleene_person']
  },
  {
    id: 'concat', category: 'Regex', notation: '·',
    term: { id: 'Concatenation', en: 'Concatenation' },
    preview: { id: 'Operasi penyambungan dua string/pola.', en: 'Operation linking two strings/patterns.' },
    definition: {
      id: ['Operasi yang menggabungkan dua simbol atau bahasa berurutan.', 'Jika L1 = {a} dan L2 = {b}, maka konkatenasi L1L2 = {ab}.'],
      en: ['The operation of joining two symbols or languages sequentially.', 'If L1 = {a} and L2 = {b}, their concatenation is L1L2 = {ab}.']
    },
    related: ['regex', 'union']
  },
  {
    id: 'union', category: 'Regex', notation: '∪ atau |',
    term: { id: 'Union (Pilihan)', en: 'Union (Alternation)' },
    preview: { id: 'Operasi logika OR pada pola.', en: 'Logical OR operation on patterns.' },
    definition: {
      id: ['Operasi pilihan ganda (Alternation). String akan diterima jika cocok dengan pola pertama ATAU pola kedua.', 'Digambarkan dengan garis paralel (bercabang) pada graf Automata.'],
      en: ['An alternation operation. A string is accepted if it matches the first pattern OR the second pattern.', 'Represented as parallel (branching) paths in Automata graphs.']
    },
    example: { id: 'a|b berarti menerima "a" atau "b"', en: 'a|b means it accepts "a" or "b"' },
    related: ['regex', 'concat']
  },

  // --- ALGORITMA ---
  {
    id: 'thompson', category: 'Algoritma',
    term: { id: "Thompson's Construction", en: "Thompson's Construction" },
    preview: { id: 'Algoritma konversi Regex menjadi NFA.', en: 'Algorithm converting Regex to NFA.' },
    definition: {
      id: ['Algoritma klasik untuk menyusun NFA dari Regular Expression secara modular.', 'Ditemukan oleh Ken Thompson, algoritma ini menggabungkan template NFA kecil (seperti union, bintang kleene) menjadi mesin yang utuh menggunakan transisi epsilon.'],
      en: ['A classic algorithm to build an NFA from a Regular Expression modularly.', 'Invented by Ken Thompson, it pieces together small NFA templates using epsilon transitions.']
    },
    related: ['regex', 'nfa', 'thompson_person']
  },
  {
    id: 'subset', category: 'Algoritma',
    term: { id: 'Subset Construction', en: 'Subset Construction' },
    preview: { id: 'Algoritma konversi NFA menjadi DFA.', en: 'Algorithm converting NFA to DFA.' },
    definition: {
      id: ['Dikenal juga sebagai algoritma Powerset. Digunakan untuk mengonversi NFA apa pun menjadi DFA yang ekuivalen.', 'Algoritma ini melacak himpunan (subset) dari state-state NFA yang bisa dicapai secara serentak (melalui Epsilon Closure) dan menjadikannya sebagai satu state baru pada DFA.'],
      en: ['Also known as Powerset Construction. Used to convert any NFA into an equivalent DFA.', 'It tracks sets of NFA states reachable simultaneously (via Epsilon Closures) and lumps them into a single DFA state.']
    },
    related: ['nfa', 'dfa', 'closure', 'rabin_scott']
  },
  {
    id: 'minimize', category: 'Algoritma',
    term: { id: 'State Minimization', en: 'State Minimization' },
    preview: { id: 'Proses merampingkan DFA.', en: 'Process of streamlining a DFA.' },
    definition: {
      id: ['Proses mereduksi jumlah state pada DFA tanpa mengubah bahasa yang dikenali mesin tersebut.', 'Proses ini menggabungkan state-state yang ekuivalen (indistinguishable) menjadi satu state tunggal untuk optimalisasi komputasi.'],
      en: ['The process of reducing the number of states in a DFA without changing the language it recognizes.', 'It merges indistinguishable states into a single state for computational optimization.']
    },
    related: ['hopcroft', 'dfa']
  },
  {
    id: 'hopcroft', category: 'Algoritma',
    term: { id: "Hopcroft's Algorithm", en: "Hopcroft's Algorithm" },
    preview: { id: 'Algoritma paling efisien untuk minimisasi DFA.', en: 'The most efficient algorithm for DFA minimization.' },
    definition: {
      id: ['Algoritma tercepat secara teoretis O(n log n) untuk melakukan minimisasi DFA.', 'Algoritma ini bekerja dengan mempartisi state ke dalam grup-grup Final dan Non-Final, lalu terus membelahnya berdasarkan perilaku transisi simbol.'],
      en: ['The theoretically fastest O(n log n) algorithm for DFA minimization.', 'It works by partitioning states into Final and Non-Final groups, repeatedly refining them based on transition behavior.']
    },
    related: ['minimize', 'dfa', 'hopcroft_person']
  },
  {
    id: 'pumping', category: 'Algoritma',
    term: { id: 'Pumping Lemma', en: 'Pumping Lemma' },
    preview: { id: 'Teknik pembuktian batasan bahasa.', en: 'Proof technique for language boundaries.' },
    definition: {
      id: ['Sebuah teorema lemma yang digunakan untuk membuktikan bahwa suatu bahasa TERTENTU BUKANLAH bahasa reguler.', 'Menyatakan bahwa untuk bahasa reguler apa pun, string yang cukup panjang pastilah mengandung pengulangan (pumping) di bagian tengahnya karena keterbatasan state FA.'],
      en: ['A lemma used to prove that a specific language is NOT a regular language.', 'It states that for any regular language, a sufficiently long string must contain a repeatable (pumpable) middle section due to the finite states of FA.']
    },
    example: { id: 'Membuktikan a^n b^n bukan reguler.', en: 'Proving a^n b^n is not regular.' },
    related: ['language', 'fa']
  },

  // --- TOKOH PENEMU ---
  {
    id: 'turing', category: 'Tokoh',
    term: { id: 'Alan Turing', en: 'Alan Turing' },
    preview: { id: 'Bapak ilmu komputer teoretis.', en: 'Father of theoretical computer science.' },
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Alan_Turing_Aged_16.jpg',
    years: '1912 - 1954', nationality: { id: 'Inggris', en: 'British' },
    definition: {
      id: ['Alan Mathison Turing adalah matematikawan, ahli logika, dan kriptografer yang diakui luas sebagai bapak ilmu komputer modern dan kecerdasan buatan (AI).', 'Selama Perang Dunia II, ia memainkan peran penting di Bletchley Park dalam memecahkan kode rahasia mesin Enigma Jerman.'],
      en: ['Alan Mathison Turing was a mathematician, logician, and cryptographer widely recognized as the father of modern computer science and AI.', 'During WWII, he played a pivotal role at Bletchley Park in cracking the German Enigma code.']
    },
    discoveries: {
      id: ['Mesin Turing (Turing Machine)', 'Konsep Decidability & Halting Problem', 'Turing Test (Kecerdasan Buatan)'],
      en: ['Turing Machine', 'Decidability & Halting Problem', 'Turing Test (Artificial Intelligence)']
    },
    quote: { id: 'Kita hanya bisa melihat sedikit ke masa depan, tetapi ada banyak hal yang harus diselesaikan.', en: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.' },
    wiki: 'https://id.wikipedia.org/wiki/Alan_Turing',
    related: ['tm', 'decide']
  },
  {
    id: 'kleene_person', category: 'Tokoh',
    term: { id: 'Stephen Cole Kleene', en: 'Stephen Cole Kleene' },
    preview: { id: 'Penemu Regular Expression.', en: 'Inventor of Regular Expression.' },
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Stephen_Cole_Kleene.jpg',
    years: '1909 - 1994', nationality: { id: 'Amerika Serikat', en: 'American' },
    definition: {
      id: ['Stephen Kleene adalah seorang ahli matematika terkemuka yang membantu meletakkan dasar bagi ilmu komputer teoretis melalui teori rekursi.', 'Teorema Kleene mendemonstrasikan bahwa Finite Automata dan Regular Expression memiliki ekspresi daya komputasi yang ekuivalen persis.'],
      en: ['Stephen Kleene was a prominent mathematician who helped lay the foundations for theoretical computer science through recursion theory.', "Kleene's Theorem proved that Finite Automata and Regular Expressions have the exact same computational power."]
    },
    discoveries: {
      id: ['Regular Expression (Regex)', 'Kleene Star / Kleene Closure (*)', 'Teorema Kleene'],
      en: ['Regular Expression (Regex)', 'Kleene Star / Kleene Closure (*)', "Kleene's Theorem"]
    },
    wiki: 'https://en.wikipedia.org/wiki/Stephen_Cole_Kleene',
    related: ['regex', 'kleene', 'language']
  },
  {
    id: 'rabin_scott', category: 'Tokoh',
    term: { id: 'Michael Rabin & Dana Scott', en: 'Michael Rabin & Dana Scott' },
    preview: { id: 'Penemu konsep NFA (Pemenang Turing Award).', en: 'Inventors of NFA concept (Turing Award Winners).' },
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Michael_O._Rabin_2004.jpg',
    years: '1959', nationality: { id: 'Israel / Amerika Serikat', en: 'Israeli / American' },
    definition: {
      id: ['Dalam makalah bersama mereka tahun 1959 berjudul "Finite Automata and Their Decision Problems", Rabin dan Scott memperkenalkan gagasan "Nondeterminism" pada mesin automata.', 'Konsep ini adalah terobosan masif, membuktikan bahwa NFA dapat disimulasikan secara utuh oleh DFA.'],
      en: ['In their joint 1959 paper "Finite Automata and Their Decision Problems", they introduced the idea of "Nondeterminism" to automata.', 'This massive breakthrough proved that an NFA can be fully simulated by a DFA.']
    },
    discoveries: {
      id: ['Non-deterministic Finite Automaton (NFA)', 'Subset Construction Algorithm'],
      en: ['Non-deterministic Finite Automaton (NFA)', 'Subset Construction Algorithm']
    },
    wiki: 'https://en.wikipedia.org/wiki/Michael_O._Rabin',
    related: ['nfa', 'subset', 'dfa']
  },
  {
    id: 'hopcroft_person', category: 'Tokoh',
    term: { id: 'John Hopcroft', en: 'John Hopcroft' },
    preview: { id: 'Pionir struktur data dan minimisasi.', en: 'Pioneer of data structures and minimization.' },
    years: '1939 - Sekarang', nationality: { id: 'Amerika Serikat (Cornell University)', en: 'American (Cornell University)' },
    definition: {
      id: ['John Edward Hopcroft adalah ilmuwan komputer peraih Turing Award tahun 1986. Ia turut menulis buku teks klasik "Introduction to Automata Theory, Languages, and Computation".', 'Ia menciptakan algoritma minimisasi DFA dengan kompleksitas waktu yang sangat efisien yang dinamai dengan namanya.'],
      en: ['John Edward Hopcroft is a computer scientist and 1986 Turing Award winner. He co-authored the classic textbook "Introduction to Automata Theory, Languages, and Computation".', 'He invented a highly time-efficient DFA minimization algorithm named after him.']
    },
    discoveries: {
      id: ['Algoritma Hopcroft (DFA Minimization)', 'Buku Teks Standar Automata Klasik (Bersama Ullman)'],
      en: ["Hopcroft's Algorithm (DFA Minimization)", 'The Classic Automata Standard Textbook (with Ullman)']
    },
    wiki: 'https://id.wikipedia.org/wiki/John_Hopcroft',
    related: ['minimize', 'hopcroft']
  },
  {
    id: 'thompson_person', category: 'Tokoh',
    term: { id: 'Ken Thompson', en: 'Ken Thompson' },
    preview: { id: 'Kreator sistem operasi UNIX & Algoritma Thompson.', en: 'Creator of UNIX & Thompson Algorithm.' },
    years: '1943 - Sekarang', nationality: { id: 'Amerika Serikat (Bell Labs)', en: 'American (Bell Labs)' },
    definition: {
      id: ['Selain menciptakan sistem operasi Unix dan bahasa pemorograman Go, Ken Thompson adalah orang pertama yang mengimplementasikan teori Regular Expression ke dalam dunia nyata (software komputer).', 'Ia menulis editor teks legendaris bernama *ed* dan algoritma konstruksi yang merubah Regex yang diketik user menjadi eksekusi NFA secara *on-the-fly*.'],
      en: ['Besides creating UNIX and the Go programming language, Ken Thompson was the first to implement Regular Expression theory into real-world software.', 'He wrote the legendary *ed* text editor and the construction algorithm that converts user-typed Regex into NFA execution on-the-fly.']
    },
    discoveries: {
      id: ["Thompson's Construction (Regex ke NFA)", 'Sistem Operasi UNIX', 'Bahasa Pemrograman B (Pendetahulu C)'],
      en: ["Thompson's Construction (Regex to NFA)", 'UNIX Operating System', 'B Programming Language (Predecessor to C)']
    },
    quote: { id: 'Satu hari saya menemukan ekspresi reguler. Hari berikutnya saya menulis ed.', en: 'One of my most productive days was throwing away 1000 lines of code.' },
    wiki: 'https://id.wikipedia.org/wiki/Ken_Thompson',
    related: ['thompson', 'regex', 'nfa']
  },
  {
    id: 'chomsky', category: 'Tokoh',
    term: { id: 'Noam Chomsky', en: 'Noam Chomsky' },
    preview: { id: 'Bapak linguistik modern pengklasifikasi bahasa formal.', en: 'Father of modern linguistics classifying formal languages.' },
    image: 'https://en.wikipedia.org/wiki/Special:FilePath/Noam_Chomsky_portrait_2017_retouched.jpg',
    years: '1928 - Sekarang', nationality: { id: 'Amerika Serikat (MIT)', en: 'American (MIT)' },
    definition: {
      id: ['Noam Chomsky adalah ahli bahasa paling berpengaruh yang karyanya menjembatani ilmu Linguistik dengan Ilmu Komputer.', 'Hierarki Chomsky mendefinisikan empat tingkatan gramatika yang berhubungan langsung dengan kapabilitas mesin (FA, PDA, LBA, Turing Machine).'],
      en: ['Noam Chomsky is the most influential linguist whose work bridged Linguistics with Computer Science.', 'The Chomsky Hierarchy defines four levels of grammars directly correlating with machine capabilities (FA, PDA, LBA, Turing Machine).']
    },
    discoveries: {
      id: ['Hierarki Chomsky (Klasifikasi Bahasa)', 'Context-Free Grammars (CFG)'],
      en: ['Chomsky Hierarchy (Language Classification)', 'Context-Free Grammars (CFG)']
    },
    quote: { id: 'Bahasa adalah cermin dari akal budi.', en: 'Language is a mirror of mind.' },
    wiki: 'https://id.wikipedia.org/wiki/Noam_Chomsky',
    related: ['cfg', 'pda', 'tm']
  },
  {
    id: 'myhill_nerode', category: 'Tokoh',
    term: { id: 'John Myhill & Anil Nerode', en: 'John Myhill & Anil Nerode' },
    preview: { id: 'Matematikawan perumus syarat wajib DFA minimal.', en: 'Mathematicians framing conditions for minimal DFA.' },
    years: '1958', nationality: { id: 'Inggris / Amerika Serikat', en: 'British / American' },
    definition: {
      id: ['Mereka menerbitkan Teorema Myhill-Nerode, sebuah pondasi matematis kuat yang membuktikan bahwa setiap bahasa reguler pasti memiliki tepat satu DFA yang unik dan paling minimal (terkecil).', 'Teorema ini sering digunakan untuk membuktikan bahwa suatu bahasa bukanlah bahasa reguler.'],
      en: ['They published the Myhill-Nerode Theorem, a strong mathematical foundation proving that every regular language has exactly one unique minimal DFA.', 'This theorem is often used to mathematically prove a language is not regular.']
    },
    discoveries: {
      id: ['Teorema Myhill-Nerode (Uniqueness of Minimal DFA)'],
      en: ['Myhill-Nerode Theorem (Uniqueness of Minimal DFA)']
    },
    wiki: 'https://en.wikipedia.org/wiki/Myhill%E2%80%93Nerode_theorem',
    related: ['minimize', 'hopcroft', 'dfa']
  }
];

export const GlossaryModal = () => {
  const { isGlossaryOpen, closeGlossary, lang, theme } = useStore();
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<Category>('Semua');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  // --- IMPROVE 4/5: Debounce Filter untuk performa ringan ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset state jika modal ditutup
  useEffect(() => {
    if (!isGlossaryOpen) {
      setTimeout(() => {
        setSearch(''); setCategory('Semua'); setSelectedId(null); setHistoryStack([]);
      }, 300);
    }
  }, [isGlossaryOpen]);

  // Memfilter istilah berdasarkan pencarian & tab kategori
  const filteredTerms = useMemo(() => {
    let list = GLOSSARY_DATA;
    if (category !== 'Semua') list = list.filter(item => item.category === category);
    
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(item => 
        item.term[lang].toLowerCase().includes(q) || 
        item.preview[lang].toLowerCase().includes(q) ||
        (item.notation && item.notation.toLowerCase().includes(q))
      );
    }
    return list;
  }, [debouncedSearch, category, lang]);

  // --- FEATURE: Interaksi Keyboard (↑ ↓ Enter) ---
  useEffect(() => {
    if (!isGlossaryOpen || selectedId) return; // Matikan nav saat di panel detail
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredTerms.length === 0) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlossaryOpen, selectedId, filteredTerms]);

  const selectTerm = (id: string) => {
    setSelectedId(id);
    setHistoryStack(prev => (prev[prev.length - 1] === id ? prev : [...prev, id]));
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      setHistoryStack(newStack);
      setSelectedId(newStack[newStack.length - 1]);
    } else {
      setHistoryStack([]);
      setSelectedId(null);
    }
  };

  const pickRandom = () => {
    const randomItem = GLOSSARY_DATA[Math.floor(Math.random() * GLOSSARY_DATA.length)];
    selectTerm(randomItem.id);
  };

  if (!isGlossaryOpen) return null;

  const activeTerm = GLOSSARY_DATA.find(item => item.id === selectedId);

  // Styling helper
  const getCategoryIcon = (cat: Category) => {
    if (cat === 'Automata') return <Hash className="w-3.5 h-3.5" />;
    if (cat === 'Regex') return <Search className="w-3.5 h-3.5" />;
    if (cat === 'Algoritma') return <Cpu className="w-3.5 h-3.5" />;
    if (cat === 'Tokoh') return <User className="w-3.5 h-3.5" />;
    return <BookText className="w-3.5 h-3.5" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center sm:p-6 md:p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeGlossary} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-6xl h-full sm:h-[90vh] sm:rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-[#080810] border-white/10' : 'bg-slate-50 border-slate-200'}`}
        >
          {/* HEADER MODAL */}
          <div className={`px-4 sm:px-6 py-4 border-b flex justify-between items-center shrink-0 z-10 ${isDark ? 'border-white/10 bg-[#080810]/95 backdrop-blur' : 'border-slate-200 bg-white/95 backdrop-blur'}`}>
            <div className={`flex items-center gap-3 font-black tracking-widest uppercase text-sm ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              <BookText className="w-5 h-5" />
              {lang === 'id' ? 'Ensiklopedia Automata' : 'Automata Encyclopedia'}
            </div>
            <div className="flex gap-2">
              <button onClick={pickRandom} className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${isDark ? 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-300' : 'bg-violet-50 hover:bg-violet-100 text-violet-700'}`}>
                <Shuffle className="w-4 h-4" /> <span className="hidden sm:inline">{lang === 'id' ? 'Acak' : 'Random'}</span>
              </button>
              <button onClick={closeGlossary} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 text-slate-800'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* TWO-PANEL LAYOUT */}
          <div className="flex flex-1 overflow-hidden relative">
            
            {/* PANEL KIRI (LIST & SEARCH) */}
            <div className={`flex flex-col w-full md:w-[35%] lg:w-[30%] shrink-0 border-r ${selectedId ? 'hidden md:flex' : 'flex'} ${isDark ? 'border-white/10 bg-[#0b0b14]' : 'border-slate-200 bg-slate-50/50'}`}>
              
              <div className="p-4 space-y-4 shrink-0">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    placeholder={lang === 'id' ? 'Cari konsep, rumus, tokoh...' : 'Search concepts, symbols, people...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl outline-none transition-all border ${
                      isDark ? 'bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(['Semua', 'Automata', 'Regex', 'Algoritma', 'Tokoh'] as Category[]).map(cat => (
                    <button
                      key={cat} onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        category === cat 
                          ? (isDark ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-violet-600 text-white shadow-md')
                          : (isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200')
                      }`}
                    >
                      {getCategoryIcon(cat)} {cat === 'Semua' ? (lang === 'id' ? 'Semua' : 'All') : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 pb-20" ref={listRef}>
                {filteredTerms.length > 0 ? (
                  <div className="space-y-1">
                    {filteredTerms.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTerm(item.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all border ${
                          selectedId === item.id 
                            ? (isDark ? 'bg-violet-500/20 border-violet-500/50' : 'bg-violet-50 border-violet-300 shadow-sm') 
                            : (isDark ? 'bg-transparent border-transparent hover:bg-white/5' : 'bg-transparent border-transparent hover:bg-white')
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold leading-tight pr-2 ${selectedId === item.id ? (isDark ? 'text-violet-300' : 'text-violet-800') : (isDark ? 'text-slate-200' : 'text-slate-800')}`}>
                            {item.term[lang]}
                          </h4>
                          {item.notation && <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{item.notation}</span>}
                        </div>
                        <p className={`text-xs line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.preview[lang]}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-50 flex flex-col items-center">
                    <Search className="w-8 h-8 mb-3 opacity-50" />
                    <p className="text-sm font-medium">{lang === 'id' ? 'Istilah tidak ditemukan.' : 'Term not found.'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* PANEL KANAN (DETAIL KONTEN) */}
            <div className={`flex flex-col flex-1 h-full w-full absolute md:relative z-20 transition-transform duration-300 ${!selectedId ? 'translate-x-full md:translate-x-0 hidden md:flex' : 'translate-x-0'} ${isDark ? 'bg-[#080810]' : 'bg-white'}`}>
              
              {activeTerm ? (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Detail Toolbar */}
                  <div className={`flex items-center gap-3 px-4 sm:px-8 py-3 sm:py-4 border-b shrink-0 ${isDark ? 'border-white/10 bg-[#080810]' : 'border-slate-100 bg-white'}`}>
                    <button onClick={goBack} className={`p-2 -ml-2 rounded-lg transition-colors md:hidden ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    {historyStack.length > 1 && (
                      <button onClick={goBack} className={`hidden md:flex items-center gap-1 p-1.5 -ml-2 rounded-lg text-xs font-bold transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                        <ArrowLeft className="w-4 h-4" /> {lang === 'id' ? 'Kembali' : 'Back'}
                      </button>
                    )}
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {getCategoryIcon(activeTerm.category)} {activeTerm.category}
                    </div>
                  </div>

                  {/* Konten Scrollable */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 md:p-12">
                    <motion.div
                      key={activeTerm.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      className="max-w-3xl mx-auto space-y-8"
                    >
                      {/* Tampilan Khusus Tokoh */}
                      {activeTerm.category === 'Tokoh' ? (
                        <>
                          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                            <div className={`w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border-2 shadow-xl flex items-center justify-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                              {activeTerm.image ? (
                                <img src={activeTerm.image} alt={activeTerm.term[lang]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                              ) : (
                                <User className={`w-16 h-16 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                              )}
                            </div>
                            <div className="space-y-3">
                              <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {activeTerm.term[lang]}
                              </h2>
                              <div className={`flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {activeTerm.years && <span>{activeTerm.years}</span>}
                                {activeTerm.years && activeTerm.nationality && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30"></span>}
                                {activeTerm.nationality && <span>{activeTerm.nationality[lang]}</span>}
                              </div>
                              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {activeTerm.definition[lang][0]}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {activeTerm.definition[lang][1]}
                            </p>
                            
                            {activeTerm.discoveries && (
                              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-sky-500/5 border-sky-500/10' : 'bg-sky-50 border-sky-100'}`}>
                                <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                                  {lang === 'id' ? 'Kontribusi Utama' : 'Key Contributions'}
                                </h3>
                                <ul className="space-y-2">
                                  {activeTerm.discoveries[lang].map((disc, idx) => (
                                    <li key={idx} className={`flex items-start gap-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                      <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-sky-500' : 'text-sky-500'}`} /> {disc}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {activeTerm.quote && (
                              <div className={`relative p-6 sm:p-8 rounded-2xl border italic text-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <Quote className={`absolute top-4 left-4 w-8 h-8 opacity-20 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                                <p className={`text-lg sm:text-xl font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>"{activeTerm.quote[lang]}"</p>
                              </div>
                            )}

                            {activeTerm.wiki && (
                              <a href={activeTerm.wiki} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>
                                {lang === 'id' ? 'Baca selengkapnya di Wikipedia' : 'Read more on Wikipedia'} <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </>
                      ) : (
                        // Tampilan Konsep Automata / Algoritma
                        <>
                          <div className="space-y-4">
                            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {activeTerm.term[lang]}
                            </h2>
                            {activeTerm.notation && (
                              <div className={`inline-block px-4 py-2 rounded-xl border text-sm sm:text-base font-bold font-mono tracking-wider shadow-inner ${isDark ? 'bg-black/50 border-white/10 text-violet-300' : 'bg-slate-100 border-slate-200 text-violet-700'}`}>
                                {lang === 'id' ? 'Notasi: ' : 'Notation: '} {activeTerm.notation}
                              </div>
                            )}
                          </div>

                          <div className="space-y-5">
                            {activeTerm.definition[lang].map((paragraf, idx) => (
                              <p key={idx} className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {paragraf}
                              </p>
                            ))}
                          </div>

                          {activeTerm.example && (
                            <div className={`p-5 sm:p-6 rounded-2xl border border-l-4 ${isDark ? 'bg-amber-500/5 border-amber-500/20 border-l-amber-500' : 'bg-amber-50 border-amber-200 border-l-amber-500'}`}>
                              <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>
                                {lang === 'id' ? 'Contoh Penerapan' : 'Example Application'}
                              </h3>
                              <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-amber-200/80' : 'text-amber-900'}`}>
                                {activeTerm.example[lang]}
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Chips Istilah Terkait (Bisa di-klik) */}
                      {activeTerm.related && activeTerm.related.length > 0 && (
                        <div className={`pt-8 mt-8 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                          <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {lang === 'id' ? 'Istilah Terkait' : 'Related Terms'}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {activeTerm.related.map(relId => {
                              const relItem = GLOSSARY_DATA.find(t => t.id === relId);
                              if (!relItem) return null;
                              return (
                                <button
                                  key={relId} onClick={() => selectTerm(relId)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-violet-600 hover:text-white hover:border-violet-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 shadow-sm'}`}
                                >
                                  {relItem.term[lang]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40">
                  <BookText className={`w-24 h-24 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {lang === 'id' ? 'Jelajahi Ensiklopedia' : 'Explore the Encyclopedia'}
                  </h3>
                  <p className={`text-center max-w-sm text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'id' ? 'Pilih istilah dari panel kiri atau gunakan kotak pencarian untuk memulai eksplorasi dunia Automata.' : 'Select a term from the left panel or use the search box to start exploring.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};