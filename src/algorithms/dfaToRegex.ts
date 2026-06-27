import type { Node, Edge } from 'reactflow';

export const dfaToRegex = (nodes: Node[], edges: Edge[]): string => {
  const initials = nodes.filter(n => n.data.isInitial);
  const finals = nodes.filter(n => n.data.isFinal);

  if (nodes.length === 0) throw new Error("errNoState");
  if (initials.length === 0) throw new Error("errNoInit");
  if (finals.length === 0) throw new Error("errNoFinal");
  if (edges.some(e => !e.label || (e.label as string).trim() === '')) throw new Error("errNoLabel");

  const stateMachine: Record<string, Record<string, string[]>> = {};
  const allStates = new Set<string>();

  nodes.forEach(n => {
    allStates.add(n.id);
    stateMachine[n.id] = {};
  });
  allStates.add('Q_START');
  allStates.add('Q_END');
  stateMachine['Q_START'] = {};
  stateMachine['Q_END'] = {};

  edges.forEach(e => {
    const src = e.source;
    const tgt = e.target;
    const lbl = (e.label as string).trim();
    if (!stateMachine[src][tgt]) stateMachine[src][tgt] = [];
    stateMachine[src][tgt].push(lbl);
  });

  initials.forEach(i => {
    if (!stateMachine['Q_START'][i.id]) stateMachine['Q_START'][i.id] = [];
    stateMachine['Q_START'][i.id].push('ε');
  });

  finals.forEach(f => {
    if (!stateMachine[f.id]['Q_END']) stateMachine[f.id]['Q_END'] = [];
    stateMachine[f.id]['Q_END'].push('ε');
  });

  const formatUnion = (exprs: string[]) => {
    if (exprs.length === 0) return '';
    if (exprs.length === 1) return exprs[0];
    const unique = Array.from(new Set(exprs)).filter(e => e !== '∅');
    if (unique.length === 0) return '∅';
    if (unique.length === 1) return unique[0];
    return `(${unique.join('|')})`;
  };

  const formatConcat = (e1: string, e2: string, e3: string) => {
    const parts = [e1, e2, e3].filter(e => e !== 'ε' && e !== '');
    if (parts.includes('∅')) return '∅';
    if (parts.length === 0) return 'ε';
    return parts.join('');
  };

  const formatStar = (expr: string) => {
    if (!expr || expr === 'ε' || expr === '∅') return '';
    if (expr.length === 1 || (expr.startsWith('(') && expr.endsWith(')'))) return `${expr}*`;
    return `(${expr})*`;
  };

  const statesToEliminate = Array.from(allStates).filter(s => s !== 'Q_START' && s !== 'Q_END');

  for (const q of statesToEliminate) {
    const selfLoops = stateMachine[q][q] ? formatUnion(stateMachine[q][q]) : '';
    const starSelf = formatStar(selfLoops);

    const inEdges = Object.keys(stateMachine).filter(p => p !== q && stateMachine[p][q]?.length > 0);
    const outEdges = Object.keys(stateMachine[q]).filter(r => r !== q && stateMachine[q][r]?.length > 0);

    for (const p of inEdges) {
      for (const r of outEdges) {
        const inExpr = formatUnion(stateMachine[p][q]);
        const outExpr = formatUnion(stateMachine[q][r]);
        const pathExpr = formatConcat(inExpr, starSelf, outExpr);

        if (!stateMachine[p][r]) stateMachine[p][r] = [];
        stateMachine[p][r].push(pathExpr);
      }
    }
    delete stateMachine[q];
    Object.values(stateMachine).forEach(t => delete t[q]);
  }

  let finalRegex = formatUnion(stateMachine['Q_START']['Q_END'] || []);
  if (finalRegex === '∅' || finalRegex === '') return '';
  if (finalRegex.startsWith('(') && finalRegex.endsWith(')') && !finalRegex.slice(1, -1).includes('|')) {
    finalRegex = finalRegex.slice(1, -1);
  }
  return finalRegex;
};