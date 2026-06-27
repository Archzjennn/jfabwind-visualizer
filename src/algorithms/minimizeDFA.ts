import type { Automaton } from '../types/automata';

export const minimizeDFA = (dfa: Automaton, lang: 'id' | 'en' = 'id'): { minDfa: Automaton, logs: string[] } => {
  const logs: string[] = [];
  
  // 1. Hapus unreachable states (State yang tidak bisa dicapai dari Start)
  const reachable = new Set<string>([dfa.startState]);
  let changed = true;
  while (changed) {
    changed = false;
    const size = reachable.size;
    dfa.transitions.forEach(t => {
      if (reachable.has(t.from)) reachable.add(t.to);
    });
    if (reachable.size > size) changed = true;
  }
  const states = dfa.states.filter(s => reachable.has(s));

  if (dfa.states.length > states.length) {
    const diff = dfa.states.length - states.length;
    logs.push(lang === 'id' 
      ? `Dihapus ${diff} unreachable state(s).` 
      : `Removed ${diff} unreachable state(s).`);
  }
  
  // 2. Table-Filling Algorithm (Myhill-Nerode)
  const distinguishable = new Set<string>();
  const getPairKey = (s1: string, s2: string) => [s1, s2].sort().join('-');

  // Tandai pasangan Final vs Non-Final
  for (let i = 0; i < states.length; i++) {
    for (let j = i + 1; j < states.length; j++) {
      const s1Accept = dfa.acceptStates.includes(states[i]);
      const s2Accept = dfa.acceptStates.includes(states[j]);
      if (s1Accept !== s2Accept) {
        distinguishable.add(getPairKey(states[i], states[j]));
      }
    }
  }

  // Iterasi sampai tidak ada perubahan (Mencari state yang bisa dibedakan oleh input)
  let markingChanged = true;
  while (markingChanged) {
    markingChanged = false;
    for (let i = 0; i < states.length; i++) {
      for (let j = i + 1; j < states.length; j++) {
        const pairKey = getPairKey(states[i], states[j]);
        if (!distinguishable.has(pairKey)) {
          for (const symbol of dfa.alphabet) {
            const t1 = dfa.transitions.find(t => t.from === states[i] && t.symbol === symbol)?.to;
            const t2 = dfa.transitions.find(t => t.from === states[j] && t.symbol === symbol)?.to;
            if (t1 && t2 && t1 !== t2) {
              if (distinguishable.has(getPairKey(t1, t2))) {
                distinguishable.add(pairKey);
                markingChanged = true;
                break;
              }
            }
          }
        }
      }
    }
  }

  // 3. Kelompokkan state yang Ekuivalen (Tidak Distinguishable)
  const equivalentGroups: Set<string>[] = [];
  const visited = new Set<string>();

  for (const state of states) {
    if (visited.has(state)) continue;
    const group = new Set<string>([state]);
    visited.add(state);

    for (const other of states) {
      if (!visited.has(other) && !distinguishable.has(getPairKey(state, other))) {
        group.add(other);
        visited.add(other);
      }
    }
    equivalentGroups.push(group);
  }

  const groupNameMap = new Map<string, string>();
  equivalentGroups.forEach((group, index) => {
    const sorted = Array.from(group).sort();
    if (sorted.length > 1) {
      logs.push(lang === 'id'
        ? `State ${sorted.join(', ')} ekuivalen → digabung menjadi qM${index}`
        : `States ${sorted.join(', ')} are equivalent → merged into qM${index}`);
    }
    // Penamaan state baru: Jika digabung, beri nama qM(index). Jika tidak, pertahankan nama asli.
    const newName = sorted.length > 1 ? `qM${index}` : sorted[0];
    group.forEach(s => groupNameMap.set(s, newName));
  });

  const removedCount = dfa.states.length - equivalentGroups.length;
  if (removedCount > 0) {
    logs.push(lang === 'id'
      ? `Total reduksi: ${removedCount} state dihilangkan/digabung.`
      : `Total reduction: ${removedCount} state(s) removed/merged.`);
  } else {
    logs.push(lang === 'id'
      ? `DFA sudah minimal. Tidak ada state yang bisa digabung.`
      : `DFA is already minimal. No states can be merged.`);
  }

  // 4. Bangun DFA Minimal Baru
  const minStates = Array.from(new Set(Array.from(groupNameMap.values())));
  const minStartState = groupNameMap.get(dfa.startState) || minStates[0];
  const minAcceptStates = Array.from(new Set(
    dfa.acceptStates.filter(s => groupNameMap.has(s)).map(s => groupNameMap.get(s)!)
  ));

  const minTransitions: { from: string; symbol: string; to: string }[] = [];
  const transitionSet = new Set<string>();

  dfa.transitions.forEach(t => {
    if (groupNameMap.has(t.from) && groupNameMap.has(t.to)) {
      const from = groupNameMap.get(t.from)!;
      const to = groupNameMap.get(t.to)!;
      const key = `${from}-${t.symbol}-${to}`;
      if (!transitionSet.has(key)) {
        transitionSet.add(key);
        minTransitions.push({ from, symbol: t.symbol, to });
      }
    }
  });

  return {
    minDfa: {
      states: minStates,
      alphabet: dfa.alphabet,
      transitions: minTransitions,
      startState: minStartState,
      acceptStates: minAcceptStates
    },
    logs
  };
};