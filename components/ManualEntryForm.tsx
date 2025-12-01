import React, { useState } from 'react';
import { Signal, SignalSide } from '../types';
import { PlusCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface ManualEntryFormProps {
  onSubmit: (signal: Partial<Signal>) => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSubmit }) => {
  const [instrument, setInstrument] = useState('XAU/USD');
  const [side, setSide] = useState<SignalSide>('BUY');
  const [price, setPrice] = useState<number>(2000);
  const [tp, setTp] = useState<number>(2020);
  const [sl, setSl] = useState<number>(1990);
  const [confidence, setConfidence] = useState<number>(0.85);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSignal: Partial<Signal> = {
      source: 'MANUAL_ENTRY',
      instrument,
      side,
      price: Number(price),
      take_profit: Number(tp),
      stop_loss: Number(sl),
      confidence: Number(confidence),
      status: 'AWAITING_APPROVAL',
      metadata: { raw_text: 'Manual entry via Operator UI' }
    };
    onSubmit(newSignal);
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-purple-900/30">
            <PlusCircle size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">Create Signal</h2>
            <p className="text-gray-400 text-sm">Manual override for orchestrator execution</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instrument</label>
            <input 
              type="text" 
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full bg-transparent border-b border-gray-700 py-3 text-xl font-bold text-white focus:border-primary focus:outline-none transition-colors placeholder-gray-700"
              placeholder="e.g. BTC/USD"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Direction</label>
            <div className="flex bg-[#0a0a0e] p-1 rounded-xl border border-white/5">
              <button 
                type="button"
                onClick={() => setSide('BUY')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${side === 'BUY' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                BUY
              </button>
              <button 
                type="button"
                onClick={() => setSide('SELL')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${side === 'SELL' ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                SELL
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entry Price</label>
            <div className="relative">
                <span className="absolute left-0 top-3 text-gray-600">$</span>
                <input 
                type="number" 
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-transparent border-b border-gray-700 py-3 pl-4 text-xl font-mono font-bold text-white focus:border-primary focus:outline-none transition-colors"
                />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confidence</label>
            <input 
              type="range" 
              max="1"
              min="0"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>Low</span>
                <span className="text-purple-400 font-bold">{(confidence * 100).toFixed(0)}%</span>
                <span>High</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Take Profit</label>
            <div className="relative">
                 <input 
                type="number" 
                step="0.01"
                value={tp}
                onChange={(e) => setTp(Number(e.target.value))}
                className="w-full bg-emerald-500/5 border-b border-emerald-500/30 py-3 px-3 text-xl font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none transition-colors rounded-t-lg"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-500 uppercase tracking-wider">Stop Loss</label>
             <div className="relative">
                <input 
                type="number" 
                step="0.01"
                value={sl}
                onChange={(e) => setSl(Number(e.target.value))}
                className="w-full bg-rose-500/5 border-b border-rose-500/30 py-3 px-3 text-xl font-mono font-bold text-rose-400 focus:border-rose-500 focus:outline-none transition-colors rounded-t-lg"
                />
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start">
            <AlertTriangle className="text-blue-400 shrink-0 mt-1" size={18} />
            <p className="text-sm text-blue-200/80 leading-relaxed">
                <strong className="text-blue-200">Validation Active:</strong> This signal will pass through the unified bus. Significant deviations from the aggregate market feed may result in auto-rejection.
            </p>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 group"
        >
          <span>Inject Signal</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/>
        </button>
      </form>
    </div>
  );
};

export default ManualEntryForm;