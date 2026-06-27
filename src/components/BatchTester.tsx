import { useState } from 'react';
import { Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { simulateDFA } from '../algorithms/simulateDFA';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

export const BatchTester = () => {
  const { dfa, lang, theme } = useStore();
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<Array<{ input: string; accepted: boolean; path: string[] }>>([]);
  const t = lang === 'id' ? id : en;
  const isDark = theme === 'dark';

  if (!dfa) return null;

  const handleBatchTest = () => {
    const strings = batchInput.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const results = strings.map(str => {
      const res = simulateDFA(dfa, str);
      return { input: str, ...res };
    });
    setBatchResults(results);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "String,Status,Path\n"
      + batchResults.map(r => `${r.input},${r.accepted ? 'Accepted' : 'Rejected'},"${r.path.join(' -> ')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "batch_test_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full">
      <p className={`text-xs font-medium mb-4 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.batchDesc}</p>
      <textarea
        value={batchInput}
        onChange={(e) => setBatchInput(e.target.value)}
        placeholder={t.batchPlaceholder}
        className={`w-full h-32 px-4 py-3 text-sm rounded-xl outline-none font-mono resize-none mb-4 border transition-all ${
          isDark 
            ? 'bg-black/40 border-white/10 text-white placeholder:text-slate-700 focus:border-violet-500' 
            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-violet-500 focus:bg-white'
        }`}
      />
      <div className="flex gap-2 mb-6">
        <button onClick={handleBatchTest} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all border active:scale-95 ${
          isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
        }`}>
          {t.btnTest}
        </button>
        {batchResults.length > 0 && (
          <button onClick={exportCSV} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20" title={t.btnExportCsv}>
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {batchResults.length > 0 && (
        <div className={`flex-1 overflow-auto custom-scrollbar border rounded-xl ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200'}`}>
          <table className="w-full text-xs text-left border-collapse">
            <thead className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-[#080810]/90 text-slate-500' : 'bg-slate-50 text-slate-500'}`}>
              <tr>
                <th className="px-4 py-3 border-b font-black uppercase tracking-widest text-[10px]">String</th>
                <th className="px-4 py-3 border-b font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-4 py-3 border-b font-black uppercase tracking-widest text-[10px]">Path</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              {batchResults.map((res, idx) => (
                <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3 font-mono font-bold text-violet-400">{res.input}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter border ${
                      res.accepted 
                        ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-700') 
                        : (isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-pink-100 border-pink-200 text-pink-700')
                    }`}>
                      {res.accepted ? 'Accepted' : 'Rejected'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-mono text-[10px] truncate max-w-[120px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`} title={res.path.join(' → ')}>
                    {res.path.join(' → ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};