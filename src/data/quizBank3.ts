import type { QuizQuestion } from './quizBank1';

export const quizBankGroup3: QuizQuestion[] = [
  // --- LEVEL 31: Visualisasi & Evaluasi Dasar NFA ---
  { 
    id: "q151", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "Berdasarkan graf NFA di atas, apakah string 'ab' diterima oleh mesin?", 
      en: "Based on the NFA graph above, is the string 'ab' accepted by the machine?" 
    }, 
    options: { 
      id: ["Ya, diterima", "Tidak, ditolak", "Error sytax", "Mesin akan hang"], 
      en: ["Yes, accepted", "No, rejected", "Syntax error", "Machine will hang"] 
    }, 
    correctIdx: 0, 
    explanation: { 
      id: "String 'ab' melaju dari q0 ke q1 (via 'a'), lalu q1 ke q2 (via 'b') yang merupakan Final State.", 
      en: "String 'ab' moves from q0 to q1 (via 'a'), then q1 to q2 (via 'b') which is a Final State." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a", "b"],
      transitions: [ { from: "q0", to: "q1", symbol: "a" }, { from: "q1", to: "q2", symbol: "b" } ]
    }
  },
  { 
    id: "q152", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "Perhatikan graf NFA di atas. Berapa banyak rute keluar untuk input '0' dari state q0?", 
      en: "Observe the NFA graph above. How many outgoing routes for input '0' exist from state q0?" 
    }, 
    options: { id: ["0", "1", "2", "3"], en: ["0", "1", "2", "3"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Terdapat dua rute dari q0 untuk input '0': satu kembali ke q0, satu lagi menuju q1. Ini adalah sifat Non-Deterministik.", 
      en: "There are two routes from q0 for input '0': one looping back to q0, another going to q1. This is the Non-Deterministic property." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["0", "1"],
      transitions: [ { from: "q0", to: "q0", symbol: "0" }, { from: "q0", to: "q1", symbol: "0" }, { from: "q1", to: "q2", symbol: "1" } ]
    }
  },
  { 
    id: "q153", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "String manakah yang DITOLAK oleh graf NFA di atas?", 
      en: "Which string is REJECTED by the NFA graph above?" 
    }, 
    options: { id: ["01", "0001", "0", "001"], en: ["01", "0001", "0", "001"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Mesin ini mengenali pola '0*01'. Harus diakhiri dengan '1' untuk mencapai q2. String '0' akan tertahan di q0 atau q1.", 
      en: "This machine recognizes '0*01'. Must end with '1' to reach q2. String '0' gets stuck in q0 or q1." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["0", "1"],
      transitions: [ { from: "q0", to: "q0", symbol: "0" }, { from: "q0", to: "q1", symbol: "0" }, { from: "q1", to: "q2", symbol: "1" } ]
    }
  },
  { 
    id: "q154", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "Apakah Graf di atas termasuk DFA atau NFA?", 
      en: "Is the Graph above a DFA or NFA?" 
    }, 
    options: { id: ["DFA, karena tidak ada Epsilon", "DFA, karena rutenya jelas", "NFA, karena ada transisi Epsilon (ε)", "NFA, karena bentuknya lurus"], en: ["DFA, because there is no Epsilon", "DFA, because the route is clear", "NFA, because there is an Epsilon (ε) transition", "NFA, because the shape is straight"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Kehadiran transisi Epsilon (ε) secara otomatis mengklasifikasikan automata tersebut sebagai NFA.", 
      en: "The presence of an Epsilon (ε) transition automatically classifies the automaton as an NFA." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1"], startState: "q0", acceptStates: ["q1"], alphabet: ["a", "ε"],
      transitions: [ { from: "q0", to: "q1", symbol: "ε" } ]
    }
  },
  { 
    id: "q155", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "Jika diinputkan string kosong (Epsilon), apakah NFA di atas akan menerimanya?", 
      en: "If an empty string (Epsilon) is input, will the NFA above accept it?" 
    }, 
    options: { id: ["Ya, karena bisa melompat via Epsilon ke Final State", "Tidak, karena input kosong ditolak", "Tergantung alfabet", "Mesin error"], en: ["Yes, because it can jump via Epsilon to Final State", "No, because empty input is rejected", "Depends on alphabet", "Machine error"] }, 
    correctIdx: 0, 
    explanation: { 
      id: "Mesin berada di q0, dan tanpa membaca input apa pun, ia bisa meluncur via transisi ε ke q1 (Final).", 
      en: "Machine is at q0, and without reading any input, it can slide via ε transition to q1 (Final)." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1"], startState: "q0", acceptStates: ["q1"], alphabet: ["a", "ε"],
      transitions: [ { from: "q0", to: "q1", symbol: "ε" } ]
    }
  },

  // --- LEVEL 32: Memahami Epsilon-Closure ---
  { 
    id: "q156", level_group: 3, difficulty: "sedang", category: "epsilon_closure", 
    question: { id: "Apa definisi dari ε-closure(q)?", en: "What is the definition of ε-closure(q)?" }, 
    options: { id: ["Himpunan state yang dituju dengan 1 karakter", "Himpunan state yang dapat dicapai dari state q HANYA dengan melalui transisi ε", "Himpunan semua Final State", "State jebakan"], en: ["Set of states reached with 1 character", "Set of states reachable from state q ONLY through ε transitions", "Set of all Final States", "Trap states"] }, 
    correctIdx: 1, explanation: { id: "Epsilon closure mencari tahu sejauh mana state bisa 'merambat' secara gratis.", en: "Epsilon closure finds out how far a state can 'propagate' for free." }, type: "text" },
  { 
    id: "q157", level_group: 3, difficulty: "sedang", category: "epsilon_closure", 
    question: { id: "Apakah state q itu sendiri SELALU termasuk di dalam hasil ε-closure(q)?", en: "Is state q itself ALWAYS included in the result of ε-closure(q)?" }, 
    options: { id: ["Ya, selalu", "Tidak pernah", "Tergantung apakah q adalah Start State", "Hanya jika q Final State"], en: ["Yes, always", "Never", "Depends if q is Start State", "Only if q is Final State"] }, 
    correctIdx: 0, explanation: { id: "Secara definisi matematis, state q dapat mencapai dirinya sendiri dengan menempuh 0 transisi epsilon.", en: "By mathematical definition, state q can reach itself by taking 0 epsilon transitions." }, type: "text" },
  { 
    id: "q158", level_group: 3, difficulty: "sedang", category: "epsilon_closure", 
    question: { 
      id: "Berdasarkan graf di atas, apa hasil dari ε-closure(q0)?", 
      en: "Based on the graph above, what is the result of ε-closure(q0)?" 
    }, 
    options: { id: ["{q0}", "{q1}", "{q0, q1}", "{q0, q1, q2}"], en: ["{q0}", "{q1}", "{q0, q1}", "{q0, q1, q2}"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Dari q0, ada jalur ε ke q1. Tidak ada jalur ε lanjutan dari q1 ke q2. Jadi himpunannya {q0, q1}.", 
      en: "From q0, there is an ε path to q1. No further ε path from q1 to q2. So the set is {q0, q1}." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a", "ε"],
      transitions: [ { from: "q0", to: "q1", symbol: "ε" }, { from: "q1", to: "q2", symbol: "a" } ]
    }
  },
  { 
    id: "q159", level_group: 3, difficulty: "sedang", category: "epsilon_closure", 
    question: { 
      id: "Lihat graf di atas. Apa hasil dari ε-closure(q1)?", 
      en: "Look at the graph above. What is the result of ε-closure(q1)?" 
    }, 
    options: { id: ["{q1}", "{q1, q2}", "{q0, q1}", "{q0, q1, q2}"], en: ["{q1}", "{q1, q2}", "{q0, q1}", "{q0, q1, q2}"] }, 
    correctIdx: 0, 
    explanation: { 
      id: "Dari q1 tidak ada panah keluar berlabel ε. Maka penelusuran gratis tidak ada, hanya berisi dirinya sendiri {q1}.", 
      en: "From q1 there are no outgoing arrows labeled ε. Thus no free traversal, it only contains itself {q1}." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a", "ε"],
      transitions: [ { from: "q0", to: "q1", symbol: "ε" }, { from: "q1", to: "q2", symbol: "a" } ]
    }
  },
  { 
    id: "q160", level_group: 3, difficulty: "sedang", category: "epsilon_closure", 
    question: { 
      id: "Berdasarkan rantai transisi Epsilon di atas, berapakah ε-closure(q0)?", 
      en: "Based on the Epsilon transition chain above, what is ε-closure(q0)?" 
    }, 
    options: { id: ["{q0}", "{q0, q1}", "{q1, q2, q3}", "{q0, q1, q2, q3}"], en: ["{q0}", "{q0, q1}", "{q1, q2, q3}", "{q0, q1, q2, q3}"] }, 
    correctIdx: 3, 
    explanation: { 
      id: "Rantai epsilon merambat terus. q0 bisa mencapai q1, q1 lanjut ke q2, q2 lanjut ke q3. Semuanya gratis.", 
      en: "Epsilon chain propagates. q0 reaches q1, q1 continues to q2, q2 to q3. All for free." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2", "q3"], startState: "q0", acceptStates: ["q3"], alphabet: ["ε"],
      transitions: [ { from: "q0", to: "q1", symbol: "ε" }, { from: "q1", to: "q2", symbol: "ε" }, { from: "q2", to: "q3", symbol: "ε" } ]
    }
  },

  // --- LEVEL 33: Thompson's Construction (Base & Concat) ---
  { 
    id: "q161", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { id: "Algoritma Konstruksi Thompson mengubah apa menjadi apa?", en: "Thompson's Construction algorithm converts what to what?" }, 
    options: { id: ["DFA menjadi NFA", "Regex menjadi NFA", "NFA menjadi Regex", "DFA menjadi Regex"], en: ["DFA to NFA", "Regex to NFA", "NFA to Regex", "DFA to Regex"] }, 
    correctIdx: 1, explanation: { id: "Thompson adalah metode modular menyusun kotak-kotak kecil NFA dari teks Regex.", en: "Thompson is a modular method arranging small NFA boxes from Regex text." }, type: "text" },
  { 
    id: "q162", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { 
      id: "Gambar di atas adalah template Thompson untuk operasi regex apa?", 
      en: "The graph above is the Thompson template for what regex operation?" 
    }, 
    options: { id: ["Union (a|b)", "Concatenation (ab)", "Kleene Star (a*)", "Base Symbol (a)"], en: ["Union (a|b)", "Concatenation (ab)", "Kleene Star (a*)", "Base Symbol (a)"] }, 
    correctIdx: 3, 
    explanation: { 
      id: "Ini adalah bentuk paling dasar. 2 State dihubungkan dengan 1 panah berlabel simbol dasar 'a'.", 
      en: "This is the most basic form. 2 States connected by 1 arrow labeled with the basic symbol 'a'." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1"], startState: "q0", acceptStates: ["q1"], alphabet: ["a"],
      transitions: [ { from: "q0", to: "q1", symbol: "a" } ]
    }
  },
  { 
    id: "q163", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { 
      id: "Graf di atas adalah template Thompson untuk 'Concatenation' (Penggabungan ab). Bagaimana proses penggabungannya?", 
      en: "The graph above is the Thompson template for 'Concatenation' (ab). How is the concatenation processed?" 
    }, 
    options: { id: ["Dihubungkan dengan panah Epsilon", "Final state mesin 'a' dilebur menyatu dengan Start state mesin 'b'", "Ditaruh bersebelahan tanpa disentuh", "Dihubungkan panah berlabel a"], en: ["Connected with an Epsilon arrow", "Final state of machine 'a' is merged directly into Start state of machine 'b'", "Placed side by side untouched", "Connected by arrow labeled a"] }, 
    correctIdx: 1, 
    explanation: { 
      id: "Dalam penggabungan berurutan, state perantara digabung (merged) untuk efisiensi.", 
      en: "In sequential concatenation, the intermediate state is merged for efficiency." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a", "b"],
      transitions: [ { from: "q0", to: "q1", symbol: "a" }, { from: "q1", to: "q2", symbol: "b" } ]
    }
  },
  { 
    id: "q164", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { id: "Berapa banyak jumlah state yang dihasilkan oleh Thompson's Construction untuk regex satu karakter 'a'?", en: "How many states are generated by Thompson's Construction for a single-character regex 'a'?" }, 
    options: { id: ["1", "2", "3", "4"], en: ["1", "2", "3", "4"] }, 
    correctIdx: 1, explanation: { id: "Selalu menghasilkan sepasang state: 1 start dan 1 final.", en: "Always generates a pair of states: 1 start and 1 final." }, type: "text" },
  { 
    id: "q165", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { id: "Dalam algoritma Thompson, setiap pecahan sub-mesin NFA menjamin hanya memiliki?", en: "In Thompson's algorithm, every fractional NFA sub-machine guarantees having only?" }, 
    options: { id: ["1 Final State", "Banyak Final State", "Tidak ada Start State", "Tidak ada Epsilon"], en: ["1 Final State", "Many Final States", "No Start State", "No Epsilon"] }, 
    correctIdx: 0, explanation: { id: "Desain modular Thompson memastikan tiap blok hanya memiliki tepat 1 pintu masuk (Start) dan 1 pintu keluar (Final).", en: "Thompson's modular design ensures each block has exactly 1 entry (Start) and 1 exit (Final)." }, type: "text" },

  // --- LEVEL 34: Thompson's Construction (Union & Star) ---
  { 
    id: "q166", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { 
      id: "Perhatikan struktur NFA di atas. Template ini digunakan Thompson untuk merepresentasikan operasi apa?", 
      en: "Observe the NFA structure above. This template is used by Thompson to represent what operation?" 
    }, 
    options: { id: ["Kleene Star (a*)", "Union (a|b)", "Concatenation (ab)", "Plus (a+)"], en: ["Kleene Star (a*)", "Union (a|b)", "Concatenation (ab)", "Plus (a+)"] }, 
    correctIdx: 1, 
    explanation: { 
      id: "Struktur percabangan paralel atas-bawah menggunakan 4 panah epsilon baru adalah ciri khas operasi pilihan (Union).", 
      en: "The top-bottom parallel branching structure using 4 new epsilon arrows is the hallmark of the Alternation (Union) operation." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2", "q3", "q4", "q5"], startState: "q0", acceptStates: ["q5"], alphabet: ["a", "b", "ε"],
      transitions: [ 
        { from: "q0", to: "q1", symbol: "ε" }, { from: "q0", to: "q3", symbol: "ε" },
        { from: "q1", to: "q2", symbol: "a" }, { from: "q3", to: "q4", symbol: "b" },
        { from: "q2", to: "q5", symbol: "ε" }, { from: "q4", to: "q5", symbol: "ε" }
      ]
    }
  },
  { 
    id: "q167", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { 
      id: "Perhatikan struktur rumit di atas. Ini adalah bentuk NFA untuk operasi Kleene Star (a*). Apa fungsi panah Epsilon yang melengkung dari Start langsung ke Final?", 
      en: "Observe the complex structure above. This is the NFA for Kleene Star (a*). What is the function of the looping Epsilon arrow going directly from Start to Final?" 
    }, 
    options: { id: ["Mengulangi input tanpa henti", "Mengizinkan mesin untuk melewati 'a' sepenuhnya (menerima string kosong ε)", "Mempercepat proses", "Menghapus memori"], en: ["Repeat input endlessly", "Allow the machine to skip 'a' completely (accept empty string ε)", "Speed up process", "Clear memory"] }, 
    correctIdx: 1, 
    explanation: { 
      id: "Panah jalan tol tersebut adalah jembatan *Bypass* untuk mengakomodasi sifat 0-perulangan pada Kleene Star.", 
      en: "That highway arrow is a Bypass bridge to accommodate the 0-repetition nature of Kleene Star." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2", "q3"], startState: "q0", acceptStates: ["q3"], alphabet: ["a", "ε"],
      transitions: [ 
        { from: "q0", to: "q1", symbol: "ε" }, { from: "q0", to: "q3", symbol: "ε" }, // Bypass
        { from: "q1", to: "q2", symbol: "a" }, 
        { from: "q2", to: "q1", symbol: "ε" }, // Looping back
        { from: "q2", to: "q3", symbol: "ε" }
      ]
    }
  },
  { 
    id: "q168", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { id: "Pada operasi Union (a|b) versi Thompson, berapa jumlah state tambahan baru yang diciptakan untuk membungkus mesin a dan b?", en: "In the Thompson version of the Union (a|b) operation, how many new additional states are created to wrap machines a and b?" }, 
    options: { id: ["0", "1", "2", "4"], en: ["0", "1", "2", "4"] }, 
    correctIdx: 2, explanation: { id: "Dibutuhkan 1 Start State baru di depan (untuk memecah cabang) dan 1 Final State baru di belakang (untuk menyatukan cabang). Total 2 state.", en: "Requires 1 new Start State in front (to branch) and 1 new Final State at the back (to unite branches). Total 2 states." }, type: "text" },
  { 
    id: "q169", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { id: "Mengapa algoritma Thompson sangat diandalkan meskipun menghasilkan banyak Epsilon?", en: "Why is Thompson's algorithm highly relied upon despite generating many Epsilons?" }, 
    options: { id: ["Lebih cepat dijalankan komputer", "Bisa diproses secara linear tanpa perlu berpikir mundur (Mudah dikodekan secara modular)", "Menghasilkan state yang paling sedikit", "DFA tidak bisa dibuat dari regex"], en: ["Faster for computer execution", "Can be processed linearly without backtracking (Easy to code modularly)", "Generates the fewest states", "DFA cannot be built from regex"] }, 
    correctIdx: 1, explanation: { id: "Algoritma ini sangat sistematis dan rekursif, cocok untuk diimplementasikan ke dalam program compiler.", en: "The algorithm is highly systematic and recursive, perfect for compiler implementation." }, type: "text" },
  { 
    id: "q170", level_group: 3, difficulty: "sedang", category: "thompson", 
    question: { id: "Jika regex R memiliki ukuran teks sepanjang N karakter, berapa estimasi batas atas state NFA hasil konstruksi Thompson?", en: "If regex R has a text size of N characters, what is the estimated upper bound of NFA states produced by Thompson?" }, 
    options: { id: ["Maksimal N state", "Maksimal 2N state", "Maksimal N pangkat 2 state", "Tak hingga"], en: ["Max N states", "Max 2N states", "Max N squared states", "Infinite"] }, 
    correctIdx: 1, explanation: { id: "Karena setiap operasi menambah maksimal 2 state, ukuran NFA membesar secara linear (maks 2x panjang string Regex).", en: "Since each operation adds max 2 states, NFA size grows linearly (max 2x Regex string length)." }, type: "text" },

  // --- LEVEL 35: Analisis Graf Campuran ---
  { 
    id: "q171", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "Automata di atas adalah NFA karena mengizinkan apa?", 
      en: "The automaton above is an NFA because it allows what?" 
    }, 
    options: { id: ["Bentuk grafiknya melengkung", "State q0 memiliki dua transisi keluar untuk simbol yang sama ('a')", "Ada final state", "Alfabetnya hanya satu"], en: ["Graph shape is curved", "State q0 has two outgoing transitions for the same symbol ('a')", "Has a final state", "Alphabet is only one"] }, 
    correctIdx: 1, 
    explanation: { 
      id: "Simbol 'a' dari q0 bercabang ke dirinya sendiri DAN ke q1. Hal ini dilarang keras di DFA.", 
      en: "Symbol 'a' from q0 branches to itself AND to q1. This is strictly prohibited in DFA." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a", "b"],
      transitions: [ { from: "q0", to: "q0", symbol: "a" }, { from: "q0", to: "q1", symbol: "a" }, { from: "q1", to: "q2", symbol: "b" } ]
    }
  },
  { 
    id: "q172", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { 
      id: "String manakah yang DITERIMA oleh NFA di atas?", 
      en: "Which string is ACCEPTED by the NFA above?" 
    }, 
    options: { id: ["a", "ab", "aab", "aba"], en: ["a", "ab", "aab", "aba"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Membaca 'a' pertama mutar di q0. Membaca 'a' kedua geser ke q1. Membaca 'b' geser ke q2 (sukses).", 
      en: "Reading first 'a' loops at q0. Reading second 'a' shifts to q1. Reading 'b' shifts to q2 (success)." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a", "b"],
      transitions: [ { from: "q0", to: "q0", symbol: "a" }, { from: "q0", to: "q1", symbol: "a" }, { from: "q1", to: "q2", symbol: "b" } ]
    }
  },
  { 
    id: "q173", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { id: "Mana sifat yang benar dari sebuah NFA?", en: "Which property is true for an NFA?" }, 
    options: { id: ["Jika satu cabang ditolak, seluruh proses dianggap gagal", "Jika MINIMAL SATU cabang berhasil mencapai Final State, string Diterima", "Harus mensimulasikan semua alfabet", "Tidak bisa diprogram dengan komputer"], en: ["If one branch is rejected, whole process fails", "If AT LEAST ONE branch successfully reaches Final State, string is Accepted", "Must simulate all alphabets", "Cannot be programmed on computer"] }, 
    correctIdx: 1, explanation: { id: "Filosofi NFA: Asal ada satu jalan menuju kebenaran, ia dianggap sah.", en: "NFA Philosophy: As long as there is one path to truth, it is considered valid." }, type: "text" },
  { 
    id: "q174", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { id: "Jika dalam implementasi *software* NFA tidak menggunakan tebakan magis, struktur data apa yang dipakai program untuk melacak cabang paralel NFA?", en: "If in software implementation NFA doesn't use magic guesses, what data structure does the program use to track NFA's parallel branches?" }, 
    options: { id: ["Array List / Set / Queue", "Integer tunggal", "Gambar SVG", "Database SQL"], en: ["Array List / Set / Queue", "Single Integer", "SVG Image", "SQL Database"] }, 
    correctIdx: 0, explanation: { id: "Komputer mensimulasikan NFA dengan menyimpan Himpunan State (Set) yang aktif lalu memprosesnya secara iteratif.", en: "Computers simulate NFA by keeping an active Set of States and processing them iteratively." }, type: "text" },
  { 
    id: "q175", level_group: 3, difficulty: "sedang", category: "nfa_eval", 
    question: { id: "Berdasarkan Thompson, apakah setiap state di NFA hasil generate (selain start/final murni) pasti memiliki maksimal berapa transisi keluar?", en: "Based on Thompson, every state in the generated NFA (except pure start/final) is guaranteed to have a maximum of how many outgoing transitions?" }, 
    options: { id: ["1", "2", "3", "Tak hingga"], en: ["1", "2", "3", "Infinite"] }, 
    correctIdx: 1, explanation: { id: "Arsitektur jembatan Thompson didesain agar cabang maksimal keluar dari sebuah state hanyalah 2 (biasanya epsilon).", en: "Thompson's bridge architecture is designed so the max branches out of a state is only 2 (usually epsilons)." }, type: "text" }
];