import type { QuizQuestion } from './quizBank1';

export const quizBankGroup6: QuizQuestion[] = [
  { id: "q426", level_group: 6, difficulty: "expert", category: "advanced", 
    question: { id: "Pumping Lemma untuk Regular Language digunakan khusus untuk membuktikan apa?", en: "What is the Pumping Lemma for Regular Languages specifically used to prove?" }, 
    options: { id: ["Membuktikan mesin itu DFA", "Membuktikan suatu bahasa BUKAN Regular", "Mengubah NFA ke DFA", "Membuktikan bahasa itu Regular"], en: ["Prove the machine is DFA", "Prove a language is NOT Regular", "Convert NFA to DFA", "Prove the language is Regular"] }, 
    correctIdx: 1, explanation: { id: "Pumping Lemma mencari kontradiksi batas memori berhingga.", en: "Pumping Lemma finds contradictions in finite memory limits." }, type: "text" },
  { id: "q427", level_group: 6, difficulty: "expert", category: "advanced", 
    question: { id: "Mengapa Finite Automata TIDAK BISA mengenali bahasa L = { a^n b^n } (jumlah a sama dengan jumlah b)?", en: "Why can't Finite Automata recognize the language L = { a^n b^n } (amount of a equals amount of b)?" }, 
    options: { id: ["Huruf a dan b tidak kompatibel", "FA tidak punya memori tumpukan (stack) untuk menghitung/mengingat jumlah n tak hingga", "Karena tidak ada Epsilon", "Algoritma DFA terlalu lambat"], en: ["Letters a and b are incompatible", "FA lacks stack memory to count/remember infinite amount n", "Because there is no Epsilon", "DFA algorithm is too slow"] }, 
    correctIdx: 1, explanation: { id: "FA hanya mengingat state saat ini, tidak bisa menghitung akumulasi.", en: "FA only remembers current state, cannot count accumulations." }, type: "text" },
  { id: "q428", level_group: 6, difficulty: "expert", category: "advanced", 
    question: { id: "Jika Bahasa L1 dan L2 adalah Regular, maka irisan (Intersection) dari L1 ∩ L2 adalah?", en: "If Languages L1 and L2 are Regular, then the intersection L1 ∩ L2 is?" }, 
    options: { id: ["Pasti Tidak Regular", "Pasti Regular", "Mungkin Regular", "Context-Free"], en: ["Definitely Not Regular", "Definitely Regular", "Maybe Regular", "Context-Free"] }, 
    correctIdx: 1, explanation: { id: "Bahasa Regular tertutup (closed) terhadap operasi irisan, gabungan, dan komplemen.", en: "Regular languages are closed under intersection, union, and complement." }, type: "text" },
  { id: "q429", level_group: 6, difficulty: "expert", category: "advanced", 
    question: { id: "Urutan hirarki bahasa dari yang paling sempit/lemah hingga paling luas menurut Chomsky adalah?", en: "The hierarchy of languages from narrowest/weakest to broadest according to Chomsky is?" }, 
    options: { id: ["Regular -> Context-Free -> Context-Sensitive -> Turing-Recognizable", "Turing -> Regular -> Context-Free -> Context-Sensitive", "Context-Free -> Regular -> Turing", "Regular -> Turing -> Context-Free"], en: ["Regular -> Context-Free -> Context-Sensitive -> Turing-Recognizable", "Turing -> Regular -> Context-Free -> Context-Sensitive", "Context-Free -> Regular -> Turing", "Regular -> Turing -> Context-Free"] }, 
    correctIdx: 0, explanation: { id: "Regular (FA) paling lemah, Turing Machine paling absolut.", en: "Regular (FA) is weakest, Turing Machine is absolute." }, type: "text" },
  { id: "q430", level_group: 6, difficulty: "expert", category: "advanced", 
    question: { id: "Komponen apa yang dimiliki Mesin Turing yang membuatnya jauh lebih sakti dari DFA/NFA?", en: "What component does a Turing Machine have that makes it far more powerful than DFA/NFA?" }, 
    options: { id: ["Pita pita (Tape) tak berhingga yang bisa ditulis dan dibaca mundur maju", "Jumlah state tak berhingga", "Epsilon ganda", "Start state ganda"], en: ["Infinite Tape that can be read/written forwards and backwards", "Infinite amount of states", "Double Epsilon", "Double start state"] }, 
    correctIdx: 0, explanation: { id: "Pita tak hingga memberi memori mutlak. DFA memori baca-maju terbatas.", en: "Infinite tape gives absolute memory. DFA is read-forward limited." }, type: "text" }
];