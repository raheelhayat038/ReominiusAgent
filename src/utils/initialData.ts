import { Task, ScheduleEvent, CodeSnippet, ERPArchitecture, TerminalEntry } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement Supabase Auth RLS callbacks for Vercel preview',
    description: 'Ensure multi-tenant authorization policies pass when deployed on ephemeral Vercel preview branches.',
    priority: 'urgent',
    status: 'in_progress',
    category: 'Dev',
    dueDate: 'Today, 18:00',
    estimatedMinutes: 45,
    tags: ['Supabase', 'Vercel', 'Auth', 'PostgreSQL'],
    subtasks: [
      { id: 'st-1', text: 'Define auth.uid() check on tenant_id column', completed: true },
      { id: 'st-2', text: 'Configure Vercel environment variables sync', completed: true },
      { id: 'st-3', text: 'Run migration via Supabase CLI in test DB', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review GitHub Pull Request #84 - Warehouse ERP Schema',
    description: 'Verify foreign keys, cascade deletes, and indexing on inventory_items and orders tables.',
    priority: 'high',
    status: 'todo',
    category: 'Dev',
    dueDate: 'Tomorrow, 11:00',
    estimatedMinutes: 30,
    tags: ['GitHub', 'ERP', 'CodeReview'],
    subtasks: [
      { id: 'st-4', text: 'Inspect schema diff in GitHub PR files', completed: false },
      { id: 'st-5', text: 'Test rollback script compatibility', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: '30-minute afternoon cardio & mobility stretch',
    description: 'Daily health routine: stay active between intensive deep work coding sessions.',
    priority: 'medium',
    status: 'todo',
    category: 'Health',
    dueDate: 'Today, 16:30',
    estimatedMinutes: 30,
    tags: ['Wellness', 'Habit', 'Energy'],
    subtasks: [
      { id: 'st-6', text: 'Hydrate (500ml water)', completed: true },
      { id: 'st-7', text: 'Full body mobility routine', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Synchronize local Ollama models (llama3 & codellama)',
    description: 'Verify offline runner latency and ensure Ollama port 11434 is responding for the agent daemon.',
    priority: 'medium',
    status: 'completed',
    category: 'Dev',
    dueDate: 'Yesterday',
    estimatedMinutes: 20,
    tags: ['Ollama', 'LocalAI', 'Machine'],
    subtasks: [
      { id: 'st-8', text: 'Pull latest codellama:7b weights', completed: true },
      { id: 'st-9', text: 'Benchmark token generation speed', completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Reconcile freelance SaaS invoices and tax receipts',
    description: 'Organize Stripe payout exports and contractor expense reports.',
    priority: 'low',
    status: 'todo',
    category: 'Finance',
    dueDate: 'Friday, 17:00',
    estimatedMinutes: 40,
    tags: ['Finance', 'Invoicing'],
    subtasks: [
      { id: 'st-10', text: 'Download Stripe monthly summary PDF', completed: false },
      { id: 'st-11', text: 'Tag recurring AWS & Supabase hosting charges', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'ev-1',
    title: 'Morning Planning & Daily Standup',
    startTime: '09:00',
    endTime: '09:30',
    durationMinutes: 30,
    type: 'meeting',
    notes: 'Review GitHub backlog, Vercel deployments, and sprint objectives.',
    completed: true,
  },
  {
    id: 'ev-2',
    title: 'Deep Coding Block: Supabase Realtime & RLS Policies',
    startTime: '09:30',
    endTime: '11:45',
    durationMinutes: 135,
    type: 'deep_work',
    notes: 'Focus mode active. No Slack, pure full-stack implementation.',
    completed: true,
  },
  {
    id: 'ev-3',
    title: 'Lunch & Screen Detox',
    startTime: '12:00',
    endTime: '13:00',
    durationMinutes: 60,
    type: 'break',
    notes: 'Healthy nutrition, light walk outside.',
    completed: false,
  },
  {
    id: 'ev-4',
    title: 'ERP Architecture & Vercel Edge API Routes',
    startTime: '13:30',
    endTime: '15:30',
    durationMinutes: 120,
    type: 'dev_sprint',
    notes: 'Scaffolding database schema and serverless API endpoints.',
    completed: false,
  },
  {
    id: 'ev-5',
    title: 'Local Agent Daemon Benchmark & Ollama Integration',
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    type: 'dev_sprint',
    notes: 'Test background command execution and bridge with desktop machine.',
    completed: false,
  },
  {
    id: 'ev-6',
    title: 'Evening Health & Fitness Reset',
    startTime: '17:30',
    endTime: '18:30',
    durationMinutes: 60,
    type: 'personal',
    notes: 'Cardio workout and wind down.',
    completed: false,
  },
];

export const INITIAL_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-1',
    title: 'Supabase Multi-Tenant RLS Policy (PostgreSQL)',
    language: 'sql',
    targetService: 'Supabase',
    description: 'Enforces strict tenant isolation in PostgreSQL tables so users can only access rows belonging to their organization.',
    tags: ['Supabase', 'PostgreSQL', 'RLS', 'Security'],
    code: `-- Enable Row Level Security on the organizations table
ALTER TABLE app_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only select rows where they belong to the tenant
CREATE POLICY "Tenant read isolation"
ON app_projects
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM organization_members 
    WHERE organization_id = app_projects.organization_id
  )
);

-- Policy: Only owners and admins can insert new projects
CREATE POLICY "Tenant admin write"
ON app_projects
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.user_id = auth.uid()
      AND organization_members.organization_id = app_projects.organization_id
      AND organization_members.role IN ('owner', 'admin')
  )
);`,
    isFavorite: true,
  },
  {
    id: 'snip-2',
    title: 'Vercel Edge API Route with Streaming & Gemini AI',
    language: 'typescript',
    targetService: 'Vercel',
    description: 'Ultra-low latency serverless edge function for Next.js/Vercel running streaming completions with @google/genai.',
    tags: ['Vercel', 'Next.js', 'Edge', 'Gemini'],
    code: `import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of responseStream) {
        if (chunk.text) {
          controller.enqueue(encoder.encode(chunk.text));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}`,
    isFavorite: true,
  },
  {
    id: 'snip-3',
    title: 'GitHub Actions: CI/CD for Supabase Migrations & Vercel Deploy',
    language: 'yaml',
    targetService: 'GitHub',
    description: 'Automated workflow that tests database migrations on Supabase, lints code, and deploys production build to Vercel.',
    tags: ['GitHub', 'CI/CD', 'Supabase', 'Vercel'],
    code: `name: Production CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Typecheck and Lint
        run: npm run lint

      - name: Verify Supabase Schema
        uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase db lint
        env:
          SUPABASE_ACCESS_TOKEN: \${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`,
    isFavorite: false,
  },
  {
    id: 'snip-4',
    title: 'Local Ollama Client Wrapper (JavaScript / Node)',
    language: 'javascript',
    targetService: 'FullStack',
    description: 'Connects directly to your local Ollama daemon (localhost:11434) with streaming and graceful fallback to Gemini.',
    tags: ['Ollama', 'LocalLLM', 'AI', 'JavaScript'],
    code: `async function queryLocalOllama(prompt, model = 'llama3') {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    });
    
    if (!res.ok) throw new Error(\`Ollama error \${res.status}\`);
    const data = await res.json();
    return data.response;
  } catch (err) {
    console.warn('Ollama unavailable, falling back to server Gemini:', err.message);
    const fallback = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });
    const fbData = await fallback.json();
    return fbData.reply;
  }
}`,
    isFavorite: true,
  },
];

export const INITIAL_ERP_BLUEPRINTS: ERPArchitecture[] = [
  {
    id: 'erp-1',
    projectName: 'Aether Logistics & Inventory ERP',
    industry: 'Supply Chain & Manufacturing',
    description: 'Real-time multi-warehouse inventory tracker with automated purchase orders, low-stock threshold webhooks, and Supabase PostgreSQL RLS.',
    architectureSummary: 'Next.js 15 App Router deployed on Vercel with edge caching. Supabase PostgreSQL instance handling inventory transactional integrity, RLS multi-tenant security, and GitHub automated CI/CD.',
    modules: [
      {
        name: 'Warehouse & Stock Control',
        description: 'SKU barcode scanning, multi-bin storage tracking, batch expiration dates, and live stock adjustments.',
        keyFeatures: ['Live Realtime Stock Sync', 'Barcode / QR Lookup', 'Safety Stock Alert Trigger'],
        apiEndpoints: ['GET /api/inventory', 'POST /api/inventory/adjust', 'GET /api/warehouses'],
      },
      {
        name: 'Procurement & Purchase Orders',
        description: 'Vendor management, automated PO creation when items dip below reorder point, and receipt verification.',
        keyFeatures: ['Supplier Directory', 'Automated Approval Flow', 'PDF Invoice Generator'],
        apiEndpoints: ['GET /api/vendors', 'POST /api/purchase-orders', 'PUT /api/purchase-orders/:id/approve'],
      },
      {
        name: 'Billing & Invoicing',
        description: 'Accounts payable/receivable, automated tax calculation, payment webhook reconciliation.',
        keyFeatures: ['Multi-currency Support', 'Stripe Billing Webhooks', 'Audit Ledger'],
        apiEndpoints: ['GET /api/invoices', 'POST /api/invoices/issue'],
      },
    ],
    databaseSchema: {
      engine: 'PostgreSQL (Supabase)',
      tables: [
        {
          name: 'warehouses',
          description: 'Physical storage facilities and zones',
          columns: ['id (uuid)', 'name (text)', 'location_code (varchar)', 'capacity (int)', 'created_at (timestamptz)'],
        },
        {
          name: 'inventory_items',
          description: 'Stock items, SKUs, and inventory levels per warehouse',
          columns: ['id (uuid)', 'warehouse_id (uuid FK)', 'sku (varchar unique)', 'name (text)', 'quantity (int)', 'reorder_level (int)', 'cost_price (numeric)'],
        },
        {
          name: 'purchase_orders',
          description: 'Supplier orders and delivery status',
          columns: ['id (uuid)', 'vendor_id (uuid FK)', 'status (enum)', 'total_amount (numeric)', 'issued_by (uuid FK auth.users)'],
        },
      ],
      sqlMigration: `-- Supabase SQL Schema for Aether Logistics & Inventory ERP
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_code VARCHAR(50) NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read inventory"
ON public.inventory_items FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Allow staff write inventory"
ON public.inventory_items FOR ALL
TO authenticated USING (auth.jwt() ->> 'role' IN ('warehouse_staff', 'admin'));`,
    },
    deployment: {
      vercelConfig: `{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "crons": [
    {
      "path": "/api/cron/check-reorder-levels",
      "schedule": "0 8 * * *"
    }
  ]
}`,
      githubActionWorkflow: `name: Deploy ERP to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`,
      envVariablesRequired: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
    },
    quickStartScript: `# 1. Clone repository
git clone https://github.com/my-org/aether-inventory-erp.git
cd aether-inventory-erp

# 2. Install dependencies
npm install

# 3. Link Supabase & apply migrations
npx supabase login
npx supabase link --project-ref your-supabase-ref
npx supabase db push

# 4. Deploy to Vercel
npx vercel --prod`,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TERMINAL_LOGS: TerminalEntry[] = [
  {
    id: 'term-1',
    command: 'git status',
    output: `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  modified:   supabase/migrations/20261027_rls.sql\n  modified:   src/services/vercelDeploy.ts\n\nno changes added to commit (use "git add <file>...")`,
    exitCode: 0,
    timestamp: '14:20:12',
    durationMs: 120,
  },
  {
    id: 'term-2',
    command: 'curl http://localhost:11434/api/tags',
    output: `{\n  "models": [\n    {\n      "name": "llama3:latest",\n      "modified_at": "2026-10-25T19:02:11.451Z",\n      "size": 4661224676,\n      "digest": "70e2cf2117290ac6fa81ec54c1a0f79e65121e15080e479580646245cf0c5c34"\n    },\n    {\n      "name": "codellama:7b",\n      "modified_at": "2026-10-26T08:14:22.112Z",\n      "size": 3825819519,\n      "digest": "8f8349e6833b47bf5047b973ef0b22416f0f2fb10d3221b6d9da493019806c98"\n    }\n  ]\n}`,
    exitCode: 0,
    timestamp: '14:21:45',
    durationMs: 85,
  },
];

export const INITIAL_SOCIAL_POSTS = [
  {
    id: 'soc-1',
    platform: 'twitter' as const,
    author: 'Omni Hardware Labs',
    handle: '@omnihardware',
    content: 'Just launched our Obsidian Cyberdeck dev unit! Powered by open-source firmware, Supabase cloud sync & Vercel edge deployment. Batch 1 ships next Monday! 🚀 #buildinpublic #devhardware',
    timestamp: '25m ago',
    likes: 1420,
    shares: 382,
    comments: 94,
    sentiment: 'positive' as const,
    tags: ['Launch', 'Cyberdeck', 'DevGear'],
  },
  {
    id: 'soc-2',
    platform: 'linkedin' as const,
    author: 'OmniAssist OS',
    handle: 'omniassist-technologies',
    content: 'How we scaled our hardware e-commerce store to 6 figures using automated ERP architecture, PostgreSQL row-level security on Supabase, and autonomous agent restocking.',
    timestamp: '2h ago',
    likes: 640,
    shares: 118,
    comments: 42,
    sentiment: 'positive' as const,
    tags: ['Ecommerce', 'Scale', 'Automation'],
  },
  {
    id: 'soc-3',
    platform: 'reddit' as const,
    author: 'u/MechanicalKeebsDev',
    handle: 'r/MechanicalKeyboards',
    content: 'In-depth review of the Apex Pro Custom Keyboard: sound profile, lubricated switches, and PCB programmability. Honestly one of the best releases this quarter.',
    timestamp: '4h ago',
    likes: 890,
    shares: 95,
    comments: 132,
    sentiment: 'positive' as const,
    tags: ['Reviews', 'Keyboards'],
  },
  {
    id: 'soc-4',
    platform: 'github' as const,
    author: 'aether-labs/omni-firmware',
    handle: 'Discussions #41',
    content: 'Community request: Native Bluetooth 5.4 multi-pairing protocol support for Linux & Android Termux bridge.',
    timestamp: '6h ago',
    likes: 210,
    shares: 34,
    comments: 28,
    sentiment: 'neutral' as const,
    tags: ['Firmware', 'FeatureRequest'],
  },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Apex Pro Custom Mechanical Keyboard',
    sku: 'APEX-PRO-KBD',
    price: 189.0,
    costPrice: 72.0,
    stock: 42,
    category: 'Hardware',
    image: '/src/assets/images/ecommerce_keyboard_1793138503427.jpg',
    description: 'CNC anodized aluminum chassis, hot-swappable switches, sound dampening silicon gasket, and custom typography keycaps.',
    status: 'active' as const,
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: 'prod-2',
    name: 'Obsidian Studio Audiophile Headphones',
    sku: 'OBS-AUDIO-HP',
    price: 299.0,
    costPrice: 110.0,
    stock: 18,
    category: 'Audio',
    image: '/src/assets/images/ecommerce_headphones_1793138504087.jpg',
    description: 'High-fidelity planar magnetic drivers, ultra-low distortion, memory foam lambskin pads, and active hybrid acoustic isolation.',
    status: 'active' as const,
    rating: 4.8,
    reviewsCount: 94,
  },
  {
    id: 'prod-3',
    name: 'Titanium Handheld Cyberdeck Terminal',
    sku: 'TIT-DEV-DECK',
    price: 449.0,
    costPrice: 185.0,
    stock: 6,
    category: 'Dev Devices',
    image: '/src/assets/images/ecommerce_cyberdeck_1793138504937.jpg',
    description: 'Pocket-sized developer cyberdeck with high-contrast OLED display, rotary encoder, GPIO header, and native Termux/Linux bridge.',
    status: 'low_stock' as const,
    rating: 5.0,
    reviewsCount: 47,
  },
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-1042',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.io',
    items: [{ productId: 'prod-1', name: 'Apex Pro Custom Mechanical Keyboard', quantity: 1, price: 189.0 }],
    total: 189.0,
    status: 'shipped' as const,
    date: 'Today, 11:20',
    trackingNumber: 'TRK-US-9812401',
    shippingAddress: '742 Evergreen Terr, Seattle, WA 98101',
  },
  {
    id: 'ORD-1043',
    customerName: 'Devon Vance',
    email: 'devon@vance.engineering',
    items: [
      { productId: 'prod-3', name: 'Titanium Handheld Cyberdeck Terminal', quantity: 1, price: 449.0 },
      { productId: 'prod-2', name: 'Obsidian Studio Audiophile Headphones', quantity: 1, price: 299.0 },
    ],
    total: 748.0,
    status: 'processing' as const,
    date: 'Today, 09:15',
    shippingAddress: '104 Tech Valley Blvd, Austin, TX 78701',
  },
  {
    id: 'ORD-1044',
    customerName: 'Liam O’Connor',
    email: 'liam@dublindevs.com',
    items: [{ productId: 'prod-2', name: 'Obsidian Studio Audiophile Headphones', quantity: 1, price: 299.0 }],
    total: 299.0,
    status: 'pending' as const,
    date: 'Yesterday, 17:40',
    shippingAddress: '42 Silicon Docks, Dublin 2, Ireland',
  },
];

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-1',
    customerName: 'Devon Vance',
    orderId: 'ORD-1043',
    subject: 'Request firmware flashing with custom Linux kernel before dispatch',
    message: 'Hi team, could you please flash the latest V2.4 preview firmware on the Cyberdeck before shipping to Austin?',
    timestamp: '1h ago',
    status: 'open' as const,
    aiSuggestedReply: 'Hello Devon! We have flagged your order ORD-1043 for our hardware lab. The Cyberdeck will be loaded with v2.4 kernel preview and tested before dispatch today.',
  },
  {
    id: 'inq-2',
    customerName: 'Elena Rostova',
    subject: 'Bulk order discount inquiry for dev team (15 keyboards)',
    message: 'Hello, we are outfitting our engineering team with 15 Apex Pro mechanical keyboards. Do you offer corporate pricing?',
    timestamp: '3h ago',
    status: 'open' as const,
    aiSuggestedReply: 'Hello Elena, thank you for reaching out! Yes, for teams of 10+ units we provide a 15% corporate discount along with custom keycap engraving. I have generated a quote link for your team.',
  },
];

export const INITIAL_SKILLS = [
  {
    id: 'skill-1',
    name: 'supabase-rls-optimizer',
    version: '2.1.0',
    description: 'Autonomous security scanner and policy generator for Supabase PostgreSQL tables.',
    repoUrl: 'https://github.com/supabase/supabase',
    installed: true,
    category: 'Database' as const,
    functions: ['auditTableRLS()', 'generateTenantPolicy()', 'testBypassInvariants()'],
    source: 'github' as const,
  },
  {
    id: 'skill-2',
    name: 'vercel-edge-dispatcher',
    version: '3.4.1',
    description: 'Instant edge function compiler, preview URL streamer, and serverless cron manager.',
    repoUrl: 'https://github.com/vercel/vercel',
    installed: true,
    category: 'DevOps' as const,
    functions: ['deployEdge()', 'syncEnvVars()', 'inspectBuildLogs()'],
    source: 'npm' as const,
  },
  {
    id: 'skill-3',
    name: 'browser-web-search-mcp',
    version: '1.2.4',
    description: 'Live internet browser crawler, documentation scraper, and real-time knowledge grounding.',
    repoUrl: 'https://github.com/modelcontextprotocol/servers',
    installed: true,
    category: 'Web Search' as const,
    functions: ['queryInternet()', 'extractDocumentation()', 'summarizeUrl()'],
    source: 'github' as const,
  },
  {
    id: 'skill-4',
    name: 'stripe-ecom-orchestrator',
    version: '1.0.8',
    description: 'Autonomous payment checkout generator, subscription ledger, and tax calculator.',
    repoUrl: 'https://github.com/stripe/stripe-node',
    installed: true,
    category: 'ECommerce' as const,
    functions: ['createCheckoutSession()', 'reconcileInvoice()', 'generateRefund()'],
    source: 'npm' as const,
  },
];

export const INITIAL_SUB_AGENTS = [
  {
    id: 'sub-planner',
    name: 'Architect & Planner Alpha',
    role: 'planner' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=planner',
    status: 'working' as const,
    currentTask: 'Decomposing E-Commerce Architecture into Supabase & Vercel sprint milestones',
    progress: 85,
    logs: [
      'Analyzed user requirements for Windows/Android cross-platform companion',
      'Generated multi-tier database schema with warehouses & inventory items',
      'Assigned implementation tickets to Coder Beta and DevOps Gamma',
    ],
  },
  {
    id: 'sub-coder',
    name: 'Full-Stack Coder Beta',
    role: 'coder' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=coder',
    status: 'working' as const,
    currentTask: 'Writing Supabase PostgreSQL RLS policies & Vercel serverless edge handlers',
    progress: 72,
    logs: [
      'Synthesized PostgreSQL migration 20261027_rls.sql',
      'Configured React optimistic cart mutation with Web Audio chime',
      'Testing Edge route response latency under 20ms',
    ],
  },
  {
    id: 'sub-devops',
    name: 'DevOps & Git Gamma',
    role: 'devops' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=devops',
    status: 'completed' as const,
    currentTask: 'All GitHub Actions workflows validated & Vercel production edge deployed',
    progress: 100,
    logs: [
      'Dispatched GitHub Pull Request #85',
      'Verified Vercel SSL certificates and global CDN routes',
      'Pushed daemon launcher scripts (.bat and .sh) to release',
    ],
  },
  {
    id: 'sub-doctor',
    name: 'Self-Healing Doctor Omega',
    role: 'doctor' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=doctor',
    status: 'working' as const,
    currentTask: 'Continuous runtime diagnosis, package integrity audit & memory garbage collection',
    progress: 95,
    logs: [
      'Inspected all 15 node dependencies; 0 vulnerabilities found',
      'Verified local Ollama port 11434 availability',
      'Flushed stale build cache and verified database foreign key indexes',
    ],
  },
];

export const INITIAL_DIAGNOSTICS = [
  {
    id: 'diag-1',
    checkName: 'Node.js & Express HTTP Server',
    category: 'runtime' as const,
    status: 'healthy' as const,
    message: 'Port 3000 listening, EventLoop lag < 2ms.',
    autoFixAvailable: false,
  },
  {
    id: 'diag-2',
    checkName: 'Package Dependencies Invariant',
    category: 'packages' as const,
    status: 'healthy' as const,
    message: 'All NPM packages locked and TypeScript compilation clean.',
    autoFixAvailable: false,
  },
  {
    id: 'diag-3',
    checkName: 'Supabase PostgreSQL RLS Shield',
    category: 'database' as const,
    status: 'healthy' as const,
    message: 'All tables have ROW LEVEL SECURITY enabled with tenant isolation.',
    autoFixAvailable: false,
  },
  {
    id: 'diag-4',
    checkName: 'Local Agent Daemon Bridge (Port 39100)',
    category: 'network' as const,
    status: 'healthy' as const,
    message: 'Daemon bridge ready for Windows / Android / Linux shell execution.',
    autoFixAvailable: true,
    remedyAction: 'Downloaded fresh start-omni-agent.bat launcher.',
  },
];
