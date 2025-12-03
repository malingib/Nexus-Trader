
import { Account, Signal, EquityPoint, TeamMember, AuditLogEntry, ApiKey, Notification } from '../types';

export const EXCHANGE_RATE_KES = 129.50;

export const USER_PROFILE = {
  name: "Alex Trader",
  email: "alex.trader@nexus.ai",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  planType: "Enterprise Pro",
  accountType: "Master Node",
  startDate: "Apr 15, 2025",
  endDate: "May 15, 2025",
  login: "78748803",
  server: "Nexus-Server-4",
  maxLossLimit: 10000,
  dailyLossLimit: 5000,
  profitTarget: 8000,
  minTradingDays: 5,
  currentTradingDays: 2
};

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    broker: 'IC Markets',
    platform: 'MT5',
    name: 'Main Aggressive',
    balance: 50000,
    equity: 51240.50,
    currency: 'USD',
    status: 'CONNECTED',
    daily_pl: 1240.50,
    daily_pl_percent: 2.48,
    open_positions: 3,
  },
  {
    id: 'acc-2',
    broker: 'FTMO',
    platform: 'MT4',
    name: 'Prop Challenge',
    balance: 100000,
    equity: 99800.00,
    currency: 'USD',
    status: 'CONNECTED',
    daily_pl: -200.00,
    daily_pl_percent: -0.20,
    open_positions: 1,
  },
  {
    id: 'acc-3',
    broker: 'Pepperstone',
    platform: 'MT5',
    name: 'Swing Account',
    balance: 25000,
    equity: 25000,
    currency: 'USD',
    status: 'DISCONNECTED',
    daily_pl: 0,
    daily_pl_percent: 0,
    open_positions: 0,
  }
];

export const MOCK_SIGNALS: Signal[] = [
  {
    id: 'sig-20250811-0001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    source: 'AI_MODEL',
    instrument: 'XAU/USD',
    side: 'BUY',
    price: 2410.20,
    confidence: 0.87,
    take_profit: 2430.00,
    stop_loss: 2395.00,
    expected_return: 0.035,
    expected_max_drawdown: 0.015,
    metadata: { model_version: 'Transformer-v3.2' },
    status: 'AWAITING_APPROVAL'
  },
  {
    id: 'sig-20250811-0002',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    source: 'TELEGRAM_PARSER',
    instrument: 'EUR/USD',
    side: 'SELL',
    price: 1.0950,
    confidence: 0.65,
    take_profit: 1.0900,
    stop_loss: 1.0980,
    expected_return: 0.012,
    expected_max_drawdown: 0.005,
    metadata: { channel: 'Gold Scalper VIP', raw_text: 'SELL EURUSD NOW @ 1.0950 SL 1.0980 TP 1.0900' },
    status: 'PENDING_RISK'
  },
  {
    id: 'sig-20250811-0003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    source: 'TELEGRAM_PARSER',
    instrument: 'GBP/JPY',
    side: 'BUY',
    price: 188.50,
    confidence: 0.72,
    take_profit: 189.50,
    stop_loss: 187.90,
    expected_return: 0.02,
    expected_max_drawdown: 0.01,
    metadata: { channel: 'Forex Inner Circle', raw_text: 'GJ BUY NOW!! 188.50 / 187.90 SL / 189.50 TP 🚀' },
    status: 'AWAITING_APPROVAL'
  },
  {
    id: 'sig-20250811-0004',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    source: 'MANUAL_ENTRY',
    instrument: 'BTC/USD',
    side: 'BUY',
    price: 65000,
    confidence: 0.95,
    take_profit: 68000,
    stop_loss: 64000,
    expected_return: 0.05,
    expected_max_drawdown: 0.02,
    metadata: { raw_text: 'Manual entry based on H4 support retest' },
    status: 'EXECUTED'
  }
];

export const MOCK_EQUITY_DATA: EquityPoint[] = [
  { time: '08:00', value: 148000 },
  { time: '09:00', value: 148500 },
  { time: '10:00', value: 148200 },
  { time: '11:00', value: 149000 },
  { time: '12:00', value: 150100 },
  { time: '13:00', value: 149800 },
  { time: '14:00', value: 151040.50 },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Alex Trader', email: 'alex@nexus.ai', role: 'ADMIN', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', lastActive: 'Now' },
  { id: '2', name: 'Sarah Analyst', email: 'sarah@nexus.ai', role: 'ANALYST', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', lastActive: '2h ago' },
  { id: '3', name: 'Mike Risk', email: 'mike@nexus.ai', role: 'TRADER', status: 'PENDING', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', lastActive: 'Never' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), user: 'Alex Trader', action: 'Update Risk Params', category: 'RISK', details: 'Changed Max Daily Loss from $4000 to $5000' },
  { id: 'log-2', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), user: 'System', action: 'Auto-Reject Signal', category: 'SYSTEM', details: 'Rejected XAUUSD Signal (Low Confidence: 45%)' },
  { id: 'log-3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user: 'Sarah Analyst', action: 'Invite User', category: 'TEAM', details: 'Invited mike@nexus.ai as TRADER' },
  { id: 'log-4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), user: 'Alex Trader', action: 'API Key Created', category: 'SECURITY', details: 'Created key "Production Bot 1"' },
  { id: 'log-5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), user: 'Alex Trader', action: 'M-PESA Topup', category: 'BILLING', details: 'Processed STK Push for KES 15,000' },
];

export const MOCK_API_KEYS: ApiKey[] = [
  { id: 'key-1', name: 'Production Bot 1', prefix: 'nx_live_...', created: '2025-04-01', lastUsed: '2 mins ago', status: 'ACTIVE' },
  { id: 'key-2', name: 'Development Test', prefix: 'nx_test_...', created: '2025-04-10', lastUsed: '5 days ago', status: 'REVOKED' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Risk Alert', message: 'Daily drawdown limit approaching (85%).', type: 'WARNING', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
  { id: 'n2', title: 'Execution Success', message: 'Order #88392 filled on XAU/USD.', type: 'SUCCESS', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: 'n3', title: 'System Update', message: 'Engine v2.1 deployed successfully.', type: 'INFO', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
  { id: 'n4', title: 'Telegram Connection', message: 'Reconnect required for channel "Gold VIP".', type: 'ERROR', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
];