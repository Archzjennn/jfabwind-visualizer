import type { QuizQuestion } from './quizBank1';

export const quizBankGroup5: QuizQuestion[] = [
  { id: "q351", level_group: 5, difficulty: "sangat_sulit", category: "minimization", 
    question: { id: "Apa syarat utama dua state DFA dikatakan 'Ekuivalen' (bisa digabung)?", en: "What is the main condition for two DFA states to be considered 'Equivalent' (mergeable)?" }, 
    options: { id: ["Memiliki nama yang sama", "Memberikan respons akhir yang sama (Diterima/Ditolak) untuk semua kemungkinan string input", "Memiliki panah transisi yang sama persis", "Keduanya adalah Start State"], en: ["Have the same name", "Yield the exact same final response (Accept/Reject) for all possible input strings", "Have identical transition arrows", "Both are Start States"] }, 
    correctIdx: 1, explanation: { id: "Dua state ekuivalen jika jejak masa depannya identik.", en: "Two states are equivalent if their future footprints are identical." }, type: "text" },
  { id: "q352", level_group: 5, difficulty: "sangat_sulit", category: "minimization", 
    question: { id: "Langkah pertama algoritma Hopcroft mempartisi (membagi) state menjadi dua grup dasar, yaitu?", en: "The first step of Hopcroft's algorithm partitions states into two basic groups, which are?" }, 
    options: { id: ["Grup Ganjil dan Genap", "Grup State Awal dan State Perantara", "Grup Final State dan Non-Final State", "Grup Epsilon dan Non-Epsilon"], en: ["Odd and Even groups", "Start State and Intermediate State groups", "Final State and Non-Final State groups", "Epsilon and Non-Epsilon groups"] }, 
    correctIdx: 2, explanation: { id: "Partisi P0 memisahkan state sukses (Final) dan gagal (Non-Final).", en: "Partition P0 separates success (Final) and failure (Non-Final) states." }, type: "text" },
  { id: "q353", level_group: 5, difficulty: "sangat_sulit", category: "minimization", 
    question: { id: "Kapan partisi grup state dalam algoritma Hopcroft dihentikan?", en: "When does the state group partitioning in Hopcroft's algorithm stop?" }, 
    options: { id: ["Saat sisa 1 state", "Saat hasil partisi baru (P_n) persis sama dengan partisi sebelumnya (P_n-1)", "Saat semua state terpisah sendiri-sendiri", "Setelah 5 kali iterasi"], en: ["When 1 state remains", "When the new partition (P_n) is exactly the same as the previous (P_n-1)", "When all states are separated individually", "After 5 iterations"] }, 
    correctIdx: 1, explanation: { id: "Proses berhenti jika tidak ada lagi state yang bisa dipecah (stabil).", en: "Process stops when no more states can be split (stable)." }, type: "text" },
  { id: "q354", level_group: 5, difficulty: "sangat_sulit", category: "minimization", 
    question: { id: "Dua state q1 dan q2 berada di grup yang sama. Jika input 'a' membawa q1 ke grup A, dan q2 ke grup B. Apa yang terjadi?", en: "Two states q1 and q2 are in the same group. If input 'a' takes q1 to group A, and q2 to group B. What happens?" }, 
    options: { id: ["Keduanya digabung", "Grup dipecah karena q1 dan q2 distinguishable (dapat dibedakan)", "q1 dan q2 dihapus", "Pindah ke Dead State"], en: ["Both are merged", "Group is split because q1 and q2 are distinguishable", "q1 and q2 are deleted", "Move to Dead State"] }, 
    correctIdx: 1, explanation: { id: "Tujuan beda grup berarti karakternya beda. Mereka harus dipisah.", en: "Different target groups mean different behavior. They must be split." }, type: "text" },
  { id: "q355", level_group: 5, difficulty: "sangat_sulit", category: "minimization", 
    question: { id: "Jika dalam DFA terdapat 3 Dead State (state jebakan tak bisa keluar), apa yang terjadi saat diminimisasi?", en: "If a DFA has 3 Dead States (trap states with no exit), what happens during minimization?" }, 
    options: { id: ["Tetap 3 Dead State", "Dihapus semua", "Ketiganya akan melebur menjadi 1 Dead State tunggal", "Error"], en: ["Remains 3 Dead States", "All deleted", "All three will merge into 1 single Dead State", "Error"] }, 
    correctIdx: 2, explanation: { id: "Semua state jebakan memiliki perilaku identik, sehingga pasti melebur.", en: "All trap states have identical behavior, thus guarantee to merge." }, type: "text" }
];