
import React, { useState } from 'react';
import { Account, EquityPoint, Currency } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Wallet, 
  Copy, 
  Calendar,
  Shield,
  Clock,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Zap,
  MoreHorizontal,
  Coins,
  Scale,
  Gauge,
  AlertOctagon
} from 'lucide-react';
import { USER_PROFILE, EXCHANGE_RATE_KES } from '../services/mockData';

interface DashboardProps {
  accounts: Account[];
  equityData: EquityPoint[];
  currency: Currency;
  onToggleCurrency: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, equityData, currency, onToggleCurrency }) => {
  const totalEquity = accounts.reduce((acc, curr) => acc + curr.equity, 0);
  const totalDailyPL = accounts.reduce((acc, curr) => acc + curr.daily_pl, 0);
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalFloating = totalEquity - totalBalance;
  
  // Mock calculations for the "Prop Firm" style limits
  const maxLossCurrent = 0; // Currently no loss
  const dailyLossCurrent = Math.abs(Math.min(0, totalDailyPL)); // Only count negative PL

  // Currency Conversion Helper
  const formatMoney = (amount: number) => {
      const val = currency === 'KES' ? amount * EXCHANGE_RATE_KES : amount;
      const formatted = val.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return currency === 'KES' ? `KES ${formatted}` : `$${formatted}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Section: Profile & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card - Reorganized */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none animate-pulse-slow"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-purple-500/20">
                <img src={USER_PROFILE.avatar} alt="Profile" className="w-full h-full rounded-2xl bg-gray-900 object-cover" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{USER_PROFILE.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border border-purple-500/20">Pro Trader</span>
                   <p className="text-gray-400 text-sm">Evaluation Phase</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                <button 
                    onClick={onToggleCurrency}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
                >
                    <Coins size={14} className={currency === 'KES' ? 'text-green-400' : 'text-blue-400'}/>
                    Switch to {currency === 'USD' ? 'KES' : 'USD'}
                </button>
                <div className="px-4 py-2 rounded-xl bg-gray-900/80 border border-white/10 text-gray-300 font-mono text-sm flex items-center gap-3 shadow-inner">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 uppercase">Login ID</span>
                        <span className="text-white font-bold">{USER_PROFILE.login}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <Copy size={16} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
            <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><Wallet size={16} /></div>
                 <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Balance</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{formatMoney(totalBalance)}</span>
            </div>
            <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Shield size={16} /></div>
                 <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Plan</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{USER_PROFILE.planType}</span>
            </div>
            <div className="bg-gray-900/40 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><Zap size={16} /></div>
                 <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Type</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{USER_PROFILE.accountType}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
             {/* Cycle Dates */}
             <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg text-gray-400"><Calendar size={18} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Start Date</p>
                        <p className="text-sm font-semibold text-white">{USER_PROFILE.startDate}</p>
                    </div>
                </div>
                <div className="h-px w-8 bg-gray-700"></div>
                 <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">End Date</p>
                    <p className="text-sm font-semibold text-white">{USER_PROFILE.endDate}</p>
                </div>
             </div>
             
             {/* Server Info */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg text-gray-400"><Activity size={18} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Server</p>
                        <p className="text-sm font-semibold text-white">{USER_PROFILE.server}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-emerald-400 font-bold">Connected</span>
                </div>
             </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
             
             <div className="w-24 h-24 rounded-full bg-[#0a0a0e] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] border border-white/10 relative group">
                <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-ping opacity-20"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Activity size={28} />
                </div>
             </div>
             
             <h3 className="text-white font-bold text-xl mb-1">Nexus Support</h3>
             <p className="text-purple-300/60 text-sm mb-6">24/7 Algorithmic Trading Assistance</p>
             
             <button className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] mb-4 border border-white/10">
                Contact Support
             </button>
             
             <div className="w-full bg-[#0a0a0e]/50 rounded-2xl p-4 border border-white/5 mt-auto">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-bold">Daily Loss Reset In</p>
                <div className="font-mono text-2xl text-white font-bold tracking-widest text-shadow-glow">
                    07:14:45
                </div>
             </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <StatCard 
            title="Balance" 
            value={formatMoney(totalBalance)} 
            change="+2.4%" 
            isPositive={true} 
            icon={<DollarSign size={24} />} 
            color="blue"
        />
        <StatCard 
            title="Total Profit" 
            value={formatMoney(totalDailyPL > 0 ? totalDailyPL : 0)} 
            change="On Target" 
            isPositive={true} 
            icon={<TrendingUp size={24} />} 
            color="purple"
        />
        <StatCard 
            title="Floating Loss" 
            value={formatMoney(Math.abs(Math.min(0, totalFloating)))} 
            change={`${((Math.abs(totalFloating)/totalBalance)*100).toFixed(2)}%`} 
            isPositive={false} 
            icon={<TrendingDown size={24} />} 
            color="rose"
        />
        <StatCard 
            title="Volume Traded" 
            value={formatMoney(27650)} 
            change="Active" 
            isPositive={true} 
            icon={<BarChart3 size={24} />} 
            color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section - Wider */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
                 <h3 className="text-lg font-bold text-white">Equity Curve</h3>
                 <p className="text-xs text-gray-400">Real-time performance metrics ({currency})</p>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                {['1H', '4H', '1D', '1W'].map(tf => (
                    <button key={tf} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tf === '1D' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        {tf}
                    </button>
                ))}
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis 
                    stroke="#6b7280" 
                    fontSize={11} 
                    axisLine={false} 
                    tickLine={false} 
                    domain={['auto', 'auto']} 
                    dx={-10} 
                    tickFormatter={(val) => {
                        const v = currency === 'KES' ? val * EXCHANGE_RATE_KES : val;
                        return currency === 'KES' ? `${(v/1000).toFixed(0)}k` : `$${v/1000}k`;
                    }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 17, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#f3f4f6', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                  cursor={{stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4'}}
                  formatter={(value: number) => [formatMoney(value), 'Equity']}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Limits Column */}
        <div className="space-y-4">
             <LimitCard 
                label="Daily Loss Limit" 
                current={dailyLossCurrent} 
                max={USER_PROFILE.dailyLossLimit} 
                color="purple"
                icon={<Clock size={16} />}
                formatMoney={formatMoney}
             />
             <LimitCard 
                label="Overall Loss Limit" 
                current={maxLossCurrent} 
                max={USER_PROFILE.maxLossLimit} 
                color="blue"
                icon={<Shield size={16} />}
                formatMoney={formatMoney}
             />
             <LimitCard 
                label="Min Trading Days" 
                current={USER_PROFILE.currentTradingDays} 
                max={USER_PROFILE.minTradingDays} 
                color="emerald"
                icon={<Calendar size={16} />}
                isDays={true}
                formatMoney={formatMoney}
             />
              <LimitCard 
                label="Profit Target" 
                current={totalDailyPL > 0 ? totalDailyPL : 0} 
                max={USER_PROFILE.profitTarget} 
                color="pink"
                icon={<Target size={16} />}
                formatMoney={formatMoney}
             />
        </div>
      </div>

      {/* Advanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Risk Adjusted Return</p>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Sharpe Ratio
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Excellent</span>
                    </h3>
                </div>
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Scale size={20} />
                </div>
            </div>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">2.45</span>
                <span className="text-sm text-emerald-400 mb-1 flex items-center gap-0.5">
                    <TrendingUp size={12} /> +0.12
                </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 w-[75%] rounded-full shadow-[0_0_10px_#8b5cf6]"></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Top 5% of traders in your cohort</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Downside Deviation</p>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Sortino Ratio
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Good</span>
                    </h3>
                </div>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Gauge size={20} />
                </div>
            </div>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">3.10</span>
                <span className="text-sm text-emerald-400 mb-1 flex items-center gap-0.5">
                    <TrendingUp size={12} /> +0.45
                </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[82%] rounded-full shadow-[0_0_10px_#3b82f6]"></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Efficiency vs. Downside Volatility</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Peak-to-Trough</p>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Max Drawdown
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Safe</span>
                    </h3>
                </div>
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                    <AlertOctagon size={20} />
                </div>
            </div>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">4.2%</span>
                <span className="text-sm text-gray-500 mb-1">
                    / 10.0% Limit
                </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[42%] rounded-full shadow-[0_0_10px_#10b981]"></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Recovery Factor: 5.2x</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Recent Executions
            </h3>
            <button className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                View All <ChevronRight size={14} />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-4 pl-2 font-medium">Time</th>
                        <th className="pb-4 font-medium">Symbol</th>
                        <th className="pb-4 font-medium">Type</th>
                        <th className="pb-4 font-medium">Volume</th>
                        <th className="pb-4 font-medium">Entry</th>
                        <th className="pb-4 font-medium">Profit</th>
                        <th className="pb-4 font-medium text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {[
                        { time: '14:23:05', sym: 'XAUUSD', type: 'BUY', vol: '1.50', entry: '2405.10', pl: 450.00, status: 'CLOSED' },
                        { time: '12:05:11', sym: 'EURUSD', type: 'SELL', vol: '2.00', entry: '1.0965', pl: 120.00, status: 'CLOSED' },
                        { time: '11:45:30', sym: 'BTCUSD', type: 'BUY', vol: '0.10', entry: '64,200', pl: -55.00, status: 'CLOSED' },
                        { time: '10:12:00', sym: 'US30', type: 'SELL', vol: '0.50', entry: '39,100', pl: 890.00, status: 'CLOSED' },
                    ].map((row, i) => (
                        <tr key={i} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                            <td className="py-4 pl-2 text-gray-400 font-mono text-xs">{row.time}</td>
                            <td className="py-4 font-bold text-white">{row.sym}</td>
                            <td className="py-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${row.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {row.type}
                                </span>
                            </td>
                            <td className="py-4 text-gray-300">{row.vol}</td>
                            <td className="py-4 text-gray-300 font-mono">{row.entry}</td>
                            <td className={`py-4 font-bold font-mono ${row.pl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {row.pl > 0 ? '+' : ''}{formatMoney(row.pl)}
                            </td>
                            <td className="py-4 text-right">
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded-lg">{row.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

// Helper Components for Dashboard
const StatCard = ({ title, value, change, isPositive, icon, color }: any) => {
    const colorMap: any = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'bg-blue-600/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'bg-purple-600/20' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'bg-rose-600/20' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'bg-orange-600/20' },
    };
    const c = colorMap[color];

    return (
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-white/5">
             <div className={`absolute -right-4 -top-4 w-24 h-24 ${c.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 ${c.bg} rounded-2xl ${c.text}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{change}</span>
                </div>
            </div>
            <div className="space-y-1 relative z-10">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">{title}</span>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

const LimitCard = ({ label, current, max, color, icon, isDays, formatMoney }: any) => {
    const colorMap: any = {
        purple: { bg: 'bg-purple-500', shadow: 'shadow-[0_0_10px_#a855f7]' },
        blue: { bg: 'bg-blue-500', shadow: 'shadow-[0_0_10px_#3b82f6]' },
        emerald: { bg: 'bg-emerald-500', shadow: 'shadow-[0_0_10px_#10b981]' },
        pink: { bg: 'bg-pink-500', shadow: 'shadow-[0_0_10px_#ec4899]' },
    };
    const c = colorMap[color];
    const pct = Math.min(100, Math.max(0, (current / max) * 100));

    return (
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-[100px] relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                    {icon} {label}
                </div>
                 <span className={`w-2 h-2 rounded-full ${c.bg} ${c.shadow}`}></span>
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xl font-bold text-white">
                        {isDays ? `${current} Days` : formatMoney(current)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                        Target: {isDays ? max : formatMoney(max)}
                    </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`${c.bg} h-full rounded-full ${c.shadow} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }}></div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
