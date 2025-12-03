
import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Currency } from '../types';
import { EXCHANGE_RATE_KES } from '../services/mockData';

interface TradeHistoryProps {
  currency: Currency;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ currency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Extended Mock History Data
  const historyData = [
    { id: 't-1092', time: '2025-05-15 14:23:05', sym: 'XAUUSD', type: 'BUY', vol: '1.50', entry: '2405.10', exit: '2408.10', pl: 450.00, status: 'CLOSED', commission: -5.00, swap: 0 },
    { id: 't-1091', time: '2025-05-15 12:05:11', sym: 'EURUSD', type: 'SELL', vol: '2.00', entry: '1.0965', exit: '1.0959', pl: 120.00, status: 'CLOSED', commission: -4.00, swap: 0 },
    { id: 't-1090', time: '2025-05-15 11:45:30', sym: 'BTCUSD', type: 'BUY', vol: '0.10', entry: '64,200', exit: '64,145', pl: -55.00, status: 'CLOSED', commission: -2.50, swap: -1.20 },
    { id: 't-1089', time: '2025-05-15 10:12:00', sym: 'US30', type: 'SELL', vol: '0.50', entry: '39,100', exit: '39,080', pl: 890.00, status: 'CLOSED', commission: -2.00, swap: 0 },
    { id: 't-1088', time: '2025-05-14 19:30:00', sym: 'GBPUSD', type: 'BUY', vol: '1.00', entry: '1.2750', exit: '1.2780', pl: 300.00, status: 'CLOSED', commission: -3.00, swap: 0.50 },
    { id: 't-1087', time: '2025-05-14 16:15:22', sym: 'XAUUSD', type: 'SELL', vol: '0.50', entry: '2412.50', exit: '2415.00', pl: -125.00, status: 'CLOSED', commission: -1.50, swap: 0 },
    { id: 't-1086', time: '2025-05-14 09:10:10', sym: 'USDJPY', type: 'BUY', vol: '3.00', entry: '155.20', exit: '155.50', pl: 850.00, status: 'CLOSED', commission: -6.00, swap: 2.10 },
    { id: 't-1085', time: '2025-05-13 22:00:00', sym: 'NAS100', type: 'SELL', vol: '0.20', entry: '18,500', exit: '18,450', pl: 400.00, status: 'CLOSED', commission: -1.00, swap: -0.80 },
    { id: 't-1084', time: '2025-05-13 14:40:55', sym: 'ETHUSD', type: 'BUY', vol: '5.00', entry: '3,100', exit: '3,050', pl: -250.00, status: 'CLOSED', commission: -10.00, swap: 0 },
    { id: 't-1083', time: '2025-05-13 08:30:15', sym: 'AUDUSD', type: 'SELL', vol: '1.50', entry: '0.6650', exit: '0.6620', pl: 450.00, status: 'CLOSED', commission: -3.00, swap: 0.20 },
  ];

  const formatMoney = (amount: number) => {
      const val = currency === 'KES' ? amount * EXCHANGE_RATE_KES : amount;
      const formatted = val.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return currency === 'KES' ? `KES ${formatted}` : `$${formatted}`;
  };

  const filteredData = historyData.filter(item => {
      const matchesSearch = item.sym.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || item.type === filterType;
      return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Trade Blotter</h2>
                <p className="text-gray-400">Comprehensive execution history and audit trail.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder="Search Ticket ID or Symbol..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#0f111a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all w-full md:w-64"
                    />
                    <Search size={16} className="absolute left-3.5 top-3 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <div className="flex gap-2 bg-[#0f111a] p-1 rounded-xl border border-white/10">
                    {['ALL', 'BUY', 'SELL'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === type ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 text-sm font-bold transition-colors">
                    <Download size={16} /> Export CSV
                </button>
            </div>
        </div>

        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-[#0a0a0e]/50 text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                            <th className="py-5 pl-6 font-medium">Ticket</th>
                            <th className="py-5 font-medium">Time (UTC)</th>
                            <th className="py-5 font-medium">Instrument</th>
                            <th className="py-5 font-medium">Type</th>
                            <th className="py-5 font-medium">Volume</th>
                            <th className="py-5 font-medium">Entry</th>
                            <th className="py-5 font-medium">Exit</th>
                            <th className="py-5 font-medium">Commission</th>
                            <th className="py-5 font-medium text-right pr-6">Net Profit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                        {filteredData.map((row) => (
                            <tr key={row.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-6 font-mono text-gray-500 text-xs">{row.id}</td>
                                <td className="py-4 text-gray-400 text-xs">{row.time}</td>
                                <td className="py-4 font-bold text-white">{row.sym}</td>
                                <td className="py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${row.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                        {row.type}
                                    </span>
                                </td>
                                <td className="py-4 text-gray-300">{row.vol}</td>
                                <td className="py-4 text-gray-300 font-mono">{row.entry}</td>
                                <td className="py-4 text-gray-300 font-mono">{row.exit}</td>
                                <td className="py-4 text-rose-400 font-mono text-xs">{formatMoney(row.commission)}</td>
                                <td className="py-4 pr-6 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`font-bold font-mono text-base ${row.pl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {row.pl > 0 ? '+' : ''}{formatMoney(row.pl)}
                                        </span>
                                        {row.swap !== 0 && <span className="text-[10px] text-gray-600">Swap: {row.swap}</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Mock */}
            <div className="py-4 px-6 border-t border-white/5 flex items-center justify-between bg-[#0a0a0e]/30">
                <span className="text-xs text-gray-500">Showing {filteredData.length} of {historyData.length} records</span>
                <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-white"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>

    </div>
  );
};

export default TradeHistory;