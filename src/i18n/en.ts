export const en = {
  // Navbar & Global
  about: 'About',
  eduMode: 'Edu Mode',
  toastCopied: 'Link copied!',
  toastExported: 'Exported successfully!',
  toastPdfSuccess: 'PDF report downloaded successfully!',
  toastPdfError: 'Failed to process PDF report.',

  // RegexInput
  inputLabel: 'Enter Regular Expression',
  example: 'Example:',
  inputPlaceholder: 'Type regex... e.g.: (a|b)*c',
  visualize: 'Visualize',
  copyLink: 'Copy Link',
  syntaxGuide: 'Syntax Guide',
  history: 'History',
  clearAll: 'Clear All',
  noHistory: 'No regex history yet.',

  // Validation & Error
  errEmpty: 'Regex expression cannot be empty',
  errParenClose: 'Found closing parenthesis ")" without a match',
  errParenOpen: 'Found opening parenthesis "(" without a match',
  errInvalid: 'Invalid or unsupported regex format.',

  // String Tester
  singleTest: 'Single Test',
  batchTest: 'Batch Test',
  testDesc: 'Test a single string against DFA rules.',
  testPlaceholder: 'Enter string... (empty = ε)',
  btnTest: 'Test String',
  batchDesc: 'Enter multiple strings (one per line) to batch test the DFA rules.',
  batchPlaceholder: 'Enter strings...\nExample:\nab\naac\nbb',
  btnExportCsv: 'Export to CSV',

  // InfoPanel
  infoTitle: 'Automata Analysis',
  btnPdf: 'Generate PDF Report',
  btnProcessing: 'Processing...',
  stateNfa: 'NFA States',
  stateDfa: 'DFA States',
  initEps: 'Initial State ε-Closure',
  alphabet: 'Alphabet (Σ)',
  descExpand: 'DFA is formed of {dfa} states, expanding from the original NFA which has {nfa} states. This size expansion is normal to eliminate non-determinism.',
  descReduce: 'DFA is formed of {dfa} states, successfully reducing space complexity efficiently from the original NFA which has {nfa} states.',
  descEqual: 'DFA is formed of {dfa} states, maintaining equivalent space efficiency with the original NFA layout which has {nfa} states.',

  // EducationPanel
  eduPanelTitle: 'Education Mode: Conversion Steps',
  eduStepOf: 'Step {current} of {total}',
  btnPrev: 'Previous',
  btnNext: 'Next',
  
  step1Title: 'Regex Parsing & Validation',
  step1Desc: 'Postfix notation (Reverse Polish Notation) places operators after operands, eliminating operation hierarchy ambiguities without using parentheses.',
  
  step2Title: "Thompson's Construction (NFA)",
  step2Desc: 'Reads postfix characters from left to right to build individual NFA fragments based on baseline and inductive rules:',
  step2Bullet1: 'Alphabet Character: Linear transition from start to accept state.',
  step2Bullet2: 'Union (|): Parallel branching via empty transitions (ε) to 2 fragments.',
  step2Bullet3: 'Kleene Star (*): Recursive loop transitions (ε looping).',
  step2Bullet4: 'Concatenation (.): Connects the tail of fragment A to the head of B.',
  step2Total: 'Total NFA: {count} States',

  step3Title: 'ε-Closure Calculation',
  step3Desc: 'A set of states reachable immediately using empty transitions (ε) without consuming any alphabet input character.',
  step3TableCol1: 'NFA State',
  step3TableCol2: 'ε-Closure Set',

  step4Title: 'Subset Construction (DFA)',
  step4Desc: 'Resolves non-deterministic behavior by wrapping a set of NFA states into a single unified DFA state entity.',
  step4TableCol1: 'DFA State',
  step4TableCol2: 'NFA State Subset',

  step3Hint: "Hover over table rows to view the closure on the graph.",
  step4Hint: "Hover over table rows to view the DFA state on the graph.",

  step5Title: 'Final Analysis Result',
  step5NfaStruct: 'NFA Structure',
  step5DfaStruct: 'DFA Structure',
  step5States: 'States:',
  step5Transitions: 'Transitions:',
  step5Conclusion: 'DFA offers faster (linear) runtime execution execution since transition ambiguity is eliminated, although its mathematical model might consume more state memory.',

  // AboutModal
  aboutDesc: 'An interactive web-based application to visualize the conversion of Regular Expressions into Non-deterministic Finite Automaton (NFA) using Thompson\'s Construction, and further validated into a Deterministic Finite Automaton (DFA) via Subset Construction.',
  academicTitle: 'Academic Information',
  course: 'Course:',
  prodi: 'Field of Study:',
  semester: 'Semester:',
  year: 'Year:',
  techTitle: 'Tech Stack',
  teamTitle: 'JFABWIND Team',

  // App & Graph Titles
  appTitle: 'Regex to Automata Visualizer',

  // App & Graph Titles
  appDesc: 'Convert regular expressions into a Non-deterministic Finite Automaton (NFA), then validate it into a Deterministic Finite Automaton (DFA).',
  graphNfa: 'NFA Visualization',
  graphDfa: 'DFA Visualization',
  tableNfa: 'NFA Transition Table',
  tableDfa: 'DFA Transition Table',
  
  // Academic Values
  courseName: 'Formal Language and Automata Theory',
  prodiName: 'Informatics Engineering',

  // Shortcuts Modal
  scTitle: 'Keyboard Shortcuts',
  scVisualize: 'Visualize regex (Start Processing)',
  scEduMode: 'Toggle Education Mode',
  scTheme: 'Toggle Dark / Light Mode',
  scExportPng: 'Export PNG (Active Graph)',
  scCopyLink: 'Copy share link',
  scHistory: 'Toggle History panel',
  scGuide: 'Show this shortcut guide',

  // Onboarding Tour
  tour1Title: 'Welcome!',
  tour1Desc: 'Let\'s take a quick tour to explore the main features of JFABWIND Visualizer.',
  tour2Title: '1. Regex Input',
  tour2Desc: 'Type your regular expression here. You can also click the example buttons above.',
  tour3Title: '2. Visualize Automata',
  tour3Desc: 'Click this button to process your Regex into Automata machines. Once processed, the Analysis panels will appear below.',
  tour4Title: '3. Education Mode',
  tour4Desc: 'Enable this mode to see the step-by-step mathematical explanation of the conversion algorithm.',
  tour5Title: '4. Additional Controls',
  tour5Desc: 'Here you can change the language, view keyboard shortcuts, and toggle the theme.',
  tourNext: 'Next',
  tourPrev: 'Back',
  tourSkip: 'Skip',
  tourClose: 'Let\'s Go!',

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
  rbPlaceholder: 'Build automata above then click Generate Regex',
  errNoInit: 'Must have at least 1 Initial State',
  errNoFinal: 'Must have at least 1 Final State',
  errNoState: 'Canvas cannot be empty',
  errNoLabel: 'All transitions must have labels',
  rbConfirmClear: 'Are you sure you want to clear all states and transitions?',
  rbLoadPreset: 'Load Preset...',
};