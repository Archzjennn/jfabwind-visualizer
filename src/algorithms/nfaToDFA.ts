import type { Automaton, Transition, State, InputSymbol } from '../types/automata';

export const epsilonClosure = (states: State[], transitions: Transition[]): State[] => {
  const stack = [...states];
  const closure = new Set(states);
  while (stack.length > 0) {
    const current = stack.pop()!;
    transitions.filter(t => t.from === current && t.symbol === 'ε').forEach(t => {
      if (!closure.has(t.to)) { closure.add(t.to); stack.push(t.to); }
    });
  }
  return Array.from(closure).sort();
};

const move = (states: State[], symbol: InputSymbol, transitions: Transition[]): State[] => {
  const result = new Set<State>();
  states.forEach(state => {
    transitions.filter(t => t.from === state && t.symbol === symbol).forEach(t => result.add(t.to));
  });
  return Array.from(result).sort();
};

export const nfaToDFA = (nfa: Automaton): Automaton => {
  const dfaStates: State[][] = [];
  const dfaTransitions: Transition[] = [];
  const alphabet = nfa.alphabet.filter(s => s !== 'ε');

  const startClosure = epsilonClosure([nfa.startState], nfa.transitions);
  dfaStates.push(startClosure);

  const unmarked = [startClosure];
  const stateMap = new Map<string, string>();
  let dfaStateCounter = 0;

  const getDfaStateName = (states: State[]) => {
    const key = states.join(',');
    if (!stateMap.has(key)) stateMap.set(key, `D${dfaStateCounter++}`);
    return stateMap.get(key)!;
  };

  while (unmarked.length > 0) {
    const current = unmarked.shift()!;
    const fromName = getDfaStateName(current);

    alphabet.forEach(symbol => {
      const next = epsilonClosure(move(current, symbol, nfa.transitions), nfa.transitions);
      if (next.length > 0) {
        const nextKey = next.join(',');
        if (!stateMap.has(nextKey)) {
          dfaStates.push(next);
          unmarked.push(next);
        }
        dfaTransitions.push({ from: fromName, to: getDfaStateName(next), symbol });
      }
    });
  }

  const acceptStates = dfaStates
    .filter(stateSet => stateSet.some(s => nfa.acceptStates.includes(s)))
    .map(getDfaStateName);

  const mapping: Record<string, State[]> = {};
  dfaStates.forEach(stateSet => {
    mapping[getDfaStateName(stateSet)] = stateSet;
  });

  return {
    states: dfaStates.map(getDfaStateName), alphabet, transitions: dfaTransitions, startState: getDfaStateName(startClosure), acceptStates, mapping
  };
};