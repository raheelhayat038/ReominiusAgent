export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskCategory = 'Dev' | 'Personal' | 'Work' | 'Finance' | 'Health';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  estimatedMinutes?: number;
  subtasks: Subtask[];
  tags: string[];
  createdAt: string;
}

export type EventType = 'deep_work' | 'meeting' | 'break' | 'dev_sprint' | 'personal';

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  durationMinutes: number;
  type: EventType;
  notes?: string;
  completed?: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  tags: string[];
  targetService: 'Supabase' | 'Vercel' | 'GitHub' | 'FullStack' | 'General';
  isFavorite?: boolean;
  lastRunOutput?: string;
}

export interface ActionPayload {
  action: 'create_task' | 'schedule_event' | 'create_snippet' | 'run_terminal' | 'deploy_vercel' | 'supabase_query' | 'generate_erp';
  data: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionPayload?: ActionPayload;
  provider?: string;
  model?: string;
}

export interface ERPTable {
  name: string;
  description: string;
  columns: string[];
}

export interface ERPModule {
  name: string;
  description: string;
  keyFeatures: string[];
  apiEndpoints: string[];
}

export interface ERPArchitecture {
  id: string;
  projectName: string;
  industry: string;
  description: string;
  architectureSummary: string;
  modules: ERPModule[];
  databaseSchema: {
    engine: string;
    sqlMigration: string;
    tables: ERPTable[];
  };
  deployment: {
    vercelConfig: string;
    githubActionWorkflow: string;
    envVariablesRequired: string[];
  };
  quickStartScript: string;
  createdAt: string;
}

export interface MachineTelemetry {
  status: 'online' | 'offline' | 'simulated';
  platform: string;
  hostname: string;
  uptimeSeconds: number;
  memory: {
    totalGB: string;
    freeGB: string;
    usedPercentage: number;
  };
  cpu: {
    model: string;
    cores: number;
    usagePercent: number;
  };
}

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  exitCode: number;
  timestamp: string;
  durationMs?: number;
}

// ================= Social Media Models =================
export type SocialPlatform = 'twitter' | 'linkedin' | 'reddit' | 'instagram' | 'youtube' | 'github';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  replied?: boolean;
}

export interface SocialScheduledPost {
  id: string;
  platforms: SocialPlatform[];
  content: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
}

// ================= E-Commerce Models =================
export interface ECommerceProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  category: string;
  image: string;
  description: string;
  status: 'active' | 'low_stock' | 'draft';
  rating: number;
  reviewsCount: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface ECommerceOrder {
  id: string;
  customerName: string;
  email: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  date: string;
  trackingNumber?: string;
  shippingAddress: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  orderId?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'open' | 'resolved';
  aiSuggestedReply?: string;
}

// ================= Self-Evolution, Sub-Agents & Browser Models =================
export interface SkillPackage {
  id: string;
  name: string;
  version: string;
  description: string;
  repoUrl?: string;
  installed: boolean;
  category: 'DevOps' | 'Database' | 'ECommerce' | 'Automation' | 'AI Tools' | 'Web Search';
  functions: string[];
  source: 'npm' | 'github' | 'builtin';
}

export type AgentRole = 'planner' | 'coder' | 'devops' | 'ecommerce' | 'doctor';

export interface SubAgent {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  status: 'idle' | 'working' | 'completed' | 'failed';
  currentTask: string;
  progress: number; // 0 - 100
  logs: string[];
  activeSkillId?: string;
}

export interface WebSearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  timestamp: string;
}

export interface SystemDiagnostic {
  id: string;
  checkName: string;
  category: 'runtime' | 'packages' | 'database' | 'security' | 'network';
  status: 'healthy' | 'warning' | 'error';
  message: string;
  autoFixAvailable: boolean;
  remedyAction?: string;
}
