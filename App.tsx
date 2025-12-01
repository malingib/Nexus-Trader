import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  PlusSquare, 
  Settings as SettingsIcon, 
  Siren, 
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  Menu,
  ChevronDown,
  Activity,
  Wifi
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import SignalCard from './components/SignalCard';
import ManualEntryForm from './components/ManualEntryForm';
import Settings from './components/Settings';

import { MOCK_ACCOUNTS, MOCK_SIGNALS, MOCK_EQUITY_DATA, USER_PROFILE } from './services/mockData';
import { Signal, Account } from './types';

// Enums for View State
type View = 'DASHBOARD' | 'SIGNALS' | 'ENTRY' | 'SETTINGS';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('SETTINGS'); // Default to settings as requested previously, or switch to dashboard
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stats for sidebar badges
  const pendingSignalsCount = signals.filter(s => s.status === 'AWAITING_APPROVAL').length;

  const handleApproveSignal = (id: string) => {
    setSignals(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'EXECUTED' } : s
    ));
  };

  const handleRejectSignal = (id: string) => {
    setSignals(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'REJECTED' } : s
    ));
  };

  const handleAddSignal = (partialSignal: Partial<Signal>) => {
    const newSignal: Signal = {
      ...partialSignal as Signal,
      id: `sig-${Date.now()}`,
      timestamp: new Date().toISOString(),
      expected_return: 0,
      expected_max_drawdown: 0,
    };
    setSignals(prev => [newSignal, ...prev]);
    setActiveView('SIGNALS');
  };

  const handleAddAccount = (newAccount: Account) => {
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const handleEmergencyStop = () => {
    const confirmStop = window.confirm("CRITICAL: Are you sure you want to trigger the STOP ALL FAIL-SAFE? This will close all positions and pause execution.");
    if (confirmStop) {
      setIsSystemLocked(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#050507] text-gray-100 font-sans overflow-hidden relative selection:bg-purple-500 selection:text-white">
      
      {/* Background Ambience - Animated */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
         <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-blue-900/05 rounded-full blur-[80px] animate-float"></div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-[#0a0a0e]/60 backdrop-blur-2xl flex flex-col hidden md:flex z-20 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] relative overflow-hidden group">
                <span className="relative z-10 text-lg">N</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 hidden lg:block tracking-tight">
                Nexus<span className="font-light text-purple-400">Trader</span>
            </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
            <NavButton 
                active={activeView === 'DASHBOARD'} 
                onClick={() => setActiveView('DASHBOARD')}
                icon={<LayoutDashboard size={20} />}
                label="Account Overview"
            />
            
            <NavButton 
                active={activeView === 'SIGNALS'} 
                onClick={() => setActiveView('SIGNALS')}
                icon={<Radio size={20} />}
                label="Signal Feed"
                badge={pendingSignalsCount > 0 ? pendingSignalsCount : undefined}
            />

            <NavButton 
                active={activeView === 'ENTRY'} 
                onClick={() => setActiveView('ENTRY')}
                icon={<PlusSquare size={20} />}
                label="Manual Entry"
            />

             <NavButton 
                active={activeView === 'SETTINGS'} 
                onClick={() => setActiveView('SETTINGS')}
                icon={<SettingsIcon size={20} />}
                label="Configuration"
            />
        </nav>

        <div className="p-4 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group shadow-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs shadow-inner">
                    {USER_PROFILE.name.charAt(0)}
                </div>
                <div className="hidden lg:block overflow-hidden">
                    <p className="text-sm font-semibold truncate text-white group-hover:text-purple-300 transition-colors">{USER_PROFILE.name}</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 
                        <span className="opacity-80">Connected</span>
                    </p>
                </div>
                <LogOut size={16} className="ml-auto text-gray-500 hover:text-white lg:block hidden opacity-0 group-hover:opacity-100 transition-opacity"/>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
        
        {/* Header */}
        <header className="h-16 bg-[#0a0a0e]/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-8 z-20 sticky top-0">
            {/* Mobile Logo */}
            <div className="flex items-center gap-4 text-gray-400 text-sm md:hidden">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white">
                    N
                </div>
            </div>

            {/* Live Ticker - Desktop */}
            <div className="hidden md:flex items-center gap-6 overflow-hidden max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <Wifi size={14} className="text-emerald-500" />
                    <span>Latency: <span className="text-emerald-400 font-bold">24ms</span></span>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 overflow-hidden relative w-96">
                    <div className="flex gap-6 animate-shimmer whitespace-nowrap">
                        <span className="flex items-center gap-1">XAUUSD <span className="text-emerald-400">2410.50</span></span>
                        <span className="flex items-center gap-1">EURUSD <span className="text-rose-400">1.0945</span></span>
                        <span className="flex items-center gap-1">BTCUSD <span className="text-emerald-400">65,230</span></span>
                        <span className="flex items-center gap-1">US30 <span className="text-emerald-400">38,950</span></span>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0c0e14] to-transparent"></div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                 <div className="relative hidden md:block group">
                    <input 
                        type="text" 
                        placeholder="Search symbols..." 
                        className="bg-[#0f111a]/50 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all w-56 hover:bg-[#0f111a]"
                    />
                    <Search size={14} className="absolute left-3.5 top-2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>

                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full relative transition-colors border border-transparent hover:border-white/10">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse"></span>
                </button>
                
                <div className="h-6 w-px bg-white/10 mx-1"></div>

                <div className="flex items-center gap-3">
                     <button 
                        onClick={handleEmergencyStop}
                        className={`${isSystemLocked ? 'bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.6)] animate-pulse' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20'} px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all uppercase tracking-wider`}
                    >
                        <Siren size={14} />
                        <span className="hidden md:inline">{isSystemLocked ? 'LOCKED' : 'Stop All'}</span>
                    </button>
                    
                    <div className="flex items-center gap-2 md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-300 hover:bg-white/10 rounded-lg">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
             <div className="absolute inset-0 bg-black/90 z-50 p-6 flex flex-col md:hidden animate-fade-in backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-white">Menu</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full"><LogOut size={20}/></button>
                </div>
                 <nav className="space-y-4">
                    <NavButton active={activeView === 'DASHBOARD'} onClick={() => {setActiveView('DASHBOARD'); setIsMobileMenuOpen(false)}} icon={<LayoutDashboard size={22} />} label="Overview" />
                    <NavButton active={activeView === 'SIGNALS'} onClick={() => {setActiveView('SIGNALS'); setIsMobileMenuOpen(false)}} icon={<Radio size={22} />} label="Signals" />
                    <NavButton active={activeView === 'ENTRY'} onClick={() => {setActiveView('ENTRY'); setIsMobileMenuOpen(false)}} icon={<PlusSquare size={22} />} label="Manual Entry" />
                    <NavButton active={activeView === 'SETTINGS'} onClick={() => {setActiveView('SETTINGS'); setIsMobileMenuOpen(false)}} icon={<SettingsIcon size={22} />} label="Settings" />
                </nav>
             </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            
            {isSystemLocked && (
                <div className="mb-8 glass-panel border-rose-500/50 p-6 rounded-3xl flex items-center gap-6 shadow-[0_0_30px_rgba(225,29,72,0.15)] relative overflow-hidden bg-rose-950/20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_15px_#f43f5e]"></div>
                    <div className="p-4 bg-rose-500/20 rounded-full text-rose-500 animate-pulse">
                         <Siren size={32} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white mb-1 tracking-tight">FAIL-SAFE TRIGGERED</h2>
                        <p className="text-rose-200/80 text-sm">Execution paused. All open positions are being liquidated. Manual intervention required to unlock.</p>
                    </div>
                    <button 
                        onClick={() => setIsSystemLocked(false)}
                        className="ml-auto bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-rose-900/40 transition-all relative z-10 hover:scale-105 active:scale-95"
                    >
                        Unlock System
                    </button>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjQ0LCA2MywgOTQsIDAuMSkiLz48L3N2Zz4=')] opacity-50"></div>
                </div>
            )}

            {activeView === 'DASHBOARD' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Dashboard accounts={accounts} equityData={MOCK_EQUITY_DATA} />
                </div>
            )}

            {activeView === 'SIGNALS' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                             <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Signal Feed</h2>
                             <p className="text-gray-400">Real-time AI and analyst opportunities</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-4 py-2 bg-[#0f111a] border border-white/5 rounded-xl flex items-center gap-2 shadow-lg">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                <span className="text-sm font-mono text-gray-300 font-bold">AI Active</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {signals.map(signal => (
                            <SignalCard 
                                key={signal.id} 
                                signal={signal} 
                                accountsCount={accounts.length}
                                onApprove={handleApproveSignal}
                                onReject={handleRejectSignal}
                            />
                        ))}
                    </div>
                </div>
            )}

            {activeView === 'ENTRY' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto mt-4">
                     <ManualEntryForm onSubmit={handleAddSignal} />
                </div>
            )}

            {activeView === 'SETTINGS' && (
                <Settings 
                  accounts={accounts} 
                  onAddAccount={handleAddAccount} 
                  onRemoveAccount={handleRemoveAccount} 
                />
            )}

        </div>
      </main>
    </div>
  );
};

// Helper Component for Navigation Buttons
const NavButton = ({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
            active 
            ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
        }`}
    >
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full shadow-[0_0_10px_#a855f7]"></div>}
        
        <div className={`transition-transform duration-300 ${active ? 'scale-110 text-purple-400' : 'group-hover:scale-110'}`}>
            {icon}
        </div>
        <span className={`font-medium hidden lg:block text-sm tracking-wide ${active ? 'text-white' : ''}`}>{label}</span>
        {badge && (
             <span className="absolute top-3 right-3 lg:static lg:ml-auto bg-white text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {badge}
             </span>
        )}
    </button>
);

export default App;