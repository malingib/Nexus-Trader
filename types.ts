
export type SignalSource = 'AI_MODEL' | 'TELEGRAM_PARSER' | 'MANUAL_ENTRY';

export type SignalSide = 'BUY' | 'SELL';

export type SignalStatus = 'PENDING_RISK' | 'AWAITING_APPROVAL' | 'APPROVED' | 'EXECUTED' | 'REJECTED' | 'FAILED';

export type Currency = 'USD' | 'KES';

export type PaymentMethod = 'CARD' | 'MPESA';

export interface SignalMetadata {
  raw_text?: string;
  channel?: string;
  model_version?: string;
  backtest_ref?: string;
}

export interface Signal {
  id: string;
  timestamp: string; // ISO string
  source: SignalSource;
  instrument: string; // e.g., XAU/USD
  side: SignalSide;
  price: number;
  confidence: number; // 0.0 to 1.0
  take_profit: number;
  stop_loss: number;
  expected_return: number;
  expected_max_drawdown: number;
  metadata: SignalMetadata;
  status: SignalStatus;
  aiAnalysis?: string; // Field to store Gemini analysis
}

export interface Account {
  id: string;
  broker: string;
  platform: 'MT4' | 'MT5';
  name: string;
  balance: number;
  equity: number;
  currency: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  daily_pl: number;
  daily_pl_percent: number;
  open_positions: number;
}

export interface EquityPoint {
  time: string;
  value: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  read: boolean;
}

// --- Enterprise Types ---

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TRADER' | 'ANALYST';
  status: 'ACTIVE' | 'PENDING';
  avatar: string;
  lastActive: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'RISK' | 'SECURITY' | 'TEAM' | 'SYSTEM' | 'BILLING';
  details: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  status: 'ACTIVE' | 'REVOKED';
}