import type { Automaton, State } from '../types/automata';

let stateCounter = 0;
const nextState = (): State => `q${stateCounter++}`;

const insertConcat = (regex: string): string => {
  let res = "";
  for (let i = 0; i < regex.length; i++) {
    res += regex[i];
    if (i + 1 < regex.length) {
      const c1 = regex[i];
      const c2 = regex[i + 1];
      if (c1 !== '(' && c1 !== '|' && c2 !== ')' && c2 !== '|' && c2 !== '*' && c2 !== '+') {
        res += '.';
      }
    }
  }
  return res;
};

export const toPostfix = (regex: string): string => {
  const prec: Record<string, number> = { '*': 3, '.': 2, '|': 1 };
  let postfix = "";
  const stack: string[] = [];
  const formattedReg = insertConcat(regex);

  for (const c of formattedReg) {
    if (/[a-zA-Z0-9]/.test(c)) {
      postfix += c;
    } else if (c === '(') {
      stack.push(c);
    } else if (c === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        postfix += stack.pop()!;
      }
      stack.pop();
    } else {
      while (stack.length && prec[stack[stack.length - 1] as string] >= prec[c]) {
        postfix += stack.pop()!;
      }
      stack.push(c);
    }
  }
  while (stack.length) {
    postfix += stack.pop()!;
  }
  return postfix;
};

export const regexToNFA = (regex: string): Automaton => {
  stateCounter = 0;
  const postfix = toPostfix(regex);
  const stack: Automaton[] = [];

  for (const c of postfix) {
    if (/[a-zA-Z0-9]/.test(c)) {
      const start = nextState();
      const accept = nextState();
      stack.push({ states: [start, accept], alphabet: [c], transitions: [{ from: start, to: accept, symbol: c }], startState: start, acceptStates: [accept] });
    } else if (c === '.') {
      const right = stack.pop()!;
      const left = stack.pop()!;
      stack.push({ states: Array.from(new Set([...left.states, ...right.states])), alphabet: Array.from(new Set([...left.alphabet, ...right.alphabet])), transitions: [...left.transitions, ...right.transitions, { from: left.acceptStates[0], to: right.startState, symbol: 'ε' }], startState: left.startState, acceptStates: right.acceptStates });
    } else if (c === '|') {
      const right = stack.pop()!;
      const left = stack.pop()!;
      const start = nextState();
      const accept = nextState();
      stack.push({ states: Array.from(new Set([start, accept, ...left.states, ...right.states])), alphabet: Array.from(new Set([...left.alphabet, ...right.alphabet])), transitions: [...left.transitions, ...right.transitions, { from: start, to: left.startState, symbol: 'ε' }, { from: start, to: right.startState, symbol: 'ε' }, { from: left.acceptStates[0], to: accept, symbol: 'ε' }, { from: right.acceptStates[0], to: accept, symbol: 'ε' }], startState: start, acceptStates: [accept] });
    } else if (c === '*') {
      const nfa = stack.pop()!;
      const start = nextState();
      const accept = nextState();
      stack.push({ states: Array.from(new Set([start, accept, ...nfa.states])), alphabet: nfa.alphabet, transitions: [...nfa.transitions, { from: start, to: nfa.startState, symbol: 'ε' }, { from: start, to: accept, symbol: 'ε' }, { from: nfa.acceptStates[0], to: nfa.startState, symbol: 'ε' }, { from: nfa.acceptStates[0], to: accept, symbol: 'ε' }], startState: start, acceptStates: [accept] });
    }
  }
  return stack[0] || { states: [], alphabet: [], transitions: [], startState: '', acceptStates: [] };
};