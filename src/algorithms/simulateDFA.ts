import type { Automaton, State } from '../types/automata';

export const simulateDFA = (dfa: Automaton, input: string): { accepted: boolean; path: State[] } => {
  let currentState = dfa.startState;
  const path = [currentState];

  for (const char of input) {
    const transition = dfa.transitions.find(t => t.from === currentState && t.symbol === char);
    if (!transition) {
      return { accepted: false, path };
    }
    currentState = transition.to;
    path.push(currentState);
  }

  return { accepted: dfa.acceptStates.includes(currentState), path };
};