
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Server, 
  Shield, 
  Bot, 
  Bell, 
  Plus, 
  Trash2, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Zap,
  Smartphone,
  Mail,
  X,
  Loader2,
  Wifi,
  ShieldAlert,
  Radio,
  MessageSquare,
  Hash,
  Terminal,
  Code,
  Users,
  CreditCard,
  Key,
  Activity,
  History,
  Copy,
  Lock,
  ArrowRight,
  MessageCircle,
  SmartphoneNfc,
  Wallet
} from 'lucide-react';
import { Account, TeamMember, AuditLogEntry, ApiKey, PaymentMethod } from '../types';
import { parseTelegramMessage, ParsedSignal } from '../services/telegramParser';
import { MOCK_TEAM, MOCK_AUDIT_LOGS, MOCK_API_KEYS, EXCHANGE_RATE_KES } from '../services/mockData';

interface SettingsProps {
  accounts: Account[];
  onAddAccount: (account: Account) => void;
  onRemoveAccount: (id: string) => void;
  dataSaverMode: boolean;
  onToggleDataSaver: (enabled: boolean) => void;
}

type Tab = 'BROKERS' | 'SOURCES' | 'RISK' | 'AI' | 'NOTIFICATIONS' | 'TEAM' | 'BILLING' | 'DEVELOPERS' | 'AUDIT';

const Settings: React.FC<SettingsProps> = ({ accounts, onAddAccount, onRemoveAccount, dataSaverMode, onToggleDataSaver }) => {
  const [activeTab, setActiveTab] = useState<Tab>('BROKERS');
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // New Account State
  const [newAccountData, setNewAccountData] = useState({
    broker: 'IC Markets',
    platform: 'MT5' as 'MT4' | 'MT5',
    name: '',
    login: '',
    password: '',
    server: 'Demo-1'
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Risk State
  const [maxDailyLoss, setMaxDailyLoss] = useState(5000);
  const [riskPerTrade, setRiskPerTrade] = useState(1.0);
  const [maxDrawdown, setMaxDrawdown] = useState(10);

  // AI State
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [autoApprove, setAutoApprove] = useState(false);

  // Notification State
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  // Telegram Userbot State
  const [tgAppId, setTgAppId] = useState('');
  const [tgHash, setTgHash] = useState('');
  const [tgPhone, setTgPhone] = useState('');
  const [tgCode, setTgCode] = useState('');
  const [tgStep, setTgStep] = useState<'INIT' | 'CODE' | 'CONNECTED'>('INIT');
  const [isTgLoading, setIsTgLoading] = useState(false);
  
  const [whitelistedChannels, setWhitelistedChannels] = useState([
    { id: '1', name: 'Gold Scalper VIP', active: true },
    { id: '2', name: 'Forex Inner Circle', active: true },
    { id: '3', name: 'Free Signals Daily', active: false },
  ]);
  const [newChannel, setNewChannel] = useState('');
  
  // Billing State (Paystack)
  const [showPaystack, setShowPaystack] = useState(false);
  const [paystackStep, setPaystackStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [paystackMethod, setPaystackMethod] = useState<'CARD' | 'MM'>('MM');
  const [paymentPhone, setPaymentPhone] = useState('');

  // Parser Playground State
  const [testMessage, setTestMessage] = useState('GOLD BUY NOW @ 2450 SL 2440 TP 2470 🚀');
  const [parsedResult, setParsedResult] = useState<ParsedSignal | null>(null);

  // Enterprise Data States
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [auditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);

  useEffect(() => {
    if (testMessage) {
        const result = parseTelegramMessage(testMessage);
        setParsedResult(result);
    }
  }, [testMessage]);

  // Toast Helper
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
        setIsSaving(false);
        showToast('success', 'Configuration saved successfully.');
    }, 1200);
  };

  const handlePaystackPay = (e: React.FormEvent) => {
      e.preventDefault();
      setPaystackStep('PROCESSING');
      setTimeout(() => {
          setPaystackStep('SUCCESS');
          showToast('success', 'Payment successful via Paystack!');
          setTimeout(() => {
              setShowPaystack(false);
              setPaystackStep('SELECT');
          }, 2000);
      }, 2500);
  };

  // Telegram Auth Flow
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTgLoading(true);
    setTimeout(() => {
        setIsTgLoading(false);
        setTgStep('CODE');
        showToast('success', 'Verification code sent to Telegram.');
    }, 1500);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTgLoading(true);
    setTimeout(() => {
        setIsTgLoading(false);
        setTgStep('CONNECTED');
        showToast('success', 'Telegram session established securely.');
    }, 1500);
  };

  const handleAddChannel = (e: React.FormEvent) => {
      e.preventDefault();
      if(newChannel) {
          setWhitelistedChannels([...whitelistedChannels, { id: Date.now().toString(), name: newChannel, active: true }]);
          setNewChannel('');
          showToast('success', 'Channel added to whitelist.');
      }
  };

  const toggleChannel = (id: string) => {
      setWhitelistedChannels(whitelistedChannels.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const removeChannel = (id: string) => {
      setWhitelistedChannels(whitelistedChannels.filter(c => c.id !== id));
  };

  const handleConnectAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    setTimeout(() => {
        const newAccount: Account = {
            id: `acc-${Date.now()}`,
            broker: newAccountData.broker,
            platform: newAccountData.platform,
            name: newAccountData.name || 'New Account',
            balance: 100000,
            equity: 100000,
            currency: 'USD',
            status: 'CONNECTED',
            daily_pl: 0,
            daily_pl_percent: 0,
            open_positions: 0
        };
        onAddAccount(newAccount);
        setIsConnecting(false);
        setShowAddModal(false);
        showToast('success', `Connected to ${newAccountData.broker} successfully.`);
        setNewAccountData({
            broker: 'IC Markets',
            platform: 'MT5',
            name: '',
            login: '',
            password: '',
            server: 'Demo-1'
        });
    }, 2000);
  };

  const handleInviteMember = () => {
    showToast('success', 'Invitation email sent.');
  };

  const handleGenerateKey = () => {
    const newKey: ApiKey = {
        id: `key-${Date.now()}`,
        name: 'New API Key',
        prefix: 'nx_live_' + Math.random().toString(36).substring(7),
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'ACTIVE'
    };
    setApiKeys([...apiKeys, newKey]);
    showToast('success', 'New API Key generated.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 border ${toastMessage.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100' : 'bg-rose-900/90 border-rose-500/50 text-rose-100'}`}>
              {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <span className="font-medium">{toastMessage.text}</span>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Configuration</h2>
          <p className="text-gray-400">Manage brokers, risk, team access, and developer settings.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-[#0a0a0e] p-2 rounded-xl border border-white/10">
                 <span className={`text-[10px] font-bold uppercase px-2 ${dataSaverMode ? 'text-emerald-400' : 'text-gray-500'}`}>Data Saver</span>
                 <ToggleSwitch checked={dataSaverMode} onChange={() => onToggleDataSaver(!dataSaverMode)} small />
             </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar border-b border-white/5">
        <TabButton active={activeTab === 'BROKERS'} onClick={() => setActiveTab('BROKERS')} icon={<Server size={18} />} label="Brokers" />
        <TabButton active={activeTab === 'SOURCES'} onClick={() => setActiveTab('SOURCES')} icon={<Radio size={18} />} label="Sources" />
        <TabButton active={activeTab === 'RISK'} onClick={() => setActiveTab('RISK')} icon={<Shield size={18} />} label="Risk" />
        <TabButton active={activeTab === 'AI'} onClick={() => setActiveTab('AI')} icon={<Bot size={18} />} label="AI & Strategy" />
        <TabButton active={activeTab === 'NOTIFICATIONS'} onClick={() => setActiveTab('NOTIFICATIONS')} icon={<Bell size={18} />} label="Alerts" />
        <div className="w-px h-8 bg-white/10 mx-2 self-center"></div>
        <TabButton active={activeTab === 'TEAM'} onClick={() => setActiveTab('TEAM')} icon={<Users size={18} />} label="Team" />
        <TabButton active={activeTab === 'BILLING'} onClick={() => setActiveTab('BILLING')} icon={<CreditCard size={18} />} label="Billing" />
        <TabButton active={activeTab === 'DEVELOPERS'} onClick={() => setActiveTab('DEVELOPERS')} icon={<Code size={18} />} label="Developers" />
        <TabButton active={activeTab === 'AUDIT'} onClick={() => setActiveTab('AUDIT')} icon={<History size={18} />} label="Audit Log" />
      </div>

      {/* Content Area */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 min-h-[500px] shadow-2xl relative">
        
        {/* BROKERS TAB */}
        {activeTab === 'BROKERS' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Server className="text-blue-400" size={24} /> Connected Accounts
                </h3>
                <p className="text-xs text-gray-500 mt-1">Manage your MetaTrader 4/5 connections via Manager API.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all font-bold hover:-translate-y-0.5"
              >
                <Plus size={16} /> Add Account
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {accounts.map((acc) => (
                <div key={acc.id} className="bg-[#0f111a]/60 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-white/10 transition-colors relative overflow-hidden">
                   {acc.status === 'CONNECTED' && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>}
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-bold shadow-lg gap-0.5 ${acc.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-emerald-500/10' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-rose-500/10'}`}>
                      <span className="text-[10px] opacity-70">MT</span>
                      <span className="text-base leading-none">{acc.platform === 'MT5' ? '5' : '4'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg flex items-center gap-2">
                          {acc.name}
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5 font-mono">{acc.platform}</span>
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium">{acc.broker}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded text-gray-400">{acc.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end relative z-10">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Equity</p>
                      <p className="font-mono text-white font-bold text-lg">${acc.equity.toLocaleString()}</p>
                    </div>
                    
                    <div className="h-10 w-px bg-white/5 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 ${acc.status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {acc.status === 'CONNECTED' && <Wifi size={12} />}
                        {acc.status}
                        {acc.status === 'CONNECTED' && <span className="ml-1 text-emerald-600">24ms</span>}
                      </div>
                      
                      <button 
                        onClick={() => onRemoveAccount(acc.id)}
                        className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                        title="Disconnect"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNAL SOURCES TAB */}
        {activeTab === 'SOURCES' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Telegram Client Config */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MessageSquare className="text-blue-400" size={24} /> Telegram Userbot
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Connect your personal account via MTProto.</p>
                        </div>
                        {tgStep === 'CONNECTED' && (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Listening
                            </span>
                        )}
                    </div>

                    <div className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                        {tgStep === 'CONNECTED' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 ring-4 ring-emerald-500/5">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h4 className="text-white font-bold text-lg">Session Active</h4>
                                <p className="text-gray-400 text-sm mb-6">NexusTrader is monitoring text messages from whitelisted channels.</p>
                                <button 
                                    onClick={() => setTgStep('INIT')}
                                    className="text-rose-400 hover:text-rose-300 text-sm font-bold border border-rose-500/20 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                                >
                                    Terminate Session
                                </button>
                            </div>
                        ) : tgStep === 'CODE' ? (
                            <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-4">
                                    <p className="text-xs text-emerald-200/80">
                                        <strong>Step 2/2:</strong> We sent a 5-digit code to your Telegram device.
                                    </p>
                                </div>
                                <InputGroup label="Verification Code" value={tgCode} onChange={setTgCode} placeholder="12345" />
                                <button 
                                    type="submit"
                                    disabled={isTgLoading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
                                >
                                    {isTgLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Connect'}
                                </button>
                                <button type="button" onClick={() => setTgStep('INIT')} className="w-full text-xs text-gray-500 hover:text-white mt-2">Go Back</button>
                            </form>
                        ) : (
                            <form onSubmit={handleRequestCode} className="space-y-4 animate-in fade-in">
                                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-4">
                                    <p className="text-xs text-blue-200/80 leading-relaxed">
                                        <strong>Note:</strong> Obtain API ID and Hash from <a href="#" className="underline hover:text-white">my.telegram.org</a>.
                                    </p>
                                </div>
                                <InputGroup label="App ID" value={tgAppId} onChange={setTgAppId} placeholder="1234567" />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase pl-1">App Hash</label>
                                    <input 
                                        type="password" 
                                        value={tgHash}
                                        onChange={(e) => setTgHash(e.target.value)}
                                        placeholder="••••••••••••••••"
                                        className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono focus:border-purple-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <InputGroup label="Phone Number" value={tgPhone} onChange={setTgPhone} placeholder="+1234567890" />
                                <button 
                                    type="submit"
                                    disabled={isTgLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all mt-2"
                                >
                                    {isTgLoading ? <Loader2 className="animate-spin" size={18} /> : 'Request Code'}
                                </button>
                            </form>
                        )}
                    </div>
                 </div>

                 {/* Channel Management */}
                 <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Hash className="text-purple-400" size={24} /> Whitelisted Channels
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Exact name match for groups you have joined.</p>
                    </div>

                    <div className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl h-full min-h-[400px] flex flex-col">
                        <div className="space-y-3 flex-1 mb-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                            {whitelistedChannels.map(channel => (
                                <div key={channel.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${channel.active ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700/20 text-gray-500'}`}>
                                            <Hash size={16} />
                                        </div>
                                        <span className={`font-medium ${channel.active ? 'text-white' : 'text-gray-500 line-through'}`}>{channel.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ToggleSwitch checked={channel.active} onChange={() => toggleChannel(channel.id)} small />
                                        <button onClick={() => removeChannel(channel.id)} className="text-gray-600 hover:text-rose-400 p-1.5 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddChannel} className="mt-auto pt-4 border-t border-white/5">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={newChannel}
                                    onChange={(e) => setNewChannel(e.target.value)}
                                    placeholder="Enter Exact Group Name..."
                                    className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                 </div>
             </div>
           </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'TEAM' && (
            <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="text-pink-400" size={24} /> Team Management
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Control access permissions and roles.</p>
                    </div>
                    <button 
                        onClick={handleInviteMember}
                        className="text-sm bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-pink-900/20 flex items-center gap-2 transition-all font-bold"
                    >
                        <Mail size={16} /> Invite Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map(member => (
                        <div key={member.id} className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                            <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full bg-gray-800" />
                            <div>
                                <h4 className="text-white font-bold">{member.name}</h4>
                                <p className="text-xs text-gray-500 mb-2">{member.email}</p>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300">{member.role}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${member.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'BILLING' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Plan Details */}
                    <div className="lg:col-span-2 space-y-6">
                         <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                            <CreditCard className="text-emerald-400" size={24} /> Subscription & Usage
                        </h3>
                        
                        <div className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl">
                             <div className="flex justify-between items-start mb-6">
                                 <div>
                                     <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Current Plan</p>
                                     <h2 className="text-3xl font-bold text-white">Enterprise Pro</h2>
                                     <p className="text-sm text-gray-400 mt-1">KES 64,500 / year • Billed Annually</p>
                                 </div>
                                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20">Active</span>
                             </div>
                             
                             <div className="space-y-6">
                                 <UsageBar label="Monthly Signals Processed" current={8430} max={10000} />
                                 <UsageBar label="API Calls (Millions)" current={1.2} max={2.0} suffix="M" />
                                 <UsageBar label="Team Seats" current={3} max={10} />
                             </div>
                        </div>
                    </div>

                    {/* Paystack Payment Trigger */}
                    <div className="space-y-6">
                         <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                            <CreditCard className="text-blue-400" size={24} /> Payment Method
                        </h3>
                         <div className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#092e59] rounded-xl flex items-center justify-center mb-4 border border-[#00c3f7]/30 shadow-lg shadow-[#00c3f7]/20">
                                <span className="text-2xl font-bold text-white">P</span>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Secure Checkout</h4>
                            <p className="text-sm text-gray-400 mb-6">
                                We process payments securely via Paystack. Supports M-PESA and Cards.
                            </p>
                            <button 
                                onClick={() => setShowPaystack(true)}
                                className="w-full bg-[#00c3f7] hover:bg-[#00a3cf] text-[#011b33] py-3.5 rounded-xl font-bold shadow-lg shadow-[#00c3f7]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Lock size={16} /> Pay with Paystack
                            </button>
                            <div className="flex items-center gap-2 mt-4 opacity-50">
                                <CreditCard size={16} />
                                <Smartphone size={16} />
                                <span className="text-[10px] font-mono">256-bit SSL Encrypted</span>
                            </div>
                         </div>
                    </div>
                </div>
             </div>
        )}

        {/* DEVELOPERS TAB */}
        {activeTab === 'DEVELOPERS' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                 <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Code className="text-yellow-400" size={24} /> API Access
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Manage API keys and Webhook endpoints.</p>
                    </div>
                    <button 
                        onClick={handleGenerateKey}
                        className="text-sm bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-yellow-900/20 flex items-center gap-2 transition-all font-bold"
                    >
                        <Key size={16} /> Generate New Key
                    </button>
                </div>

                <div className="space-y-4">
                    {apiKeys.map(key => (
                         <div key={key.id} className="bg-[#0f111a]/60 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
                             <div>
                                 <h4 className="text-white font-bold text-sm">{key.name}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                     <code className="text-xs bg-black/50 px-2 py-1 rounded text-yellow-400 font-mono">{key.prefix}••••••••••••</code>
                                     <button className="text-gray-500 hover:text-white"><Copy size={12} /></button>
                                 </div>
                             </div>
                             <div className="flex items-center gap-6 text-xs text-gray-500">
                                 <span>Created: {key.created}</span>
                                 <span>Last Used: {key.lastUsed}</span>
                                 <span className={`px-2 py-1 rounded border font-bold ${key.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{key.status}</span>
                                 <button className="text-gray-500 hover:text-rose-400"><Trash2 size={16}/></button>
                             </div>
                         </div>
                    ))}
                </div>
             </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'AUDIT' && (
            <div className="space-y-8 animate-in fade-in duration-300">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <History className="text-gray-400" size={24} /> System Audit Log
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="pb-4 pl-4 font-medium">Timestamp</th>
                                <th className="pb-4 font-medium">User</th>
                                <th className="pb-4 font-medium">Category</th>
                                <th className="pb-4 font-medium">Action</th>
                                <th className="pb-4 font-medium">Details</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {auditLogs.map(log => (
                                <tr key={log.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                    <td className="py-4 pl-4 text-gray-400 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="py-4 font-bold text-white flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] text-white">
                                            {log.user.charAt(0)}
                                        </div>
                                        {log.user}
                                    </td>
                                    <td className="py-4">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10">{log.category}</span>
                                    </td>
                                    <td className="py-4 text-white font-medium">{log.action}</td>
                                    <td className="py-4 text-gray-400 text-xs">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* RISK, AI, NOTIFICATIONS Tabs (Simplified for brevity, kept structure) */}
        {activeTab === 'RISK' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="text-purple-400" size={24} /> Risk Protocols
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sliders Section */}
                <div className="space-y-8">
                    <RiskSlider 
                        label="Max Risk Per Trade" 
                        value={riskPerTrade} 
                        setValue={setRiskPerTrade} 
                        min={0.1} max={5} step={0.1} 
                        unit="%" 
                        color="purple" 
                        desc="Percentage of account equity risked on a single position based on Stop Loss."
                    />
                    <RiskSlider 
                        label="Confidence Threshold" 
                        value={confidenceThreshold} 
                        setValue={setConfidenceThreshold} 
                        min={50} max={100} step={1} 
                        unit="%" 
                        color="blue" 
                        desc="Minimum AI confidence score required to suggest a trade."
                    />
                </div>

                {/* Inputs Section */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup label="Max Daily Loss ($)" value={maxDailyLoss} onChange={setMaxDailyLoss} />
                        <InputGroup label="Max Drawdown (%)" value={maxDrawdown} onChange={setMaxDrawdown} />
                    </div>

                    <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                             <ShieldAlert size={100} className="text-rose-500" />
                         </div>
                         <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-3 relative z-10">
                             <AlertTriangle size={20} /> Fail-Safe Triggers
                         </h4>
                         <p className="text-sm text-rose-200/60 mb-6 relative z-10">
                             System will automatically halt all trading if these conditions are met.
                         </p>
                         <div className="space-y-4 relative z-10">
                             <ToggleRow label="Broker Disconnection" checked={true} />
                             <ToggleRow label="Slippage > 5 pips" checked={true} />
                             <ToggleRow label="Consecutive Losses > 5" checked={false} />
                         </div>
                    </div>
                </div>
            </div>
           </div>
        )}

        {/* AI TAB */}
        {activeTab === 'AI' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="text-emerald-400" size={24} /> AI Model Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AIModelCard 
                    id="gemini-2.5-flash"
                    title="Gemini 2.5 Flash"
                    desc="Low latency optimization. Best for scalping and high-frequency updates."
                    latency="~300ms"
                    activeId={aiModel}
                    onSelect={setAiModel}
                    icon={<Zap size={24} />}
                />
                
                <AIModelCard 
                    id="gemini-2.0-pro"
                    title="Gemini 2.0 Pro"
                    desc="Deep reasoning capabilities. Ideal for swing trading and complex macro analysis."
                    latency="~1.5s"
                    activeId={aiModel}
                    onSelect={setAiModel}
                    icon={<Cpu size={24} />}
                />
            </div>

            <div className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl">
                 <div className="flex items-center justify-between mb-4">
                     <div>
                        <h4 className="text-white font-bold text-lg">Auto-Approval Engine</h4>
                        <p className="text-sm text-gray-400 mt-1">Automatically execute trades with confidence {'>'} 95%.</p>
                     </div>
                     <ToggleSwitch checked={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
                 </div>
                 
                 {autoApprove && (
                     <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-300 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        <p>Warning: Auto-approval is active. The AI will execute trades on your behalf without manual confirmation. Ensure risk limits are strictly set.</p>
                     </div>
                 )}
            </div>
           </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'NOTIFICATIONS' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="text-orange-400" size={24} /> Notification Channels
              </h3>
            </div>

            <div className="space-y-4">
                <NotificationCard 
                    icon={<Smartphone size={24} />} 
                    title="Telegram Alerts" 
                    desc="Receive instant signals and execution updates via bot." 
                    checked={notifyTelegram} 
                    onChange={setNotifyTelegram} 
                    color="blue"
                />
                 <NotificationCard 
                    icon={<Mail size={24} />} 
                    title="Email Digest" 
                    desc="Daily performance reports and critical risk alerts." 
                    checked={notifyEmail} 
                    onChange={setNotifyEmail} 
                    color="purple"
                />
                 <NotificationCard 
                    icon={<MessageCircle size={24} />} 
                    title="WhatsApp Business" 
                    desc="High priority alerts via WhatsApp Business API." 
                    checked={notifyWhatsapp} 
                    onChange={setNotifyWhatsapp} 
                    color="green"
                />
                 <NotificationCard 
                    icon={<MessageSquare size={24} />} 
                    title="SMS Fallback" 
                    desc="Critical alerts via AfricasTalking SMS gateway when data is off." 
                    checked={notifySms} 
                    onChange={setNotifySms} 
                    color="orange"
                />
            </div>
           </div>
        )}

      </div>

      {/* Paystack Modal */}
      {showPaystack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPaystack(false)}></div>
              <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl">
                  {/* Paystack Header */}
                  <div className="bg-[#f9fafb] p-6 border-b border-gray-100 flex justify-between items-start">
                      <div>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">NexusTrader Pro</p>
                          <p className="text-xl font-bold text-gray-900">KES 64,500.00</p>
                          <p className="text-xs text-gray-400 mt-1">admin@nexus.ai</p>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-1 font-bold text-[#011b33]">
                            <div className="w-3 h-3 bg-[#00c3f7] rounded-sm"></div>
                            paystack
                         </div>
                      </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                      {paystackStep === 'SUCCESS' ? (
                          <div className="text-center py-8 animate-in fade-in zoom-in">
                              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CheckCircle2 size={32} />
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Successful</h3>
                              <p className="text-sm text-gray-500">Your subscription has been activated.</p>
                          </div>
                      ) : paystackStep === 'PROCESSING' ? (
                          <div className="text-center py-12">
                              <Loader2 size={40} className="animate-spin text-[#00c3f7] mx-auto mb-4" />
                              <p className="text-gray-900 font-medium">Processing payment...</p>
                              <p className="text-xs text-gray-400 mt-2">Please check your phone for the prompt.</p>
                          </div>
                      ) : (
                          <>
                            <p className="text-sm font-bold text-gray-700 mb-3">Pay with</p>
                            <div className="flex gap-2 mb-4">
                                <button 
                                    onClick={() => setPaystackMethod('CARD')}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${paystackMethod === 'CARD' ? 'border-[#00c3f7] bg-[#00c3f7]/10 text-[#011b33]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Card
                                </button>
                                <button 
                                    onClick={() => setPaystackMethod('MM')}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${paystackMethod === 'MM' ? 'border-[#00c3f7] bg-[#00c3f7]/10 text-[#011b33]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Mobile Money
                                </button>
                            </div>

                            {paystackMethod === 'MM' ? (
                                <form onSubmit={handlePaystackPay} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                        <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#00c3f7] transition-colors">
                                            <div className="bg-gray-100 px-3 py-3 text-sm text-gray-500 border-r border-gray-200 flex items-center gap-1">
                                                <span>🇰🇪</span> +254
                                            </div>
                                            <input 
                                                type="tel"
                                                placeholder="7XX XXX XXX"
                                                className="w-full bg-transparent px-3 py-3 text-gray-900 text-sm focus:outline-none"
                                                value={paymentPhone}
                                                onChange={e => setPaymentPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">
                                        <Smartphone size={14} />
                                        <span>Prompt will be sent to this phone.</span>
                                    </div>
                                    <button className="w-full bg-[#3bb75e] hover:bg-[#2e9d4d] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-green-900/10 transition-all mt-2">
                                        Pay KES 64,500
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePaystackPay} className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                                            <div className="relative">
                                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#00c3f7]" required />
                                                <CreditCard size={16} className="absolute right-3 top-3.5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#00c3f7]" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                                                <input type="text" placeholder="123" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#00c3f7]" required />
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-[#3bb75e] hover:bg-[#2e9d4d] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-green-900/10 transition-all mt-4">
                                        Pay KES 64,500
                                    </button>
                                </form>
                            )}
                          </>
                      )}

                      <button onClick={() => setShowPaystack(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  {/* Footer */}
                  <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                          <Lock size={10} /> Secured by Paystack
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowAddModal(false)}></div>
            <div className="glass-card w-full max-w-md rounded-3xl p-8 relative z-10 animate-in zoom-in-95 duration-200 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Connect Broker</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure MetaTrader Access</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleConnectAccount} className="space-y-5">
                    {/* Platform Selector */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-3 pl-1">Trading Platform</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setNewAccountData({...newAccountData, platform: 'MT4'})}
                                className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${newAccountData.platform === 'MT4' ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg' : 'bg-[#0a0a0e] border-white/10 text-gray-500 hover:bg-white/5'}`}
                            >
                                <span className="text-lg font-bold">MT4</span>
                                <span className="text-[10px] uppercase">MetaTrader 4</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setNewAccountData({...newAccountData, platform: 'MT5'})}
                                className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${newAccountData.platform === 'MT5' ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg' : 'bg-[#0a0a0e] border-white/10 text-gray-500 hover:bg-white/5'}`}
                            >
                                <span className="text-lg font-bold">MT5</span>
                                <span className="text-[10px] uppercase">MetaTrader 5</span>
                            </button>
                        </div>
                    </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2 pl-1">Broker Name</label>
                        <div className="relative">
                            <select 
                                value={newAccountData.broker}
                                onChange={(e) => setNewAccountData({...newAccountData, broker: e.target.value})}
                                className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors"
                            >
                                <option>IC Markets</option>
                                <option>FTMO</option>
                                <option>Pepperstone</option>
                                <option>ThinkMarkets</option>
                                <option>OANDA</option>
                            </select>
                            <div className="absolute right-4 top-4 text-gray-500 pointer-events-none">▼</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2 pl-1">Account Label</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Main Aggressive"
                            required
                            value={newAccountData.name}
                            onChange={(e) => setNewAccountData({...newAccountData, name: e.target.value})}
                            className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2 pl-1">Login ID</label>
                            <input 
                                type="text" 
                                placeholder="12345678"
                                required
                                value={newAccountData.login}
                                onChange={(e) => setNewAccountData({...newAccountData, login: e.target.value})}
                                className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2 pl-1">Server</label>
                            <input 
                                type="text" 
                                placeholder="Server-1"
                                value={newAccountData.server}
                                onChange={(e) => setNewAccountData({...newAccountData, server: e.target.value})}
                                className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isConnecting}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Connecting...
                                </>
                            ) : (
                                "Connect Account"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all whitespace-nowrap border text-sm ${
      active 
      ? 'bg-white/10 text-white shadow-lg border-white/10' 
      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const RiskSlider = ({ label, value, setValue, min, max, step, unit, color, desc }: any) => {
    const colorClasses = color === 'purple' ? 'accent-purple-500 text-purple-400' : 'accent-blue-500 text-blue-400';
    return (
        <div className="space-y-4 bg-[#0a0a0e]/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-gray-300">{label}</label>
                <span className={`text-2xl font-bold ${colorClasses.split(' ')[1]}`}>{value}{unit}</span>
            </div>
            <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => setValue(Number(e.target.value))}
            className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${colorClasses.split(' ')[0]}`}
            />
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    );
};

const UsageBar = ({ label, current, max, suffix = '' }: any) => {
    const pct = (current / max) * 100;
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="text-white font-bold">{current}{suffix} / {max}{suffix}</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${pct}%` }}></div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, value, onChange, placeholder }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase pl-1">{label}</label>
        <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors"
        />
    </div>
);

const ToggleSwitch = ({ checked, onChange, small }: { checked: boolean, onChange: () => void, small?: boolean }) => (
    <button 
        onClick={onChange}
        className={`${small ? 'w-10 h-6' : 'w-14 h-8'} rounded-full transition-colors relative shadow-inner ${checked ? 'bg-emerald-500' : 'bg-gray-700'}`}
    >
        <div className={`absolute top-1 left-1 bg-white ${small ? 'w-4 h-4' : 'w-6 h-6'} rounded-full transition-transform shadow-md ${checked ? (small ? 'translate-x-4' : 'translate-x-6') : 'translate-x-0'}`}></div>
    </button>
);

const ToggleRow = ({ label, checked }: { label: string, checked: boolean }) => (
    <div className="flex items-center gap-4 group cursor-pointer">
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-rose-500/30' : 'bg-gray-700'}`}>
            <div className={`w-4 h-4 rounded-full shadow-md transition-transform ${checked ? 'bg-rose-500 translate-x-6' : 'bg-gray-400 translate-x-0'}`}></div>
        </div>
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
);

const AIModelCard = ({ id, title, desc, latency, activeId, onSelect, icon }: any) => {
    const isActive = activeId === id;
    return (
        <div 
            onClick={() => onSelect(id)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all relative overflow-hidden group ${
                isActive 
                ? 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-primary shadow-lg shadow-purple-900/20' 
                : 'bg-[#0a0a0e]/50 border-white/5 hover:border-white/10 hover:bg-[#0a0a0e]/80'
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                    {icon}
                </div>
                    {isActive && <CheckCircle2 size={24} className="text-primary animate-in zoom-in" />}
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-400 mb-4 h-10">{desc}</p>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5">Latency: {latency}</span>
            </div>
        </div>
    );
};

const NotificationCard = ({ icon, title, desc, checked, onChange, color }: any) => {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-500',
        purple: 'bg-purple-500/10 text-purple-500',
        green: 'bg-green-500/10 text-green-500',
        orange: 'bg-orange-500/10 text-orange-500',
    }[color as string] || 'bg-gray-500/10 text-gray-500';

    return (
        <div className="bg-[#0f111a]/60 border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses}`}>
                    {icon}
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg">{title}</h4>
                    <p className="text-sm text-gray-400">{desc}</p>
                </div>
            </div>
            <button 
                onClick={() => onChange(!checked)}
                className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${checked ? 'bg-primary' : 'bg-gray-700'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform shadow-md ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
    </div>
    );
};

export default Settings;
