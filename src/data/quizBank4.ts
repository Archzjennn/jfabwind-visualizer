import type { QuizQuestion } from './quizBank1';

export const quizBankGroup4: QuizQuestion[] = [
  // --- LEVEL 51: Konsep Dasar Subset Construction ---
  { id: "q251", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Pada algoritma Subset Construction, apa yang diwakili oleh sebuah state baru pada DFA?", en: "In Subset Construction algorithm, what represents a new state in DFA?" }, 
    options: { id: ["Himpunan (subset) dari state-state NFA", "String acak hasil tes", "Satu state NFA tunggal", "Alfabet transisi baru"], en: ["A set (subset) of NFA states", "Random test string", "A single NFA state", "New transition alphabet"] }, 
    correctIdx: 0, explanation: { id: "DFA melacak himpunan (subset) dari state NFA yang bisa dicapai secara bersamaan saat memproses input.", en: "DFA tracks sets (subsets) of NFA states that can be reached simultaneously when processing input." }, type: "text" },
  { id: "q252", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Jika sebuah NFA memiliki N state, berapakah batas atas (maksimal) jumlah state DFA yang dihasilkan dari Subset Construction?", en: "If an NFA has N states, what is the upper bound (maximum) number of DFA states generated from Subset Construction?" }, 
    options: { id: ["2 * N", "N * N", "2 pangkat N (2^N)", "N faktorial (N!)"], en: ["2 * N", "N * N", "2 to the power of N (2^N)", "N factorial (N!)"] }, 
    correctIdx: 2, explanation: { id: "DFA dibentuk dari kombinasi *powerset* state NFA. Jumlah total himpunan bagian dari N elemen adalah 2^N.", en: "DFA is formed by the powerset combinations of NFA states. Total subsets of N elements is 2^N." }, type: "text" },
  { id: "q253", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Apa tujuan utama dari algoritma Subset Construction?", en: "What is the primary purpose of the Subset Construction algorithm?" }, 
    options: { id: ["Memperkecil memori mesin", "Menghilangkan epsilon dan multi-cabang (NFA) menjadi rute tunggal deterministik (DFA)", "Merubah bahasa automata", "Menemukan Dead State"], en: ["Minimize machine memory", "Remove epsilon and multi-branches (NFA) into single deterministic routes (DFA)", "Change the automata language", "Find Dead State"] }, 
    correctIdx: 1, explanation: { id: "Algoritma ini membungkus ketidakpastian NFA menjadi kepastian DFA tanpa mengubah bahasa yang diterima.", en: "This algorithm wraps NFA uncertainties into DFA certainties without altering the accepted language." }, type: "text" },
  { id: "q254", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Bagaimana cara menentukan Start State (q0) dari DFA hasil konstruksi?", en: "How to determine the Start State (q0) of the constructed DFA?" }, 
    options: { id: ["Start state NFA itu sendiri", "ε-closure dari Start State NFA", "Semua state NFA digabung", "State pertama yang diklik"], en: ["The NFA Start state itself", "The ε-closure of the NFA Start State", "All NFA states combined", "The first state clicked"] }, 
    correctIdx: 1, explanation: { id: "Start DFA adalah posisi awal NFA ditambah jangkauan gratis (epsilon) yang bisa dicapai sebelum membaca input.", en: "DFA start is the NFA start position plus free (epsilon) reach before reading input." }, type: "text" },
  { id: "q255", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Kapan sebuah subset state pada DFA baru dinyatakan sebagai Final State?", en: "When is a state subset in the new DFA declared as a Final State?" }, 
    options: { id: ["Jika ukurannya lebih dari 1", "Jika mengandung HANYA Final State NFA", "Jika mengandung MINIMAL SATU Final State dari NFA asal", "Jika merupakan subset kosong"], en: ["If its size is > 1", "If it contains ONLY NFA Final States", "If it contains AT LEAST ONE Final State from the original NFA", "If it is an empty subset"] }, 
    correctIdx: 2, explanation: { id: "Aturan NFA: 'satu jalur sukses = sukses'. Jika subset DFA memuat 1 saja state sukses NFA, DFA itu ikut sukses.", en: "NFA rule: 'one successful path = success'. If a DFA subset contains even 1 NFA success state, it succeeds." }, type: "text" },

  // --- LEVEL 52: Operasi Move & Epsilon Closure ---
  { id: "q256", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Dalam proses konversi, rumus umum mencari transisi state DFA baru `A` dengan input `a` adalah?", en: "In the conversion process, the general formula to find a new DFA state `A` transition with input `a` is?" }, 
    options: { id: ["move(A, a)", "ε-closure(move(A, a))", "move(ε-closure(A), a)", "ε-closure(A) + a"], en: ["move(A, a)", "ε-closure(move(A, a))", "move(ε-closure(A), a)", "ε-closure(A) + a"] }, 
    correctIdx: 1, explanation: { id: "1. Geser ke target via 'a' (move). 2. Lebarkan sayap gratisan via epsilon (ε-closure).", en: "1. Shift to target via 'a' (move). 2. Expand free reach via epsilon (ε-closure)." }, type: "text" },
  { id: "q257", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Jika hasil evaluasi transisi sebuah Subset tidak memetakan ke state manapun (KOSONG), apa yang harus dilakukan DFA?", en: "If a Subset's transition evaluation maps to no state (EMPTY), what must the DFA do?" }, 
    options: { id: ["Panah tidak digambar", "Program error", "Arahkan panah ke Start State", "Buat Dead State (state himpunan kosong ∅) dan arahkan panah ke sana"], en: ["Do not draw arrow", "Program error", "Point arrow to Start State", "Create a Dead State (empty set ∅ state) and point the arrow there"] }, 
    correctIdx: 3, explanation: { id: "DFA wajib punya transisi. Jika himpunan targetnya ∅, panah tetap harus ditarik ke state perangkap (Trap/Dead State).", en: "DFA strictly needs transitions. If target set is ∅, arrow must be drawn to a Trap/Dead state." }, type: "text" },
  { id: "q258", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Apa itu operasi `move(T, a)`?", en: "What is the `move(T, a)` operation?" }, 
    options: { id: ["Menggeser layar", "Himpunan semua state yang bisa dicapai dari setiap state di himpunan T menggunakan SATU panah berlabel 'a'", "Transisi Epsilon", "Menghapus himpunan T"], en: ["Pan the screen", "Set of all states reachable from every state in set T using ONE arrow labeled 'a'", "Epsilon transition", "Delete set T"] }, 
    correctIdx: 1, explanation: { id: "Fungsi *move* mengeksekusi tepat 1 simbol input untuk sekelompok state.", en: "The *move* function executes exactly 1 input symbol for a group of states." }, type: "text" },
  { id: "q259", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Apakah algoritma Subset Construction bekerja meskipun NFA TIDAK memiliki transisi Epsilon?", en: "Does Subset Construction work even if the NFA has NO Epsilon transitions?" }, 
    options: { id: ["Tidak bisa", "Bisa, ε-closure sebuah state cukup mengembalikan state itu sendiri", "Bisa, tapi hasilnya NFA", "Akan error"], en: ["Cannot", "Yes, ε-closure of a state simply returns itself", "Yes, but results in NFA", "Will error"] }, 
    correctIdx: 1, explanation: { id: "Jika tidak ada Epsilon, algoritma ini secara *default* akan melebur rute kembar saja.", en: "If no Epsilon, this algorithm defaults to merging only twin routes." }, type: "text" },
  { id: "q260", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Berapa kali kita harus menghitung `ε-closure(move(A, symbol))` saat mengonversi NFA ke DFA?", en: "How many times must we compute `ε-closure(move(A, symbol))` when converting NFA to DFA?" }, 
    options: { id: ["Hanya sekali untuk Start", "Untuk setiap simbol input (Σ) dari SEMUA Subset baru yang ditemukan", "Hanya untuk state final", "Tak terhingga"], en: ["Only once for Start", "For every input symbol (Σ) from ALL newly discovered Subsets", "Only for final states", "Infinite"] }, 
    correctIdx: 1, explanation: { id: "Algoritma ini bersifat *breadth-first search*, kita iterasi terus sampai tidak ada kombinasi subset baru.", en: "It's a breadth-first search, iterating until no new subset combinations appear." }, type: "text" },

  // --- LEVEL 53: Analisis Kasus NFA Bercabang ---
  { id: "q261", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "NFA punya transisi: q0 --a--> q1, dan q0 --a--> q2. Jika dikonversi ke DFA, apa nama state target untuk input 'a' dari q0?", en: "NFA has transitions: q0 --a--> q1, and q0 --a--> q2. If converted to DFA, what is the target state name for input 'a' from q0?" }, 
    options: { id: ["q1", "q2", "State baru bernama {q1, q2}", "Error DFA"], en: ["q1", "q2", "A new state named {q1, q2}", "DFA error"] }, 
    correctIdx: 2, explanation: { id: "Ketidakpastian q1 atau q2 dibungkus utuh menjadi 1 state tunggal DFA: {q1, q2}.", en: "Uncertainty of q1 or q2 is bundled intact into 1 single DFA state: {q1, q2}." }, type: "text" },
  { id: "q262", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "NFA punya state q1 dan q2. Transisinya: q1 --b--> q3, dan q2 --b--> q3. Jika Subset DFA adalah A={q1, q2}, kemanakah arah transisi 'b' dari A?", en: "NFA has q1 and q2. Transitions: q1 --b--> q3, and q2 --b--> q3. If DFA Subset is A={q1, q2}, where does 'b' transition from A go?" }, 
    options: { id: ["State baru {q3, q3}", "State tunggal {q3}", "State {q1, q2, q3}", "State jebakan"], en: ["New state {q3, q3}", "Single state {q3}", "State {q1, q2, q3}", "Trap state"] }, 
    correctIdx: 1, explanation: { id: "Karena hasil himpunan (*set*) tidak mencatat elemen ganda, {q3, q3} otomatis menjadi {q3}.", en: "Since Sets don't record duplicate elements, {q3, q3} automatically becomes {q3}." }, type: "text" },
  { id: "q263", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Jika NFA memiliki transisi q0 --a--> q0 (loop). Berapakah jumlah state Subset DFA yang terbentuk jika hanya ada panah tersebut?", en: "If NFA has transition q0 --a--> q0 (loop). How many DFA Subset states are formed if only that arrow exists?" }, 
    options: { id: ["0", "1 (yaitu {q0})", "2", "3"], en: ["0", "1 (namely {q0})", "2", "3"] }, 
    correctIdx: 1, explanation: { id: "Looping tidak menciptakan rute baru, ia hanya me-*return* set {q0} yang sudah ada.", en: "Looping doesn't create new routes, it just returns the existing {q0} set." }, type: "text" },
  { id: "q264", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Pada NFA, Final State adalah qF. DFA hasil konversi menghasilkan Subset {q0, qF}, {q1, qF}, dan {q2}. Mana yang merupakan Final State pada DFA?", en: "In NFA, Final State is qF. Converted DFA yields Subsets {q0, qF}, {q1, qF}, and {q2}. Which are Final States in DFA?" }, 
    options: { id: ["Hanya {q2}", "{q0, qF} dan {q1, qF}", "Tidak ada", "Semuanya"], en: ["Only {q2}", "{q0, qF} and {q1, qF}", "None", "All of them"] }, 
    correctIdx: 1, explanation: { id: "Subset mana pun yang kejatuhan 'cipratan' state qF langsung diangkat menjadi Final State.", en: "Any subset sprinkled with state qF is instantly elevated to a Final State." }, type: "text" },
  { id: "q265", level_group: 4, difficulty: "sulit", category: "subset", 
    question: { id: "Kelemahan praktis dari metode Subset Construction yang sering terjadi pada mesin NFA kompleks adalah?", en: "A practical weakness of the Subset Construction method that often occurs in complex NFAs is?" }, 
    options: { id: ["Menghasilkan bahasa yang salah", "DFA tidak bisa mengeksekusi string", "Terjadinya State Explosion (ledakan jumlah state yang sangat masif)", "Transisi epsilon tidak hilang"], en: ["Generates wrong language", "DFA cannot execute strings", "State Explosion occurs (massive blowout of state count)", "Epsilon transitions don't disappear"] }, 
    correctIdx: 2, explanation: { id: "Secara teori 2^N, konversi regex panjang bisa menghasilkan ribuan state DFA yang menghabiskan memori RAM.", en: "With theoretical 2^N, long regex conversions can spawn thousands of DFA states draining RAM." }, type: "text" },

  // --- LEVEL 54: Simulasi Langkah Visual ---
  { 
    id: "q266", level_group: 4, difficulty: "sulit", category: "subset_visual", 
    question: { 
      id: "Simulasikan langkah awal Subset DFA. Apa Start State DFA dari Graf NFA di atas?", 
      en: "Simulate the first DFA Subset step. What is the DFA Start State from the NFA Graph above?" 
    }, 
    options: { id: ["{q0}", "{q0, q1}", "{q0, q1, q2}", "{q0, q2}"], en: ["{q0}", "{q0, q1}", "{q0, q1, q2}", "{q0, q2}"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Start DFA = ε-closure(q0). Dari q0 ada jembatan epsilon ke q1 dan q2. Himpunannya adalah {q0, q1, q2}.", 
      en: "DFA Start = ε-closure(q0). From q0 there are epsilon bridges to q1 and q2. Set is {q0, q1, q2}." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2", "q3"], startState: "q0", acceptStates: ["q3"], alphabet: ["a", "b", "ε"],
      transitions: [ { from: "q0", to: "q1", symbol: "ε" }, { from: "q0", to: "q2", symbol: "ε" }, { from: "q1", to: "q3", symbol: "a" }, { from: "q2", to: "q3", symbol: "b" } ]
    }
  },
  { 
    id: "q267", level_group: 4, difficulty: "sulit", category: "subset_visual", 
    question: { 
      id: "Jika state DFA saat ini adalah A = {q0, q1}. Berapa hasil move(A, 'a') dari graf di atas?", 
      en: "If current DFA state is A = {q0, q1}. What is the result of move(A, 'a') from the graph above?" 
    }, 
    options: { id: ["{q0}", "{q1}", "{q2}", "{q1, q2}"], en: ["{q0}", "{q1}", "{q2}", "{q1, q2}"] }, 
    correctIdx: 3, 
    explanation: { 
      id: "Dari elemen q0, input 'a' menuju q1. Dari elemen q1, input 'a' menuju q2. Gabungannya adalah {q1, q2}.", 
      en: "From element q0, input 'a' goes to q1. From q1, input 'a' goes to q2. Union is {q1, q2}." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["a"],
      transitions: [ { from: "q0", to: "q1", symbol: "a" }, { from: "q1", to: "q2", symbol: "a" } ]
    }
  },
  { 
    id: "q268", level_group: 4, difficulty: "sulit", category: "subset_visual", 
    question: { 
      id: "NFA ini untuk (0|1)*00. State q0 bercabang untuk input '0'. Jika DFA dievaluasi untuk input '0' dari Start {q0}, target state barunya adalah?", 
      en: "This NFA is for (0|1)*00. State q0 branches for input '0'. If DFA evaluates input '0' from Start {q0}, what's the new target state?" 
    }, 
    options: { id: ["{q0}", "{q1}", "{q0, q1}", "{q2}"], en: ["{q0}", "{q1}", "{q0, q1}", "{q2}"] }, 
    correctIdx: 2, 
    explanation: { 
      id: "Dari q0 dengan input '0', mesin bisa looping di q0 ATAU pindah ke q1. Subset yang menyerap semua rute ini adalah {q0, q1}.", 
      en: "From q0 with input '0', machine loops at q0 OR moves to q1. The subset absorbing all routes is {q0, q1}." 
    }, 
    type: "visual_nfa", 
    dfa: {
      states: ["q0", "q1", "q2"], startState: "q0", acceptStates: ["q2"], alphabet: ["0", "1"],
      transitions: [ { from: "q0", to: "q0", symbol: "0" }, { from: "q0", to: "q0", symbol: "1" }, { from: "q0", to: "q1", symbol: "0" }, { from: "q1", to: "q2", symbol: "0" } ]
    }
  }
];