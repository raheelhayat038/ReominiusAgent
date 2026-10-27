import React, { useState } from 'react';
import { 
  Github, 
  Database, 
  Globe, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  Key, 
  GitPullRequest, 
  GitBranch, 
  GitCommit, 
  Layers,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { sound } from '../utils/audio';

export const IntegrationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'supabase' | 'github'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Vercel state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [deployments, setDeployments] = useState([
    {
      id: 'dpl-1',
      project: 'aether-erp-production',
      branch: 'main',
      commit: '7b28a9c (feat: Supabase RLS policies)',
      status: 'Ready',
      url: 'https://aether-erp-production.vercel.app',
      time: '12 mins ago',
      edgeRegion: 'iad1 (US-East)',
    },
    {
      id: 'dpl-2',
      project: 'omniassist-client-preview',
      branch: 'feat/task-manager',
      commit: '4f19bc0 (refactor: kanban drag and drop)',
      status: 'Ready',
      url: 'https://omniassist-git-feat-preview.vercel.app',
      time: '2 hours ago',
      edgeRegion: 'sfo1 (US-West)',
    },
  ]);

  // Supabase state
  const [sqlQuery, setSqlQuery] = useState('SELECT id, name, sku, quantity, unit_cost FROM inventory_items ORDER BY quantity ASC LIMIT 4;');
  const [queryResult, setQueryResult] = useState<any[] | null>([
    { id: 'item-101', name: 'Industrial Micro-Controller V2', sku: 'MCU-IND-2026', quantity: 8, unit_cost: '$42.50' },
    { id: 'item-102', name: 'Optic Fiber Transceiver Module', sku: 'OPT-FBR-009', quantity: 14, unit_cost: '$118.00' },
    { id: 'item-103', name: 'Hydraulic Pressure Sensor 10bar', sku: 'SEN-HYD-10B', quantity: 22, unit_cost: '$76.20' },
    { id: 'item-104', name: 'Titanium Servo Actuator 24V', sku: 'ACT-TIT-24V', quantity: 35, unit_cost: '$189.90' },
  ]);
  const [sqlExecuting, setSqlExecuting] = useState(false);

  // GitHub state
  const [prTitle, setPrTitle] = useState('feat(erp): automated Supabase schema migration and Vercel edge routes');
  const [prDescription, setPrDescription] = useState('### Summary\n- Added multi-tenant inventory tables.\n- Configured auth.uid() RLS policies.\n- Added Vercel crons for safety-stock triggers.');
  const [prCreatedNotice, setPrCreatedNotice] = useState(false);

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTriggerDeploy = () => {
    sound.playClick();
    setIsDeploying(true);
    setDeploySuccess(false);
    setDeployLogs(['Initiating Vercel CLI deployment...', 'Packaging edge bundle...', 'Validating environment variables: NEXT_PUBLIC_SUPABASE_URL, GEMINI_API_KEY']);

    setTimeout(() => {
      setDeployLogs((prev) => [...prev, '✓ Compiled client assets in 1.4s', '✓ Building Next.js serverless functions (edge runtime)']);
    }, 1000);

    setTimeout(() => {
      setDeployLogs((prev) => [...prev, '✓ Deployed to Vercel global edge network: https://aether-erp-latest.vercel.app', 'Deployment finished with status 200 OK.']);
      setIsDeploying(false);
      setDeploySuccess(true);
      sound.playSuccess();

      setDeployments((prev) => [
        {
          id: `dpl-${Date.now()}`,
          project: 'aether-erp-production',
          branch: 'main',
          commit: 'a1b2c3d (deploy: manual trigger from OmniAssist)',
          status: 'Ready',
          url: 'https://aether-erp-latest.vercel.app',
          time: 'Just now',
          edgeRegion: 'global edge',
        },
        ...prev,
      ]);
    }, 2400);
  };

  const handleExecuteSql = () => {
    sound.playClick();
    setSqlExecuting(true);
    setTimeout(() => {
      setSqlExecuting(false);
      sound.playSuccess();
    }, 400);
  };

  const handleCreateGitHubPr = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setPrCreatedNotice(true);
    setTimeout(() => setPrCreatedNotice(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Services Switcher Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Developer Ecosystem Integrations</span>
          </h2>
          <p className="text-xs text-slate-400">
            Seamless pipeline linking Vercel Hosting, Supabase PostgreSQL, and GitHub Repository
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { sound.playClick(); setActiveTab('vercel'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'vercel'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Vercel Platform</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('supabase'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'supabase'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase DB & RLS</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('github'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'github'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Actions & PRs</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full space-y-6">
        {/* ================= VERCEL TAB ================= */}
        {activeTab === 'vercel' && (
          <div className="space-y-5">
            {/* Vercel Header Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">Vercel Production Edge</h3>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Connected
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Team: aether-labs · Project: aether-erp-production</p>
                </div>
              </div>

              <button
                onClick={handleTriggerDeploy}
                disabled={isDeploying}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deploying Edge Bundle...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Deploy Now (Vercel CLI)</span>
                  </>
                )}
              </button>
            </div>

            {/* Build Log Streamer */}
            {deployLogs.length > 0 && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Vercel Build Output Log</span>
                  </span>
                  {deploySuccess && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready in Production</span>
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-slate-300">
                  {deployLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log.startsWith('✓') ? (
                        <span className="text-emerald-400">{log}</span>
                      ) : (
                        <span className="text-slate-400">{log}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deployments Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Recent Deployments
              </h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 divide-y divide-slate-800">
                {deployments.map((d) => (
                  <div key={d.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{d.project}</span>
                        <span className="text-emerald-400 font-medium font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {d.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-1">
                        <GitBranch className="w-3 h-3" />
                        <span>{d.branch}</span>
                        <span>·</span>
                        <span className="text-slate-400">{d.commit}</span>
                        <span>·</span>
                        <span>{d.edgeRegion}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 font-mono">{d.time}</span>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment Variables Validator */}
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Production Environment Variables</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[10px]">NEXT_PUBLIC_SUPABASE_URL</div>
                    <div className="text-emerald-400 font-semibold truncate">https://ppjon...supabase.co</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[10px]">SUPABASE_SERVICE_ROLE_KEY</div>
                    <div className="text-slate-500 font-semibold truncate">eyJh... (Encrypted)</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[10px]">GEMINI_API_KEY</div>
                    <div className="text-indigo-400 font-semibold truncate">AI Studio Verified</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUPABASE TAB ================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-5">
            {/* Supabase Status Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">Supabase PostgreSQL 15</h3>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> RLS Enforced
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Region: ap-northeast-1 · Pooler: Transaction Mode (6543)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('postgresql://postgres:[PASSWORD]@db.ppjonhhg.supabase.co:6543/postgres', 'db_conn')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  {copiedKey === 'db_conn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Connection String</span>
                </button>
              </div>
            </div>

            {/* SQL Query Editor & Runner */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive SQL Query Runner</span>
                </span>
                <button
                  onClick={handleExecuteSql}
                  disabled={sqlExecuting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 focus:outline-hidden focus:border-emerald-500"
              />

              {/* Tabular Result Set */}
              {queryResult && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Result Table ({queryResult.length} rows returned)</span>
                    <span className="font-mono text-emerald-400">Execution: 12ms</span>
                  </div>
                  <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-950">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                        <tr>
                          {Object.keys(queryResult[0]).map((col) => (
                            <th key={col} className="px-3 py-2 font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 font-mono text-slate-300">
                        {queryResult.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            {Object.values(row).map((val: any, vIdx) => (
                              <td key={vIdx} className="px-3 py-2 whitespace-nowrap">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* RLS Security Audit */}
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Row Level Security (RLS) Policy Audit</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-200">public.inventory_items</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ RLS Enabled (2 policies)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Tenant scoped via auth.uid()</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-200">public.warehouses</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ RLS Enabled (1 policy)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Read authenticated, write admin</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-200">public.purchase_orders</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ RLS Enabled (2 policies)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Vendor & organization check</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= GITHUB TAB ================= */}
        {activeTab === 'github' && (
          <div className="space-y-5">
            {/* GitHub Header Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Github className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">github.com/aether-labs/omni-erp</h3>
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Synced
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Branch: main · Last commit: 4 mins ago</p>
                </div>
              </div>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
              >
                <span>Open in GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick PR Creator */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-indigo-400" />
                  <span>Automated Pull Request Dispatcher</span>
                </span>
                {prCreatedNotice && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pull Request #85 Dispatched to GitHub</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleCreateGitHubPr} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PR Title</label>
                  <input
                    type="text"
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PR Description & Changelog</label>
                  <textarea
                    rows={4}
                    value={prDescription}
                    onChange={(e) => setPrDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>Create Pull Request</span>
                  </button>
                </div>
              </form>
            </div>

            {/* GitHub Actions CI Status */}
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>GitHub Actions Workflows</span>
              </h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg bg-slate-950 text-xs">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Supabase Schema & TypeScript Check</div>
                      <div className="text-[11px] text-slate-500 font-mono">workflow: .github/workflows/db-lint.yml</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Passed in 42s</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Vercel Production Deploy Trigger</div>
                      <div className="text-[11px] text-slate-500 font-mono">workflow: .github/workflows/deploy.yml</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Passed in 1m 15s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
