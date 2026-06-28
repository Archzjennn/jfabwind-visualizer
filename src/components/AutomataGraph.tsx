import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
  type Node,
  type Edge,
  type ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Maximize2, Minimize2, Download, Image as ImageIcon, FileCode2, ArrowRightLeft, ArrowRightToLine, ArrowRightFromLine, Eye, EyeOff, Plus, Minus } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Automaton, NodeData } from '../types/automata';
import { useStore } from '../store/useStore';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 80;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 60 });
  nodes.forEach((node) => { dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }); });
  edges.forEach((edge) => { dagreGraph.setEdge(edge.source, edge.target); });
  dagre.layout(dagreGraph);
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 };
    return node;
  });
  return { nodes: layoutedNodes, edges };
};

const StateNode = memo(({ data }: { data: NodeData & { isTestActive?: boolean; isTooltipActive?: boolean } }) => {
  const { theme } = useStore();
  let bgClass = theme === 'dark' ? 'bg-[#080810] border-slate-600/50 text-slate-300' : 'bg-white border-slate-300 text-slate-800';
  
  if (data.isTestActive) {
    bgClass = theme === 'dark' ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm';
  }
  else if (data.isActive) { 
    bgClass = theme === 'dark' ? 'bg-violet-500/20 border-violet-400 text-white shadow-[0_0_15px_rgba(var(--accent-500),0.3)]' : 'bg-violet-100 border-violet-500 text-violet-900 shadow-sm'; 
  } 
  else if (data.isStart) { 
    bgClass = theme === 'dark' ? 'bg-sky-500/10 border-sky-500/60 text-sky-200' : 'bg-sky-50 border-sky-500 text-sky-900'; 
  } 
  else if (data.isAccept) { 
    bgClass = theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-200' : 'bg-emerald-50 border-emerald-500 text-emerald-900'; 
  }

  return (
    <div className={`relative flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-full border-[3px] transition-all duration-300 ${bgClass}`}>
      <Handle type="target" position={Position.Left} id="left" className="opacity-0" />
      <Handle type="target" position={Position.Top} id="top-target" className="opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-target" className="opacity-0" />
      
      {data.isStart && (
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center">
          <div className={`w-6 h-[2.5px] ${theme === 'dark' ? 'bg-sky-500/80' : 'bg-sky-500'}`}></div>
          <div className={`w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] ${theme === 'dark' ? 'border-l-sky-500/80' : 'border-l-sky-500'}`}></div>
        </div>
      )}
      
      <div className={`flex items-center justify-center w-full h-full ${data.isTooltipActive ? 'cursor-help' : ''}`}>
        {data.isAccept ? (
          <div className={`flex items-center justify-center w-[44px] h-[44px] sm:w-[40px] sm:h-[40px] rounded-full border-[2px] ${theme === 'dark' ? 'border-emerald-500/40' : 'border-emerald-500/50'}`}>
            <span className="text-sm font-bold font-mono tracking-wider">{data.label}</span>
          </div>
        ) : (
          <span className="text-sm font-bold font-mono tracking-wider">{data.label}</span>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
      <Handle type="source" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
    </div>
  );
});

const nodeTypes = { stateNode: StateNode };

interface Props { automaton: Automaton | null; title: string; }

export const AutomataGraph = memo(({ automaton, title }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  
  const [isTooltipEnabled, setIsTooltipEnabled] = useState(true);
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; nodeId: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const { theme, lang, regex, showToast, testActiveNodes, testActiveEdges } = useStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!automaton) { setNodes([]); setEdges([]); return; }
    const initialNodes: Node[] = automaton.states.map((state) => ({
      id: state, type: 'stateNode', position: { x: 0, y: 0 },
      data: { label: state, isStart: state === automaton.startState, isAccept: automaton.acceptStates.includes(state), isActive: false, isTestActive: false, isTooltipActive: isMaximized && isTooltipEnabled },
    }));

    const edgeMap = new Map();
    automaton.transitions.forEach((t) => {
      const key = `${t.from}-${t.to}`;
      if (edgeMap.has(key)) edgeMap.get(key).symbols.push(t.symbol);
      else edgeMap.set(key, { ...t, symbols: [t.symbol] });
    });

    const initialEdges: Edge[] = Array.from(edgeMap.values()).map((t, i) => {
      const isSelfLoop = t.from === t.to;
      const isBackwards = initialNodes.findIndex(n => n.id === t.from) > initialNodes.findIndex(n => n.id === t.to);
      let sourceHandle = 'right', targetHandle = 'left';
      if (isSelfLoop) { sourceHandle = 'top'; targetHandle = 'top-target'; } 
      else if (isBackwards) { sourceHandle = 'bottom'; targetHandle = 'bottom-target'; }

      return {
        id: `e-${t.from}-${t.to}-${i}`, source: t.from, target: t.to, label: t.symbols.join(', '), type: isSelfLoop ? 'default' : 'smoothstep', sourceHandle, targetHandle, animated: false,
        style: { stroke: isDark ? 'rgb(var(--accent-500))' : 'rgb(var(--accent-600))', strokeWidth: 2 },
        labelStyle: { fill: isDark ? '#ffffff' : '#080810', fontWeight: 800, fontSize: 13, fontFamily: 'monospace' },
        labelBgStyle: { fill: isDark ? 'rgba(8, 8, 16, 0.8)' : '#ffffff', fillOpacity: 1, rx: 6, stroke: isDark ? 'rgb(var(--accent-400))' : 'rgb(var(--accent-200))', strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? 'rgb(var(--accent-500))' : 'rgb(var(--accent-600))' },
      };
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, 'LR');
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    if (rfInstance) setTimeout(() => { rfInstance.fitView({ padding: 0.2, duration: 800, maxZoom: 1 }); }, 50);
  }, [automaton, isDark, setNodes, setEdges, rfInstance, isMaximized, isTooltipEnabled]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { 
          ...n.data, 
          isTestActive: testActiveNodes.includes(n.id),
          isTooltipActive: isMaximized && isTooltipEnabled
        },
      }))
    );
    
    setEdges((eds) =>
      eds.map((e) => {
        const isActive = testActiveEdges.includes(`${e.source}-${e.target}`);
        return {
          ...e,
          animated: isActive,
          style: {
            ...e.style,
            stroke: isActive ? 'rgb(var(--accent-400))' : (isDark ? 'rgb(var(--accent-500))' : 'rgb(var(--accent-600))'),
            strokeWidth: isActive ? 3 : 2,
            filter: isActive ? 'drop-shadow(0 0 5px rgb(var(--accent-500) / 0.6))' : 'none',
          },
        };
      })
    );
  }, [testActiveNodes, testActiveEdges, setNodes, setEdges, isDark, isMaximized, isTooltipEnabled]);

  useEffect(() => {
    const handleResize = () => { if (rfInstance) rfInstance.fitView({ padding: 0.2, duration: 300, maxZoom: 1 }); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rfInstance]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) setIsMaximized(false);
      if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); if (automaton) handleExport('png'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized, automaton, title, isDark, regex]);

  useEffect(() => {
    if (rfInstance) setTimeout(() => { rfInstance.fitView({ padding: 0.2, duration: 800, maxZoom: 1 }); }, 100);
  }, [isMaximized, rfInstance]);

  useEffect(() => {
    if (!isMaximized || !isTooltipEnabled) {
      setTooltip(null);
    }
  }, [isMaximized, isTooltipEnabled]);

  const handleExport = async (format: 'png' | 'svg') => {
    if (!flowWrapperRef.current) return;
    try {
      const filter = (node: HTMLElement) => !(node.classList?.contains('react-flow__controls') || node.classList?.contains('react-flow__panel') || node.classList?.contains('custom-zoom-panel'));
      const bgColor = isDark ? '#080810' : '#f8fafc';
      const dataUrl = format === 'png' 
        ? await toPng(flowWrapperRef.current, { backgroundColor: bgColor, filter })
        : await toSvg(flowWrapperRef.current, { backgroundColor: bgColor, filter });
      
      const prefix = title.includes('NFA') ? 'NFA' : 'DFA';
      const safeRegex = regex ? regex.replace(/[^a-zA-Z0-9|()*+]/g, '_') : 'graf';
      
      const link = document.createElement('a');
      link.download = `${prefix}-${safeRegex}.${format}`;
      link.href = dataUrl;
      link.click();
      showToast(lang === 'id' ? 'Berhasil diekspor!' : 'Exported successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast(lang === 'id' ? 'Gagal mengekspor graf' : 'Failed to export graph', 'error');
    } finally {
      setShowExportMenu(false);
    }
  };

  const handleNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    if (!isMaximized || !isTooltipEnabled) return; 

    const target = event.target as HTMLElement;
    const nodeElement = target.closest('.react-flow__node');
    if (nodeElement) {
      const rect = nodeElement.getBoundingClientRect();
      
      const nodeCenterX = rect.left + rect.width / 2;
      const tooltipMaxHalfWidth = 160; 
      let safeX = nodeCenterX;
      
      if (nodeCenterX + tooltipMaxHalfWidth > window.innerWidth - 20) {
        safeX = window.innerWidth - tooltipMaxHalfWidth - 20;
      }
      else if (nodeCenterX - tooltipMaxHalfWidth < 20) {
        safeX = tooltipMaxHalfWidth + 20;
      }

      setTooltip({
        show: true,
        x: safeX,
        y: rect.bottom + 12,
        nodeId: node.id,
      });
    }
  }, [isMaximized, isTooltipEnabled]);

  const handleNodeMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const renderTooltip = () => {
    if (!isMaximized || !isTooltipEnabled || !tooltip || !tooltip.show || !automaton) return null;

    const isStart = tooltip.nodeId === automaton.startState;
    const isAccept = automaton.acceptStates.includes(tooltip.nodeId);
    
    const incoming = automaton.transitions.filter(t => t.to === tooltip.nodeId);
    const outgoing = automaton.transitions.filter(t => t.from === tooltip.nodeId);

    const inMap = incoming.reduce((acc, t) => {
      if (!acc[t.from]) acc[t.from] = [];
      acc[t.from].push(t.symbol);
      return acc;
    }, {} as Record<string, string[]>);
    
    const outMap = outgoing.reduce((acc, t) => {
      if (!acc[t.to]) acc[t.to] = [];
      acc[t.to].push(t.symbol);
      return acc;
    }, {} as Record<string, string[]>);

    const inStr = incoming.length 
      ? Object.entries(inMap).map(([from, syms]) => lang === 'id' ? `dari ${from} via ${syms.join(',')}` : `from ${from} via ${syms.join(',')}`).join(' | ') 
      : '-';

    const outStr = outgoing.length 
      ? Object.entries(outMap).map(([to, syms]) => `${syms.join(',')} → ${to}`).join(' | ') 
      : '-';

    const portalContent = (
      <AnimatePresence>
        <div
          key={`tooltip-${tooltip.nodeId}`}
          style={{ 
            position: 'fixed', 
            left: tooltip.x, 
            top: tooltip.y, 
            transform: 'translate(-50%, 0)', 
            zIndex: 999999, 
            pointerEvents: 'none' 
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border min-w-[260px] max-w-[320px] backdrop-blur-xl ${
              isDark ? 'bg-[#080810]/95 border-violet-500/30 text-white shadow-violet-500/10' : 'bg-white/95 border-violet-200 text-slate-800 shadow-violet-500/5'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 mb-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full shadow-inner ${isStart ? 'bg-sky-500' : isAccept ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className="font-black text-base">{tooltip.nodeId}</span>
              </div>
              <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md ${
                isStart && isAccept ? (isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700') :
                isStart ? (isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-700') :
                isAccept ? (isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                (isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500')
              }`}>
                {isStart && isAccept ? 'Init & Final' : isStart ? 'Initial' : isAccept ? 'Final' : 'Normal'}
              </span>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <ArrowRightToLine className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang === 'id' ? 'Transisi Masuk' : 'Incoming'}</div>
                  <div className={`font-mono font-medium leading-relaxed break-all ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>{inStr}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRightFromLine className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{lang === 'id' ? 'Transisi Keluar' : 'Outgoing'}</div>
                  <div className={`font-mono font-medium leading-relaxed break-all ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>{outStr}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );

    return typeof document !== 'undefined' ? createPortal(portalContent, document.body) : null;
  };

  const containerClasses = isMaximized 
    ? `fixed inset-0 z-[9999] flex flex-col m-0 p-4 sm:p-8 ${
        isDark ? 'bg-[#080810]/95 backdrop-blur-2xl' : 'bg-slate-50/95 backdrop-blur-2xl'
      } portrait:max-sm:w-[100vh] portrait:max-sm:h-[100vw] portrait:max-sm:top-1/2 portrait:max-sm:left-1/2 portrait:max-sm:-translate-x-1/2 portrait:max-sm:-translate-y-1/2 portrait:max-sm:rotate-90` 
    : `rounded-2xl overflow-hidden flex flex-col h-[450px] border backdrop-blur-xl ${isDark ? 'bg-white/2 border-white/5 shadow-xl shadow-black/50' : 'bg-white/80 border-slate-200 shadow-lg'}`;

  return (
    <div id={`graph-${title.includes('NFA') ? 'nfa' : 'dfa'}`} className={containerClasses}>
      <div className={`px-5 py-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-slate-50/50'} ${isMaximized ? 'rounded-t-2xl border-x border-t' : ''}`}>
        <h3 className={`font-bold tracking-wide uppercase text-sm flex items-center gap-2 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
          <ArrowRightLeft className="w-4 h-4" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          
          {isMaximized && (
            <button
              onClick={() => setIsTooltipEnabled(!isTooltipEnabled)}
              title={lang === 'id' ? 'Info Hover (On/Off)' : 'Hover Info (On/Off)'}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${isTooltipEnabled ? (isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700') : (isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800')}`}
            >
              {isTooltipEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
              title="Export as PNG/SVG (Ctrl + S)"
            >
              <Download className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-2 w-40 border rounded-xl shadow-2xl z-20 overflow-hidden ${isDark ? 'bg-[#080810]/95 backdrop-blur-xl border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    <button onClick={() => handleExport('png')} className={`w-full text-left px-4 py-3 text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
                      <ImageIcon className="w-4 h-4 text-violet-500" /> Export PNG
                    </button>
                    <button onClick={() => handleExport('svg')} className={`w-full text-left px-4 py-3 text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors border-t ${isDark ? 'hover:bg-white/5 text-slate-300 border-white/5' : 'hover:bg-slate-50 text-slate-600 border-slate-100'}`}>
                      <FileCode2 className="w-4 h-4 text-sky-500" /> Export SVG
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? "Minimize (Esc)" : "Maximize"}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div ref={flowWrapperRef} className={`flex-1 w-full relative touch-none ${isMaximized ? 'rounded-b-2xl border-x border-b ' + (isDark ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-white') : ''}`}>
        {automaton ? (
          <>
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange} 
              onEdgesChange={onEdgesChange} 
              nodeTypes={nodeTypes} 
              onInit={setRfInstance} 
              onNodeMouseEnter={handleNodeMouseEnter}
              onNodeMouseLeave={handleNodeMouseLeave}
              onMove={(_, viewport) => setZoomLevel(viewport.zoom)}
              className="bg-transparent" 
              fitView
            >
              <Background color={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} gap={20} size={2} variant={BackgroundVariant.Dots} />
              <Controls className={`border-none shadow-lg ${isDark ? 'bg-[#1a1a2e] fill-white' : 'bg-white fill-slate-800'}`} />
            </ReactFlow>
            
            <div className={`custom-zoom-panel absolute bottom-4 right-4 z-10 flex items-center p-1 rounded-xl backdrop-blur-md border shadow-lg transition-colors ${isDark ? 'bg-[#080810]/80 border-white/10' : 'bg-white/90 border-slate-200'}`}>
              <button 
                onClick={() => rfInstance?.zoomOut({ duration: 300 })} 
                className={`p-2 rounded-lg transition-all active:scale-95 ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                title={lang === 'id' ? 'Perkecil' : 'Zoom Out'}
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => rfInstance?.fitView({ duration: 500, padding: 0.2 })} 
                className={`w-[60px] text-center text-[11px] font-bold font-mono tracking-wider transition-colors hover:scale-105 active:scale-95 ${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-700'}`}
                title={lang === 'id' ? 'Kembalikan Ukuran' : 'Reset View'}
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              
              <button 
                onClick={() => rfInstance?.zoomIn({ duration: 300 })} 
                className={`p-2 rounded-lg transition-all active:scale-95 ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                title={lang === 'id' ? 'Perbesar' : 'Zoom In'}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-widest text-slate-500/50">
            {lang === 'id' ? 'Menunggu Input Automata' : 'Waiting for Automata Input'}
          </div>
        )}

        {renderTooltip()}
      </div>
    </div>
  );
});