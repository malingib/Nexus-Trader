import React, { useState } from 'react';
import { Signal } from '../types';
import { analyzeSignalWithGemini } from '../services/geminiService';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Bot, 
  MessageSquare, 
  User, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  Cpu,
  Loader2,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  accountsCount: number;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, onApprove, onReject, accountsCount }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(signal.aiAnalysis || null);
  const [copied, setCopied] = useState(false);

  const handleAnalysis = async () => {
    if (analysis) return; // Already analyzed
    setIsAnalyzing(true);
    try {
      await analyzeSignalWithGemini(signal, (streamedText) => {
        setAnalysis(streamedText);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(`${signal.side} ${signal.instrument} @ ${signal.price} SL: ${signal.stop_loss} TP: ${signal.take_profit}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const isBuy = signal.side === 'BUY';
  const risk = Math.abs(signal.price - signal.stop_loss);
  const reward = Math.abs(signal.take_profit - signal.price);
  const rrRatio = (reward / risk).toFixed(2);
  const estLotSize = (0.5 * (signal.confidence)).toFixed(2);

  return (
    <div className="glass-card rounded-3xl p-6 transition-all duration-300 hover:border-purple-500/30 group relative border border-white/5">
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 relative z-10">
        
        {/* Header Left */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${isBuy ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 shadow-rose-500/20 border border-rose-500/20'}`}>
             {isBuy ? <ArrowUpCircle size={28} /> : <ArrowDownCircle size={28} />}
          </div>
          <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">{signal.instrument}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border tracking-wider ${isBuy ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-rose-500/30 text-rose-400 bg-rose-500/5'}`}>
                    {signal.side}
                </span>
              </div>
              <span className="text-gray-400 text-sm font-mono flex items-center gap-2 mt-1">
                  Entry @ <span className="text-white font-bold">{signal.price}</span>
                  <button onClick={handleCopy} className="text-gray-600 hover:text-white transition-colors p-1" title="Copy Signal">
                      {copied ? <Check size={12} className="text-emerald-500"/> : <Copy size={12}/>}
                  </button>
              </span>
          </div>
        </div>
        
        {/* Header Right */}
        <div className="flex items-center gap-4 self-end md:self-center">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Confidence</span>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_#a855f7]" style={{ width: `${signal.confidence * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-purple-300">{(signal.confidence * 100).toFixed(0)}%</span>
                </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 shadow-inner">
                {signal.source === 'AI_MODEL' && <Bot size={22} className="text-purple-400"/>}
                {signal.source === 'TELEGRAM_PARSER' && <MessageSquare size={22} className="text-blue-400"/>}
                {signal.source === 'MANUAL_ENTRY' && <User size={22} className="text-orange-400"/>}
            </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
        <DataPoint label="Target (TP)" value={signal.take_profit} color="text-emerald-400" />
        <DataPoint label="Stop Loss (SL)" value={signal.stop_loss} color="text-rose-400" />
        <DataPoint label="Risk Ratio" value={`1:${rrRatio}`} color="text-gray-300" />
        <DataPoint label="Size/Acc" value={`${estLotSize} L`} color="text-blue-300" />
      </div>

      {/* AI Analysis Section */}
      <div className="bg-[#0a0a0e]/40 rounded-2xl p-5 mb-6 border border-white/5 relative overflow-hidden transition-colors hover:bg-[#0a0a0e]/60">
         <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex justify-between items-center mb-3 relative z-10">
            <h4 className="text-xs font-bold text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                <Cpu size={14} className="text-purple-500" /> AI Risk Assessment
            </h4>
            {!analysis && !isAnalyzing && (
                <button 
                    onClick={handleAnalysis}
                    className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center gap-1 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                    Run Analysis <ChevronRight size={12}/>
                </button>
            )}
        </div>
        
        {isAnalyzing && (
            <div className="flex items-center gap-3 text-gray-400 text-xs py-2">
                <Loader2 size={16} className="animate-spin text-purple-500" /> 
                <span className="animate-pulse">Analyzing market structure and volume profile...</span>
            </div>
        )}

        {analysis && (
            <div className="text-xs text-gray-300 leading-relaxed font-mono whitespace-pre-wrap relative z-10 border-l-2 border-purple-500/30 pl-3 animate-in fade-in">
                {analysis}
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-10">
        {signal.status === 'AWAITING_APPROVAL' && (
            <div className="flex gap-3">
            <button 
                onClick={() => onApprove(signal.id)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0"
            >
                <CheckCircle size={18} /> Approve Signal
            </button>
            <button 
                onClick={() => onReject(signal.id)}
                className="flex-1 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold"
            >
                <XCircle size={18} /> Reject
            </button>
            </div>
        )}

        {signal.status === 'PENDING_RISK' && (
            <div className="w-full bg-orange-500/10 text-orange-400 py-3 rounded-xl flex items-center justify-center gap-2 text-sm border border-orange-500/20 font-medium animate-pulse">
                <ShieldAlert size={18} /> Validating Risk Parameters...
            </div>
        )}

        {signal.status === 'EXECUTED' && (
            <div className="w-full bg-blue-500/10 text-blue-400 py-3 rounded-xl flex items-center justify-center gap-2 text-sm border border-blue-500/20 font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <CheckCircle size={18} /> Executed Across {accountsCount} Accounts
            </div>
        )}
      </div>
    </div>
  );
};

const DataPoint = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
    <div className="p-3.5 rounded-2xl bg-[#0a0a0e]/40 border border-white/5 flex flex-col items-center text-center hover:bg-[#0a0a0e]/60 transition-colors">
        <span className="block text-gray-500 text-[10px] uppercase tracking-wider mb-1 font-bold">{label}</span>
        <span className={`font-mono text-lg font-bold ${color}`}>{value}</span>
    </div>
);

export default SignalCard;