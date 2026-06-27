import React, { useCallback, useState, useEffect, useRef, memo } from 'react';
import ReactFlow, { 
  Background, Controls, MiniMap, addEdge, applyNodeChanges, applyEdgeChanges, 
  Handle, Position, MarkerType, ConnectionMode, ReactFlowProvider, useReactFlow, 
  BackgroundVariant, getSmoothStepPath, EdgeLabelRenderer, type EdgeProps
} from 'reactflow';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Copy, PlusCircle, ArrowRight, CircleDot, Maximize2, Minimize2, Undo2, Redo2, LayoutGrid, Map, Trash2, AlertTriangle, HelpCircle, Square, Upload, Image as ImageIcon, Save, Sparkles, Crosshair, Grid3X3, CheckCircle2, MousePointerClick } from 'lucide-react';
import dagre from 'dagre';
import { toPng } from 'html-to-image';
import { useStore } from '../store/useStore';
import { dfaToRegex } from '../algorithms/dfaToRegex';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

interface StateNodeData {
  label: string;
  isInitial: boolean;
  isFinal: boolean;
  isActive?: boolean;
  isConnecting?: boolean; 
  animationDelay?: number;
}

type BuilderStatus = {
  msg: string;
  color: string;
  icon: string;
};

type ContextMenuType = 
  | { type: 'node', id: string, x: number, y: number }
  | { type: 'edge', id: string, x: number, y: number }
  | { type: 'pane', x: number, y: number }
  | null;

const NODE_SIZE = 60;

const StateNode = ({ data, selected }: { data: StateNodeData, selected: boolean }) => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const delay = data.animationDelay || 0;

  let nodeClasses = `relative flex items-center justify-center rounded-full border-[3px] transition-all duration-300 shadow-md hover:shadow-lg `;
  
  if (data.isConnecting) {
    nodeClasses += `border-sky-500 bg-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.8)] scale-110 z-50 ring-4 ring-sky-500/40 animate-pulse cursor-crosshair `;
  } else if (data.isActive) {
    nodeClasses += `border-amber-500 bg-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-110 font-bold animate-pulse `;
  } else {
    nodeClasses += isDark ? 'bg-[#080810] ' : 'bg-white ';
    if (selected) {
      nodeClasses += `border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] `;
    } else {
      nodeClasses += isDark ? 'border-slate-600/50 ' : 'border-slate-400 ';
    }
  }

  if (data.isFinal) nodeClasses += 'outline outline-4 outline-offset-2 outline-emerald-500/80 ';

  return (
    <motion.div
      initial={data.animationDelay ? { opacity: 0, scale: 0.3 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
      className={nodeClasses}
      style={{ width: NODE_SIZE, height: NODE_SIZE }}>
      
      {data.isInitial && (
        <div className={`absolute -left-8 w-6 h-0 border-t-[3px] ${isDark ? 'border-sky-500/80' : 'border-sky-500'}
          after:content-[''] after:absolute after:-top-2.5 after:-right-2.5 after:border-t-[9px] 
          after:border-t-transparent after:border-b-[9px] after:border-b-transparent 
          after:border-l-[12px] ${isDark ? 'after:border-l-sky-500/80' : 'after:border-l-sky-500'}`}>
        </div>
      )}
      
      <span className={`font-mono text-base tracking-wider ${data.isActive ? 'text-amber-500 font-extrabold' : (isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold')}`}>{data.label}</span>
      
      <Handle type="source" position={Position.Top} id="top" className="w-4 h-4 bg-violet-500 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Top} id="top-t" className="opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Right} id="right" className="w-4 h-4 bg-violet-500 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Right} id="right-t" className="opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-4 h-4 bg-violet-500 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Bottom} id="bottom-t" className="opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Left} id="left" className="w-4 h-4 bg-violet-500 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Left} id="left-t" className="opacity-0 pointer-events-none" />
    </motion.div>
  );
};

const AnimatedDrawEdge = memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, label, data }: EdgeProps) => {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const delay = data?.animationDelay || 0;

  const symbols = label ? (label as string).split(',').map(s => s.trim()).filter(s => s !== '') : [];
  const displayLabel = symbols.length > 2 ? `${symbols[0]}, ${symbols[1]}, +${symbols.length - 2}` : label;

  return (
    <>
      <path
        id={`${id}-interaction`}
        className="react-flow__edge-interaction nodrag nopan"
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={30}
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent('edit-edge', { detail: id }));
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent('ctx-edge', { detail: { id, x: e.clientX, y: e.clientY } }));
        }}
      />
      
      <motion.path
        id={id}
        className="react-flow__edge-path pointer-events-none"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ strokeWidth: 2, stroke: isDark ? '#8b5cf6' : '#7c3aed' }}
        initial={data?.animationDelay ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.4, ease: 'easeInOut' }}
      />
      
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan p-4 flex items-center justify-center cursor-pointer group"
            onDoubleClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('edit-edge', { detail: id })); }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('ctx-edge', { detail: { id, x: e.clientX, y: e.clientY } })); }}
          >
            <motion.div
              initial={data?.animationDelay ? { opacity: 0, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.15, duration: 0.2 }}
            >
              <div 
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border shadow-sm transition-colors backdrop-blur-md
                  ${isDark ? 'bg-[#080810]/80 border-violet-500/50 text-slate-200 group-hover:border-violet-400 group-hover:bg-[#080810]' : 'bg-white/90 border-slate-300 text-slate-800 group-hover:border-violet-500 group-hover:text-violet-700'}`}
              >
                {displayLabel}
                
                {symbols.length > 2 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg shadow-xl text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none border z-50 bg-slate-800 border-slate-700 text-white">
                    {label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

const nodeTypes = { state: StateNode };
const edgeTypes = { animatedDraw: AnimatedDrawEdge };

const RegexBuilderInner = () => {
  const { isBuilderOpen, toggleBuilder, builderNodes, builderEdges, setBuilderNodes, setBuilderEdges, generatedRegex, setGeneratedRegex, showToast, lang, theme } = useStore();
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';
  const { fitView, project } = useReactFlow();
  
  const flowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuType>(null);
  const [editingLabel, setEditingLabel] = useState<{ id: string, type: 'node' | 'edge', current: string } | null>(null);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showJumpMenu, setShowJumpMenu] = useState(false);
  const [showGridMenu, setShowGridMenu] = useState(false);
  
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);

  const [gridSize, setGridSize] = useState<number>(() => {
    const saved = localStorage.getItem('rb-grid-size');
    return saved ? parseInt(saved) : 20;
  });
  const [showGrid, setShowGrid] = useState<boolean>(() => {
    const saved = localStorage.getItem('rb-show-grid');
    return saved ? saved === 'true' : true;
  });

  const [simInput, setSimInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simActiveNodes, setSimActiveNodes] = useState<string[]>([]);
  const [simIndex, setSimIndex] = useState(0);

  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });
  const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoable = historyIndex > 0;
  const isRedoable = historyIndex < history.length - 1;

  const saveHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (nextHistory.length > 20) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  }, [history, historyIndex]);

  useEffect(() => {
    if (isBuilderOpen && history.length === 0) {
      const timer = setTimeout(() => saveHistory(builderNodes, builderEdges), 0);
      return () => clearTimeout(timer);
    }
  }, [isBuilderOpen, history.length, saveHistory, builderNodes, builderEdges]);

  useEffect(() => {
    const handleEditEdge = (e: Event) => {
      const id = (e as CustomEvent).detail;
      const edge = builderEdges.find(ed => ed.id === id);
      if (edge) setEditingLabel({ id, type: 'edge', current: edge.label as string });
    };
    const handleCtxEdge = (e: Event) => {
      const { id, x, y } = (e as CustomEvent).detail;
      setContextMenu({ type: 'edge', id, x, y });
    };
    window.addEventListener('edit-edge', handleEditEdge);
    window.addEventListener('ctx-edge', handleCtxEdge);
    return () => {
      window.removeEventListener('edit-edge', handleEditEdge);
      window.removeEventListener('ctx-edge', handleCtxEdge);
    };
  }, [builderEdges]);

  const handleUndo = useCallback(() => {
    if (!isUndoable) return;
    const prev = history[historyIndex - 1];
    setBuilderNodes(prev.nodes);
    setBuilderEdges(prev.edges);
    setHistoryIndex(historyIndex - 1);
  }, [isUndoable, history, historyIndex, setBuilderNodes, setBuilderEdges]);

  const handleRedo = useCallback(() => {
    if (!isRedoable) return;
    const next = history[historyIndex + 1];
    setBuilderNodes(next.nodes);
    setBuilderEdges(next.edges);
    setHistoryIndex(historyIndex + 1);
  }, [isRedoable, history, historyIndex, setBuilderNodes, setBuilderEdges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isBuilderOpen || confirmDialog.isOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') { 
        setContextMenu(null); 
        setEditingLabel(null); 
        setShowPresetMenu(false); 
        setShowJumpMenu(false); 
        setShowGridMenu(false);
        setConnectingNodeId(null);
      }
      if (e.key.toLowerCase() === 'f' && !e.ctrlKey) setIsFullscreen(prev => !prev);
      if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey && e.key.toLowerCase() === 'y') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')) { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBuilderOpen, handleUndo, handleRedo, confirmDialog.isOpen]);

  const getEpsilonClosure = useCallback((startNodes: string[], edges: Edge[]): string[] => {
    const closure = new Set<string>(startNodes);
    const stack = [...startNodes];
    while (stack.length > 0) {
      const curr = stack.pop()!;
      const epsEdges = edges.filter(e => e.source === curr && (e.label as string).trim() === 'ε');
      for (const e of epsEdges) {
        if (!closure.has(e.target)) {
          closure.add(e.target);
          stack.push(e.target);
        }
      }
    }
    return Array.from(closure);
  }, []);

  const startJflapSimulation = () => {
    const initNodes = builderNodes.filter(n => n.data.isInitial).map(n => n.id);
    if (initNodes.length === 0) {
      showToast(lang === 'id' ? 'Gagal: Tentukan Initial State (◉) terlebih dahulu!' : 'Failed: Set an Initial State (◉) first!', 'error');
      return;
    }
    if (!simInput.trim() && builderEdges.length > 0) {
      showToast(lang === 'id' ? 'Masukkan string uji terlebih dahulu!' : 'Enter a test string first!', 'warning');
      return;
    }
    
    const initialClosure = getEpsilonClosure(initNodes, builderEdges);
    setIsSimulating(true);
    setSimActiveNodes(initialClosure);
    setSimIndex(0);
    showToast(lang === 'id' ? 'Simulasi NFA Dimulai' : 'NFA Simulation Started', 'info');
  };

  const stopJflapSimulation = () => {
    setIsSimulating(false);
    setSimActiveNodes([]);
    setSimIndex(0);
  };

  const stepJflapSimulation = () => {
    if (simActiveNodes.length === 0) return;

    if (simIndex >= simInput.length) {
      const isAccepted = simActiveNodes.some(nodeId => {
        const node = builderNodes.find(n => n.id === nodeId);
        return node?.data.isFinal;
      });

      if (isAccepted) {
        showToast(lang === 'id' ? ' SUKSES: String DITERIMA (Accepted)!' : ' SUCCESS: String ACCEPTED!', 'success');
      } else {
        showToast(lang === 'id' ? ' GAGAL: String DITOLAK (Rejected) - Tidak berakhir di Final State!' : ' FAILED: String REJECTED - Did not end in Final State!', 'error');
      }
      stopJflapSimulation();
      return;
    }

    const char = simInput[simIndex];
    const nextStates = new Set<string>();

    for (const nodeId of simActiveNodes) {
      const outgoingEdges = builderEdges.filter(e => e.source === nodeId);
      for (const e of outgoingEdges) {
        const labels = (e.label as string).split(',').map(s => s.trim());
        if (labels.includes(char)) {
          nextStates.add(e.target);
        }
      }
    }

    if (nextStates.size === 0) {
      showToast(lang === 'id' ? ` DITOLAK: Jalur buntu pada karakter '${char}'!` : ` REJECTED: Dead end at character '${char}'!`, 'error');
      setSimActiveNodes([]);
      stopJflapSimulation();
      return;
    }

    const nextClosure = getEpsilonClosure(Array.from(nextStates), builderEdges);
    setSimActiveNodes(nextClosure);
    setSimIndex(prev => prev + 1);
  };

  const displayNodes = builderNodes.map(n => ({
    ...n,
    data: { 
      ...n.data, 
      isActive: simActiveNodes.includes(n.id),
      isConnecting: n.id === connectingNodeId 
    }
  }));

  const exportToPNG = useCallback(() => {
    if (flowRef.current === null) return;
    fitView({ padding: 0.2 });
    
    setTimeout(() => {
      toPng(flowRef.current!, { 
        backgroundColor: isDark ? '#080810' : '#f8fafc', 
        pixelRatio: 2,
        filter: (node) => {
          if (node.classList?.contains('download-exclude')) {
            return false;
          }
          return true;
        }
      })
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', `automata-${Date.now()}.png`);
          a.setAttribute('href', dataUrl);
          a.click();
          showToast(lang === 'id' ? 'Gambar berhasil diunduh!' : 'Image downloaded successfully!', 'success');
        })
        .catch(() => {
          showToast(lang === 'id' ? 'Gagal mengunduh gambar.' : 'Failed to download image.', 'error');
        });
    }, 500); 
  }, [fitView, showToast, lang, isDark]);

  const saveWorkspaceJSON = () => {
    const workspace = { nodes: builderNodes, edges: builderEdges };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspace, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `regex-workspace-${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(lang === 'id' ? 'Workspace berhasil disimpan!' : 'Workspace saved successfully!', 'success');
  };

  const loadWorkspaceJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (parsed.nodes && parsed.edges) {
          setBuilderNodes(parsed.nodes);
          setBuilderEdges(parsed.edges);
          saveHistory(parsed.nodes, parsed.edges);
          setGeneratedRegex('');
          setTimeout(() => fitView({ padding: 0.2 }), 100);
          showToast(lang === 'id' ? 'Workspace dimuat!' : 'Workspace loaded!', 'success');
        } else {
          throw new Error('Format JSON tidak valid');
        }
      } catch { 
        showToast(lang === 'id' ? 'Gagal: File JSON rusak atau tidak valid!' : 'Failed: Invalid JSON file!', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadPreset = (presetType: 'ends_ab' | 'even_0') => {
    stopJflapSimulation();
    setGeneratedRegex('');
    setShowPresetMenu(false);

    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];

    if (presetType === 'ends_ab') {
      newNodes = [
        { id: 'n0', type: 'state', position: { x: 100, y: 200 }, data: { label: 'q0', isInitial: true, isFinal: false } },
        { id: 'n1', type: 'state', position: { x: 300, y: 200 }, data: { label: 'q1', isInitial: false, isFinal: false } },
        { id: 'n2', type: 'state', position: { x: 500, y: 200 }, data: { label: 'q2', isInitial: false, isFinal: true } },
      ];
      newEdges = [
        { id: 'e0', source: 'n0', target: 'n0', label: 'a, b', type: 'animatedDraw', sourceHandle: 'top', targetHandle: 'top-t' },
        { id: 'e1', source: 'n0', target: 'n1', label: 'a', type: 'animatedDraw', sourceHandle: 'right', targetHandle: 'left-t' },
        { id: 'e2', source: 'n1', target: 'n2', label: 'b', type: 'animatedDraw', sourceHandle: 'right', targetHandle: 'left-t' },
      ];
    } else if (presetType === 'even_0') {
      newNodes = [
        { id: 'n0', type: 'state', position: { x: 150, y: 200 }, data: { label: 'q0', isInitial: true, isFinal: true } },
        { id: 'n1', type: 'state', position: { x: 400, y: 200 }, data: { label: 'q1', isInitial: false, isFinal: false } },
      ];
      newEdges = [
        { id: 'e0', source: 'n0', target: 'n1', label: '0', type: 'animatedDraw', sourceHandle: 'right', targetHandle: 'left-t' },
        { id: 'e1', source: 'n1', target: 'n0', label: '0', type: 'animatedDraw', sourceHandle: 'bottom', targetHandle: 'bottom-t' },
        { id: 'e2', source: 'n0', target: 'n0', label: '1', type: 'animatedDraw', sourceHandle: 'top', targetHandle: 'top-t' },
        { id: 'e3', source: 'n1', target: 'n1', label: '1', type: 'animatedDraw', sourceHandle: 'top', targetHandle: 'top-t' },
      ];
    }

    const processedNodes = newNodes.map((node, idx) => ({ ...node, data: { ...node.data, animationDelay: idx * 0.15 } }));
    const baseEdgeDelay = newNodes.length * 0.15 + 0.2;
    const processedEdges = newEdges.map((edge, idx) => ({ ...edge, type: 'animatedDraw', data: { animationDelay: baseEdgeDelay + (idx * 0.10) }, markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? '#8b5cf6' : '#7c3aed' } }));

    setBuilderNodes(processedNodes); setBuilderEdges(processedEdges); saveHistory(processedNodes, processedEdges);
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50); showToast(lang === 'id' ? 'Preset Berhasil Dimuat!' : 'Preset Loaded Successfully!', 'success');
  };

  const handleJumpToState = (nodeId: string) => {
    const node = builderNodes.find(n => n.id === nodeId);
    if (node) {
      fitView({
        nodes: [{ id: nodeId }],
        duration: 800,
        maxZoom: 1.5,
        padding: 0.5
      });
    }
    setShowJumpMenu(false);
  };

  const getNextNodeId = () => {
    const max = builderNodes.reduce((acc, node) => {
      const num = parseInt(node.data.label.replace('q', ''));
      return isNaN(num) ? acc : Math.max(acc, num);
    }, -1);
    return `q${max + 1}`;
  };

  const handleAddState = (pos?: { x: number, y: number }) => {
    const label = getNextNodeId();
    let x = 200, y = 200;
    
    if (pos) {
      x = pos.x; y = pos.y;
    } else if (builderNodes.length > 0) {
      const lastNode = builderNodes[builderNodes.length - 1];
      x = lastNode.position.x + 150;
      y = lastNode.position.y;
      if (x > 800) { x = 100; y += 150; }
    }

    const newNode: Node<StateNodeData> = {
      id: `node-${Date.now()}`,
      type: 'state',
      position: { x, y },
      data: { label, isInitial: builderNodes.length === 0, isFinal: false },
    };
    
    const newNodes = [...builderNodes, newNode as Node];
    setBuilderNodes(newNodes);
    saveHistory(newNodes, builderEdges);
  };

  const onNodeClick = useCallback((e: React.MouseEvent, node: Node) => {
    if (connectingNodeId) {
      const sourceNode = builderNodes.find(n => n.id === connectingNodeId);
      if (sourceNode) {
        const dx = node.position.x - sourceNode.position.x;
        const dy = node.position.y - sourceNode.position.y;
        
        let sHandle: string;
        let tHandle: string;

        if (sourceNode.id === node.id) {
          sHandle = 'top'; tHandle = 'top-t';
        } else if (Math.abs(dx) > Math.abs(dy)) {
          sHandle = dx > 0 ? 'right' : 'left';
          tHandle = dx > 0 ? 'left-t' : 'right-t';
        } else {
          sHandle = dy > 0 ? 'bottom' : 'top';
          tHandle = dy > 0 ? 'top-t' : 'bottom-t';
        }

        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: sourceNode.id,
          target: node.id,
          sourceHandle: sHandle,
          targetHandle: tHandle,
          label: '',
          type: 'animatedDraw',
          markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? '#8b5cf6' : '#7c3aed' },
          animated: true,
        };
        
        const newEdges = addEdge(newEdge, builderEdges);
        setBuilderEdges(newEdges);
        saveHistory(builderNodes, newEdges);
        setEditingLabel({ id: newEdge.id, type: 'edge', current: '' });
      }
      setConnectingNodeId(null);
    } else {
      setConnectingNodeId(node.id);
    }
  }, [connectingNodeId, builderNodes, builderEdges, isDark, setBuilderEdges, saveHistory]);

  const onPaneClick = useCallback(() => {
    if (connectingNodeId) setConnectingNodeId(null);
  }, [connectingNodeId]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setBuilderNodes((nds) => applyNodeChanges(changes, nds)), [setBuilderNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setBuilderEdges((eds) => applyEdgeChanges(changes, eds)), [setBuilderEdges]);

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    
    const sourceNode = builderNodes.find(n => n.id === connection.source);
    const targetNode = builderNodes.find(n => n.id === connection.target);
    
    let sHandle = connection.sourceHandle;
    let tHandle = connection.targetHandle;

    if (sourceNode && targetNode) {
      const dx = targetNode.position.x - sourceNode.position.x;
      const dy = targetNode.position.y - sourceNode.position.y;
      
      if (sourceNode.id === targetNode.id) {
        sHandle = 'top'; tHandle = 'top-t';
      } else {
        if (Math.abs(dx) > Math.abs(dy)) {
          sHandle = dx > 0 ? 'right' : 'left';
          tHandle = dx > 0 ? 'left-t' : 'right-t';
        } else {
          sHandle = dy > 0 ? 'bottom' : 'top';
          tHandle = dy > 0 ? 'top-t' : 'bottom-t';
        }
      }
    }

    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: sHandle || undefined,
      targetHandle: tHandle || undefined,
      label: '', 
      type: 'animatedDraw',
      markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? '#8b5cf6' : '#7c3aed' },
      animated: true,
    };
    
    const newEdges = addEdge(newEdge, builderEdges);
    setBuilderEdges(newEdges);
    saveHistory(builderNodes, newEdges);
    setEditingLabel({ id: newEdge.id, type: 'edge', current: '' });
  }, [builderEdges, builderNodes, setBuilderEdges, saveHistory, isDark]);

  const onNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => { e.preventDefault(); setContextMenu({ type: 'node', id: node.id, x: e.clientX, y: e.clientY }); }, []);
  const onPaneContextMenu = useCallback((e: React.MouseEvent) => { e.preventDefault(); setContextMenu({ type: 'pane', x: e.clientX, y: e.clientY }); }, []);

  const closeMenu = () => setContextMenu(null);

  const requestClearAll = () => {
    setConfirmDialog({
      isOpen: true,
      message: t.rbConfirmClear || (lang === 'id' ? 'Anda yakin ingin menghapus semua state dan transisi?' : 'Are you sure you want to clear all states and transitions?'),
      onConfirm: () => {
        setBuilderNodes([]); setBuilderEdges([]); setGeneratedRegex(''); stopJflapSimulation();
        setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  const performAction = (action: string) => {
    if (!contextMenu) return;
    const type = contextMenu.type;
    const id = 'id' in contextMenu ? contextMenu.id : '';
    let newNodes = [...builderNodes]; let newEdges = [...builderEdges];

    if (type === 'node') {
      if (action === 'rename') setEditingLabel({ id, type: 'node', current: newNodes.find(n => n.id === id)?.data.label });
      if (action === 'init') newNodes = newNodes.map(n => ({ ...n, data: { ...n.data, isInitial: n.id === id } }));
      if (action === 'final') newNodes = newNodes.map(n => n.id === id ? { ...n, data: { ...n.data, isFinal: !n.data.isFinal } } : n);
      if (action === 'delete') { newNodes = newNodes.filter(n => n.id !== id); newEdges = newEdges.filter(e => e.source !== id && e.target !== id); }
    } else if (type === 'edge') {
      if (action === 'edit') setEditingLabel({ id, type: 'edge', current: newEdges.find(e => e.id === id)?.label as string });
      if (action === 'delete') newEdges = newEdges.filter(e => e.id !== id);
    } else if (type === 'pane') {
      if (action === 'add') { const flowPos = project({ x: contextMenu.x, y: contextMenu.y }); handleAddState(flowPos); closeMenu(); return; }
      if (action === 'layout') { autoLayout(); closeMenu(); return; }
      if (action === 'clear') { closeMenu(); requestClearAll(); return; }
    }

    setBuilderNodes(newNodes); setBuilderEdges(newEdges); saveHistory(newNodes, newEdges); closeMenu();
  };

  const autoLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR', marginx: 50, marginy: 50 });
    g.setDefaultEdgeLabel(() => ({}));
    builderNodes.forEach((n) => g.setNode(n.id, { width: NODE_SIZE + 50, height: NODE_SIZE + 50 }));
    builderEdges.forEach((e) => g.setEdge(e.source, e.target));
    dagre.layout(g);
    const layoutedNodes = builderNodes.map((node) => {
      const nodeWithPos = g.node(node.id);
      return { ...node, position: { x: nodeWithPos.x - NODE_SIZE/2, y: nodeWithPos.y - NODE_SIZE/2 } };
    });
    setBuilderNodes(layoutedNodes); saveHistory(layoutedNodes, builderEdges); setTimeout(() => fitView({ padding: 0.2 }), 100);
  };

  const handleSaveLabel = (val: string) => {
    if (!editingLabel) return;
    if (editingLabel.type === 'node') {
      const newNodes = builderNodes.map(n => n.id === editingLabel.id ? { ...n, data: { ...n.data, label: val } } : n);
      setBuilderNodes(newNodes); saveHistory(newNodes, builderEdges);
    } else {
      const newEdges = builderEdges.map(e => e.id === editingLabel.id ? { ...e, label: val, animated: false } : e);
      setBuilderEdges(newEdges); saveHistory(builderNodes, newEdges);
    }
    setEditingLabel(null);
  };

  const getStatus = (): BuilderStatus => {
    if (builderNodes.length === 0) return { msg: lang === 'id' ? 'Kanvas Kosong' : 'Empty Canvas', color: 'bg-slate-500', icon: '' };
    if (!builderNodes.some(n => n.data.isInitial)) return { msg: lang === 'id' ? 'Belum ada Initial State' : 'Missing Initial State', color: 'bg-amber-500 text-amber-950', icon: '' };
    if (!builderNodes.some(n => n.data.isFinal)) return { msg: lang === 'id' ? 'Belum ada Final State' : 'Missing Final State', color: 'bg-amber-500 text-amber-950', icon: '' };
    if (builderEdges.some(e => !e.label || (e.label as string).trim() === '')) return { msg: lang === 'id' ? 'Ada transisi tanpa label' : 'Missing Transition Label', color: 'bg-pink-500 text-white', icon: '' };
    return { msg: lang === 'id' ? 'Automata Valid' : 'Valid Automata', color: 'bg-emerald-500 text-white', icon: '' };
  };
  
  const status: BuilderStatus = getStatus();

  const handleGenerate = () => {
    try {
      const processedEdges: Edge[] = [];
      builderEdges.forEach(e => {
        const lbls = (e.label as string).split(',').map(s => s.trim()).filter(s => s !== '');
        if (lbls.length === 0) processedEdges.push(e);
        else {
          lbls.forEach((lbl, idx) => { processedEdges.push({ ...e, id: `${e.id}-${idx}`, label: lbl }); });
        }
      });
      const regex = dfaToRegex(builderNodes, processedEdges);
      if (!regex || regex === '') {
        showToast(lang === 'id' ? 'Gagal: Tidak ada jalur yang menyambungkan Initial ke Final State!' : 'Failed: No path connecting Initial to Final State!', 'error');
        setGeneratedRegex('∅');
      } else { setGeneratedRegex(regex); }
    } catch (e: unknown) { showToast((t as Record<string, string>)[(e as Error).message] || (e as Error).message, 'error'); }
  };

  return (
    <div className={`flex flex-col w-full overflow-hidden transition-all duration-300
      ${isFullscreen ? 'fixed inset-0 z-[400] rounded-none' : 'relative h-[85vh] rounded-2xl shadow-2xl'}
      ${isDark ? 'bg-[#080810] border border-white/10 shadow-black/50' : 'bg-slate-50 border border-slate-200'}`}>
      
      <div className={`flex justify-between items-center px-4 py-3 border-b ${isDark ? 'border-white/5 bg-[#080810]' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <CircleDot className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} /> {t.rbTitle}
          </h2>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${status.color}`}>
            <span>{status.icon}</span> {status.msg}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsFullscreen(!isFullscreen)} title={lang === 'id' ? "Layar Penuh (F)" : "Fullscreen (F)"} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button onClick={toggleBuilder} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-pink-500/20 hover:text-pink-400 text-slate-400' : 'hover:bg-pink-50 hover:text-pink-600 text-slate-600'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-48 border-r p-3 flex flex-col gap-2 z-10 overflow-y-auto custom-scrollbar ${isDark ? 'bg-[#080810] border-white/5' : 'bg-white border-slate-200'}`}>
          <button onClick={() => handleAddState()} className={`flex items-center gap-2 p-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95 ${isDark ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}>
            <PlusCircle className="w-4 h-4" /> {t.rbAddState || (lang === 'id' ? '+ State' : '+ State')}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowPresetMenu(!showPresetMenu)} 
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-violet-400' : 'bg-slate-100 hover:bg-slate-200 text-violet-600'}`}
            >
              <Sparkles className="w-4 h-4" /> Load Example
            </button>
            <AnimatePresence>
              {showPresetMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPresetMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className={`absolute left-0 top-full mt-1 w-full border rounded-xl shadow-xl z-20 overflow-hidden text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-[#080810] border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    <button onClick={() => handleLoadPreset('ends_ab')} className={`w-full text-left px-3 py-2.5 transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                      {lang === 'id' ? 'Akhiran "ab"' : 'Ends with "ab"'}
                    </button>
                    <button onClick={() => handleLoadPreset('even_0')} className={`w-full text-left px-3 py-2.5 transition-colors border-t ${isDark ? 'hover:bg-white/5 text-slate-300 border-white/5' : 'hover:bg-slate-50 text-slate-700 border-slate-100'}`}>
                      {lang === 'id' ? 'Jumlah 0 Genap' : 'Even 0s'}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className={`my-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`} />
          
          <button onClick={handleUndo} disabled={!isUndoable} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <Undo2 className="w-4 h-4" /> {lang === 'id' ? 'Batal' : 'Undo'}
          </button>
          <button onClick={handleRedo} disabled={!isRedoable} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <Redo2 className="w-4 h-4" /> {lang === 'id' ? 'Ulangi' : 'Redo'}
          </button>

          <div className={`my-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`} />

          <button onClick={autoLayout} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <LayoutGrid className="w-4 h-4" /> {lang === 'id' ? 'Layout' : 'Layout'}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowGridMenu(!showGridMenu)} 
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <Grid3X3 className="w-4 h-4" /> {lang === 'id' ? 'Kanvas & Grid' : 'Canvas & Grid'}
            </button>
            <AnimatePresence>
              {showGridMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowGridMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className={`absolute left-0 top-full mt-1 w-full border rounded-xl shadow-xl z-20 overflow-hidden text-xs font-bold tracking-wider ${isDark ? 'bg-[#080810] border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    <button 
                      onClick={() => setShowGrid(!showGrid)} 
                      className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors uppercase ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      {lang === 'id' ? 'Tampilkan Grid' : 'Show Grid'}
                      {showGrid && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </button>
                    <div className={`border-t my-1 ${isDark ? 'border-white/5' : 'border-slate-100'}`} />
                    {[ { label: lang === 'id' ? 'Halus (10px)' : 'Fine (10px)', value: 10 },
                       { label: lang === 'id' ? 'Normal (20px)' : 'Normal (20px)', value: 20 },
                       { label: lang === 'id' ? 'Kasar (40px)' : 'Coarse (40px)', value: 40 }
                    ].map(opt => (
                      <button 
                        key={opt.value}
                        onClick={() => { setGridSize(opt.value); setShowGridMenu(false); }} 
                        className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors uppercase ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {opt.label}
                        {gridSize === opt.value && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => fitView({ padding: 0.2, duration: 800 })} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <Maximize2 className="w-4 h-4" /> {lang === 'id' ? 'Fit View' : 'Fit View'}
          </button>
          <button onClick={() => setShowMinimap(!showMinimap)} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${showMinimap ? (isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-50 text-violet-600') : (isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600')}`}>
            <Map className="w-4 h-4" /> {lang === 'id' ? 'Peta Mini' : 'Mini Map'}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowJumpMenu(!showJumpMenu)} 
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <Crosshair className="w-4 h-4" /> {lang === 'id' ? 'Lompat ke...' : 'Jump to...'}
            </button>
            <AnimatePresence>
              {showJumpMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowJumpMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className={`absolute left-0 top-full mt-1 w-full border rounded-xl shadow-xl z-20 overflow-hidden text-xs font-bold uppercase tracking-wider max-h-40 overflow-y-auto custom-scrollbar ${isDark ? 'bg-[#080810] border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    {builderNodes.length === 0 ? (
                      <div className={`px-3 py-2.5 opacity-50 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang === 'id' ? 'Kosong' : 'Empty'}
                      </div>
                    ) : (
                      builderNodes.map((n, idx) => (
                        <button 
                          key={n.id} 
                          onClick={() => handleJumpToState(n.id)} 
                          className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${idx !== 0 ? (isDark ? 'border-t border-white/5' : 'border-t border-slate-100') : ''} ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          <span>State {n.data.label}</span>
                          {n.data.isInitial && <span className="text-[9px] bg-sky-500/20 text-sky-500 px-1.5 py-0.5 rounded font-black">IN</span>}
                          {n.data.isFinal && <span className="text-[9px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-black">FI</span>}
                        </button>
                      ))
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className={`my-2 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`} />
          
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lang === 'id' ? 'Berkas & Ekspor' : 'File & Export'}
          </div>
          <button onClick={saveWorkspaceJSON} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <Save className="w-4 h-4" /> {lang === 'id' ? 'Simpan JSON' : 'Save JSON'}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <Upload className="w-4 h-4" /> {lang === 'id' ? 'Muat JSON' : 'Load JSON'}
          </button>
          <input type="file" accept=".json" ref={fileInputRef} onChange={loadWorkspaceJSON} className="hidden" />
          
          <button onClick={exportToPNG} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}>
            <ImageIcon className="w-4 h-4" /> {lang === 'id' ? 'Ekspor PNG' : 'Export PNG'}
          </button>

          <div className="mt-auto flex flex-col gap-2">
            <div className={`my-1 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`} />
            <button onClick={requestClearAll} 
              className={`flex items-center gap-2 p-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'hover:bg-pink-500/10 text-pink-500' : 'hover:bg-pink-50 text-pink-600'}`}>
              <Trash2 className="w-4 h-4" /> {t.rbClearAll || (lang === 'id' ? 'Hapus Semua' : 'Clear All')}
            </button>
          </div>
        </div>

        <div className={`flex-1 relative ${isDark ? 'bg-[#080810]' : 'bg-slate-50'}`} ref={flowRef}>
          
          <AnimatePresence>
            {connectingNodeId && (
               <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-20, opacity:0}} 
                  className="absolute top-20 left-1/2 -translate-x-1/2 bg-sky-600 border-2 border-sky-400 text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] z-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2 pointer-events-none download-exclude">
                  <MousePointerClick className="w-4 h-4 animate-bounce" /> {lang === 'id' ? 'Pilih State Target...' : 'Select Target State...'}
               </motion.div>
            )}
          </AnimatePresence>

          <div className={`absolute top-4 right-4 z-20 p-4 backdrop-blur-xl border rounded-2xl shadow-xl flex items-center gap-3 max-w-md download-exclude ${isDark ? 'bg-[#080810]/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            {!isSimulating ? (
              <>
                <div className="relative group">
                  <button className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-colors cursor-help" aria-label="Petunjuk Simulasi">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-30 border text-xs leading-relaxed bg-[#080810]/95 backdrop-blur-md border-white/10 text-slate-300 dark:text-slate-300" style={{ backgroundColor: isDark ? 'rgba(8,8,16,0.95)' : 'rgba(255,255,255,0.98)' }}>
                    <div className="font-bold text-amber-500 mb-1 flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
                      <HelpCircle className="w-3 h-3" /> Info Simulasi
                    </div>
                    {lang === 'id' 
                      ? 'Masukkan string uji (contoh: aabb) untuk mensimulasikan apakah graf automata buatanmu dapat menerimanya (Accept) atau menolaknya (Reject).'
                      : 'Enter a test string (e.g., aabb) to simulate whether your custom automata graph accepts or rejects it.'
                    }
                  </div>
                </div>

                <div className="flex flex-col">
                  <input 
                    type="text" 
                    placeholder={lang === 'id' ? "String uji (ex: aabb)..." : "Test string (ex: aabb)..."}
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm outline-none border focus:border-amber-500 font-mono w-44 ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-slate-100 border-transparent text-slate-900'}`}
                  />
                </div>
                <button 
                  onClick={startJflapSimulation}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 whitespace-nowrap"
                >
                  {lang === 'id' ? 'Simulasikan NFA' : 'Simulate NFA'}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`flex items-center px-3 py-1.5 rounded-xl font-mono text-sm tracking-widest ${isDark ? 'bg-black/50' : 'bg-slate-100'}`}>
                  <span className={`line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{simInput.substring(0, simIndex)}</span>
                  <span className="text-amber-500 font-extrabold text-base scale-110 underline animate-bounce px-0.5">{simInput[simIndex] || ''}</span>
                  <span className={isDark ? 'text-white' : 'text-slate-800'}>{simInput.substring(simIndex + 1)}</span>
                </div>
                <button onClick={stepJflapSimulation} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow transition-transform active:scale-95" title={lang === 'id' ? 'Maju 1 Langkah' : 'Step Forward'}>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={stopJflapSimulation} className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow transition-transform active:scale-95" title={lang === 'id' ? 'Berhenti' : 'Stop Simulation'}>
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </div>
            )}
          </div>

          <ReactFlow 
            nodes={displayNodes} 
            edges={builderEdges} 
            nodeTypes={nodeTypes} 
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onConnect={onConnect} 
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            onNodeDoubleClick={(_event, node) => setEditingLabel({ id: node.id, type: 'node', current: node.data.label })}
            connectionMode={ConnectionMode.Loose}
            snapToGrid={true}
            snapGrid={[gridSize, gridSize]}
            minZoom={0.3}
            maxZoom={2.0}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{ type: 'animatedDraw' }}
          >
            {showGrid && <Background color={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} gap={gridSize} size={2} variant={BackgroundVariant.Dots} />}
            <Controls className={`border-none shadow-lg download-exclude ${isDark ? 'bg-[#1a1a2e] fill-white' : 'bg-white fill-slate-800'}`} />
            {showMinimap && (
              <MiniMap 
                className={`rounded-xl shadow-xl download-exclude ${isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border-slate-200'}`} 
                maskColor={isDark ? 'rgba(0,0,0,0.4)' : 'rgba(240,240,240,0.4)'}
                nodeColor={(n) => {
                  if (n.data?.isConnecting) return '#0ea5e9';
                  if (n.data?.isActive) return '#f59e0b';
                  if (n.data?.isFinal) return '#10b981';
                  return isDark ? '#8b5cf6' : '#7c3aed';
                }}
                nodeStrokeColor={isDark ? '#1a1a2e' : '#ffffff'}
                nodeStrokeWidth={2}
              />
            )}
          </ReactFlow>

          <AnimatePresence>
            {editingLabel && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} 
                className={`absolute top-6 left-1/2 -translate-x-1/2 p-3 border-2 rounded-xl shadow-2xl z-[100] flex flex-col gap-2 download-exclude ${isDark ? 'bg-[#080810] border-violet-500' : 'bg-white border-violet-500'}`}>
                <div className="text-xs font-bold text-slate-500 uppercase">
                  {editingLabel.type === 'node' ? (lang === 'id' ? 'Ubah Nama State' : 'Rename State') : (lang === 'id' ? 'Edit Transisi' : 'Edit Transition')}
                </div>
                <div className="flex gap-2">
                  <input autoFocus type="text" defaultValue={editingLabel.current} placeholder={editingLabel.type === 'edge' ? "a, b atau ε" : "q0"}
                    className={`w-36 px-3 py-1.5 rounded-lg border outline-none font-mono ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-violet-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-violet-500'}`}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveLabel(e.currentTarget.value)} />
                  <button onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleSaveLabel(input.value);
                  }} className="px-4 py-1.5 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-500">OK</button>
                </div>
                {editingLabel.type === 'edge' && (
                  <button onClick={() => handleSaveLabel(editingLabel.current ? `${editingLabel.current}, ε` : 'ε')} className="text-xs text-left text-violet-500 hover:underline font-bold">
                    {lang === 'id' ? 'Tambahkan Epsilon (ε)' : 'Add Epsilon (ε)'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {confirmDialog.isOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={`w-full max-w-sm border rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center ${isDark ? 'bg-[#080810] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                    <AlertTriangle className={`w-7 h-7 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                  </div>
                  <h3 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang === 'id' ? 'Konfirmasi Hapus' : 'Confirm Clear'}</h3>
                  <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{confirmDialog.message}</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} })} className={`flex-1 py-2.5 rounded-xl font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>{lang === 'id' ? 'Batal' : 'Cancel'}</button>
                    <button onClick={confirmDialog.onConfirm} className="flex-1 py-2.5 rounded-xl font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors">{lang === 'id' ? 'Hapus Semua' : 'Clear All'}</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {contextMenu && (
            <div className={`fixed z-[999] border rounded-lg shadow-2xl py-1 min-w-[160px] ${isDark ? 'bg-[#080810] border-white/10' : 'bg-white border-slate-200'}`} style={{ top: contextMenu.y, left: contextMenu.x }}>
              {contextMenu.type === 'node' && (
                <>
                  <button onClick={() => performAction('rename')} className={`w-full text-left px-4 py-2 text-sm font-medium ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>✏️ {lang === 'id' ? 'Ubah Nama' : 'Rename'}</button>
                  <button onClick={() => performAction('init')} className={`w-full text-left px-4 py-2 text-sm font-medium ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>◉ {lang === 'id' ? 'Jadikan Awal' : 'Set Initial'}</button>
                  <button onClick={() => performAction('final')} className={`w-full text-left px-4 py-2 text-sm font-medium ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>◎ {lang === 'id' ? 'Jadikan Akhir' : 'Toggle Final'}</button>
                  <div className={`border-t my-1 ${isDark ? 'border-white/5' : 'border-slate-100'}`}></div>
                  <button onClick={() => performAction('delete')} className={`w-full text-left px-4 py-2 text-sm font-bold ${isDark ? 'hover:bg-pink-500/20 text-pink-400' : 'hover:bg-pink-50 text-pink-600'}`}>🗑️ {lang === 'id' ? 'Hapus' : 'Delete'}</button>
                </>
              )}
              {contextMenu.type === 'edge' && (
                <>
                  <button onClick={() => performAction('edit')} className={`w-full text-left px-4 py-2 text-sm font-medium ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>✏️ {lang === 'id' ? 'Ubah Label' : 'Edit Label'}</button>
                  <div className={`border-t my-1 ${isDark ? 'border-white/5' : 'border-slate-100'}`}></div>
                  <button onClick={() => performAction('delete')} className={`w-full text-left px-4 py-2 text-sm font-bold ${isDark ? 'hover:bg-pink-500/20 text-pink-400' : 'hover:bg-pink-50 text-pink-600'}`}>🗑️ {lang === 'id' ? 'Hapus' : 'Delete'}</button>
                </>
              )}
              {contextMenu.type === 'pane' && (
                <>
                  <button onClick={() => performAction('add')} className={`w-full text-left px-4 py-2 text-sm font-medium ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>➕ {lang === 'id' ? 'Tambah State' : 'Add State Here'}</button>
                  <button onClick={() => performAction('layout')} className={`w-full text-left px-4 py-2 text-sm font-medium ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>📐 {lang === 'id' ? 'Rapihkan Layout' : 'Auto Layout'}</button>
                  <div className={`border-t my-1 ${isDark ? 'border-white/5' : 'border-slate-100'}`}></div>
                  <button onClick={() => performAction('clear')} className={`w-full text-left px-4 py-2 text-sm font-bold ${isDark ? 'hover:bg-pink-500/20 text-pink-400' : 'hover:bg-pink-50 text-pink-600'}`}>🧹 {t.rbClearAll || (lang === 'id' ? 'Hapus Semua' : 'Clear All')}</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`border-t p-4 flex flex-col sm:flex-row items-center gap-4 z-10 ${isDark ? 'border-white/5 bg-[#080810]' : 'border-slate-200 bg-white'}`}>
        <button onClick={handleGenerate} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 shadow-violet-500/20">
          <Play className="w-5 h-5 fill-current" /> {t.rbGenerate?.toUpperCase() || (lang === 'id' ? 'BUAT REGEX' : 'GENERATE REGEX')}
        </button>
        <div className="flex-1 flex gap-2 w-full">
          <input type="text" readOnly value={generatedRegex} placeholder={t.rbPlaceholder || (lang === 'id' ? 'Buat automata di atas lalu klik Generate Regex' : 'Build automata above then click Generate Regex')} 
            className={`flex-1 px-4 py-3 rounded-xl border-2 font-mono text-lg font-bold outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-violet-400 focus:border-violet-500' : 'bg-slate-50 border-slate-200 text-violet-600 focus:border-violet-500'}`} />
          <button onClick={() => { navigator.clipboard.writeText(generatedRegex); showToast(t.toastCopied || (lang === 'id' ? 'Disalin!' : 'Copied!'), 'success'); }} disabled={!generatedRegex} 
            className={`p-3 rounded-xl transition-colors disabled:opacity-50 border ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-slate-100 hover:bg-slate-200 border-transparent'}`} title={t.rbCopy || (lang === 'id' ? 'Salin' : 'Copy')}>
            <Copy className={`w-6 h-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
          </button>
          <button onClick={() => {
            if (!generatedRegex || generatedRegex === '∅') return;
            toggleBuilder();
            window.location.href = `/?regex=${encodeURIComponent(generatedRegex)}`;
          }} disabled={!generatedRegex || generatedRegex === '∅'} 
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-sky-500/20">
            {t.rbSendToVis || (lang === 'id' ? 'Kirim ke Visualizer' : 'Send to Visualizer')} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegexBuilder = () => {
  const { isBuilderOpen } = useStore();
  if (!isBuilderOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-7xl h-full flex flex-col justify-center">
        <ReactFlowProvider>
          <RegexBuilderInner />
        </ReactFlowProvider>
      </motion.div>
    </div>
  );
};