import React, { useState } from 'react';
import { 
  Puzzle, 
  Github, 
  Search, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Terminal, 
  Zap,
  Wrench,
  Check,
  Package
} from 'lucide-react';
import { SkillPackage, WebSearchResult, SystemDiagnostic } from '../types';
import { sound } from '../utils/audio';

interface SkillStoreViewProps {
  skills: SkillPackage[];
  onAddSkill: (skill: SkillPackage) => void;
  diagnostics: SystemDiagnostic[];
  onRunAutoRepair: () => Promise<void>;
  repairing: boolean;
}

export const SkillStoreView: React.FC<SkillStoreViewProps> = ({
  skills,
  onAddSkill,
  diagnostics,
  onRunAutoRepair,
  repairing,
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'browser' | 'maintenance'>('skills');

  // Skill import state
  const [repoInput, setRepoInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Browser Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<WebSearchResult[]>([
    {
      id: 'res-1',
      title: 'Supabase Row Level Security (RLS) Deep Guide 2026',
      url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
      snippet: 'Learn how to protect multi-tenant tables using PostgreSQL Row Level Security policies and auth.uid() tenant matching.',
      source: 'supabase.com',
      timestamp: 'Verified Today',
    },
    {
      id: 'res-2',
      title: 'Vercel Edge Functions with Streaming & @google/genai SDK',
      url: 'https://vercel.com/docs/functions/edge-functions',
      snippet: 'Configure ultra-fast serverless streaming route handlers with zero cold starts using Vercel edge runtime and Next.js 15.',
      source: 'vercel.com',
      timestamp: 'Updated 2026',
    },
    {
      id: 'res-3',
      title: 'Ollama Offline LLM Running Guide on Windows and Linux',
      url: 'https://github.com/ollama/ollama',
      snippet: 'Get up and running with Llama 3, Mistral, and DeepSeek Coder on local GPUs with port 11434 REST API endpoints.',
      source: 'github.com/ollama',
      timestamp: 'Live Docs',
    },
  ]);
  const [searchInsight, setSearchInsight] = useState<string>(
    'OmniAssist OS recommends pairing Supabase PostgreSQL with Vercel edge middleware for sub-50ms authenticated requests.'
  );

  const handleImportGitHubSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setIsImporting(true);
    sound.playClick();

    try {
      const res = await fetch('/api/skills/install-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repoInput }),
      });

      if (!res.ok) throw new Error('Skill acquisition failed');
      const newSkill: SkillPackage = await res.json();

      onAddSkill(newSkill);
      setRepoInput('');
      sound.playSuccess();
    } catch (err: any) {
      alert(`Error acquiring skill: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExecuteWebSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || searchQuery;
    if (!q.trim()) return;
    setIsSearching(true);
    sound.playClick();

    try {
      const res = await fetch('/api/browser/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) throw new Error('Web search failed');
      const data = await res.json();

      setSearchResults(
        data.results.map((r: any, idx: number) => ({
          id: `res-${Date.now()}-${idx}`,
          title: r.title,
          url: r.url,
          snippet: r.snippet,
          source: r.source,
          timestamp: 'Just fetched',
        }))
      );
      setSearchInsight(data.agentInsight || '');
      sound.playSuccess();
    } catch (err: any) {
      alert(`Search error: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-indigo-400" />
            <span>Skill Acquisition, Web Search & Self-Maintenance</span>
          </h2>
          <p className="text-xs text-slate-400">
            Dynamically import open-source GitHub skills, browse real-time internet docs, and run autonomous self-repair
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { sound.playClick(); setActiveTab('skills'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'skills' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Skill & Package Store
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('browser'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'browser' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Internet Browser & Search
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('maintenance'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'maintenance' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Self-Healing Doctor</span>
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full space-y-6">
        {/* ================= SKILL ACQUISITION ================= */}
        {activeTab === 'skills' && (
          <div className="space-y-5">
            {/* GitHub Skill Import Bar */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-200" />
                  <span>Git New Open-Source Skill for Agent</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Enter any GitHub repository or NPM package
                </span>
              </div>

              <form onSubmit={handleImportGitHubSkill} className="flex gap-2">
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="e.g. langchain-ai/langchain or shadcn/ui or supabase/supabase"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={isImporting || !repoInput.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20 shrink-0"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Repo Skill...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Acquire Skill</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Installed Skills Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Active Skills & Tools in Agent Registry ({skills.length} Capabilities)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-xs font-semibold text-slate-100 font-mono">
                            {skill.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          v{skill.version} · Installed
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {skill.description}
                      </p>

                      {/* Functions */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                        <div className="text-[10px] text-slate-500 font-mono">Callable Functions:</div>
                        <div className="flex flex-wrap gap-1">
                          {skill.functions.map((fn, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] font-mono text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                            >
                              {fn}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                      <span>Category: {skill.category}</span>
                      {skill.repoUrl && (
                        <a
                          href={skill.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                        >
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= INTERNET BROWSER & SEARCH ================= */}
        {activeTab === 'browser' && (
          <div className="space-y-5">
            {/* Search Input Bar */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Agent Internet Browser & Live Documentation Search</span>
                </h3>
              </div>

              <form onSubmit={handleExecuteWebSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search live tech documentation, NPM packages, GitHub APIs..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20 shrink-0"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Crawling Web...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Web</span>
                    </>
                  )}
                </button>
              </form>

              {/* Preset Search Prompts */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400 pt-1">
                <span className="text-slate-500 shrink-0 font-mono text-[10px]">Quick:</span>
                {[
                  'Supabase RLS tenant policy syntax',
                  'Vercel edge functions Next.js 15',
                  'Ollama Windows GPU offload',
                  'GitHub Actions deploy to Vercel',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setSearchQuery(q);
                      handleExecuteWebSearch(undefined, q);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Synthesis Insight Box */}
            {searchInsight && (
              <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Agent Web Synthesis</span>
                </div>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {searchInsight}
                </p>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Web Search Results ({searchResults.length} Citations)
              </h4>

              <div className="space-y-3">
                {searchResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{res.source} · {res.timestamp}</span>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        <span>Visit Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-100 hover:text-indigo-300 transition-colors">
                      <a href={res.url} target="_blank" rel="noreferrer">
                        {res.title}
                      </a>
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {res.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SELF-HEALING DOCTOR & MAINTENANCE ================= */}
        {activeTab === 'maintenance' && (
          <div className="space-y-5">
            {/* Doctor Banner */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Autonomous Self-Healing Doctor
                  </h3>
                  <p className="text-xs text-slate-400">
                    Continuous invariant checks: package locks, DB security, memory leaks, and local daemon status
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onRunAutoRepair();
                }}
                disabled={repairing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs shadow-emerald-500/20"
              >
                {repairing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Diagnosing & Repairing System...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run Auto-Repair & Optimize</span>
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Checkpoints Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                System Health Checkpoints
              </h4>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
                {diagnostics.map((diag) => (
                  <div key={diag.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-200">{diag.checkName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{diag.message}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {diag.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
