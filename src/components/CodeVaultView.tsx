import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Sparkles, 
  Search, 
  Star, 
  Trash2, 
  Terminal, 
  Plus, 
  Layers, 
  X,
  FileCode
} from 'lucide-react';
import { CodeSnippet } from '../types';
import { sound } from '../utils/audio';

interface CodeVaultViewProps {
  snippets: CodeSnippet[];
  onAddSnippet: (snippet: Omit<CodeSnippet, 'id'>) => void;
  onUpdateSnippet: (snippet: CodeSnippet) => void;
  onDeleteSnippet: (id: string) => void;
}

export const CodeVaultView: React.FC<CodeVaultViewProps> = ({
  snippets,
  onAddSnippet,
  onUpdateSnippet,
  onDeleteSnippet,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(snippets[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  // AI generator form
  const [aiTitle, setAiTitle] = useState('');
  const [aiLanguage, setAiLanguage] = useState('typescript');
  const [aiDescription, setAiDescription] = useState('');
  const [aiTargetService, setAiTargetService] = useState<'Supabase' | 'Vercel' | 'GitHub' | 'FullStack' | 'General'>('Supabase');
  const [aiLoading, setAiLoading] = useState(false);

  // Manual create form
  const [manualTitle, setManualTitle] = useState('');
  const [manualLang, setManualLang] = useState('typescript');
  const [manualTarget, setManualTarget] = useState<'Supabase' | 'Vercel' | 'GitHub' | 'FullStack' | 'General'>('Supabase');
  const [manualCode, setManualCode] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualTags, setManualTags] = useState('');

  const filteredSnippets = snippets.filter((s) => {
    const matchesFilter = activeFilter === 'All' || s.targetService === activeFilter;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const selectedSnippet = snippets.find((s) => s.id === selectedSnippetId) || filteredSnippets[0];

  const handleCopyCode = (code: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSnippet = (snippet: CodeSnippet) => {
    sound.playClick();
    const extMap: Record<string, string> = {
      sql: 'sql',
      typescript: 'ts',
      javascript: 'js',
      yaml: 'yml',
      json: 'json',
      python: 'py',
    };
    const ext = extMap[snippet.language.toLowerCase()] || 'txt';
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunSandbox = (code: string) => {
    sound.playClick();
    setSandboxOutput('Running code in isolated sandbox...');
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
        warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
        info: (...args: any[]) => logs.push('[INFO] ' + args.join(' ')),
      };

      // Wrap in sandbox function
      const runFn = new Function('console', code);
      runFn(customConsole);

      if (logs.length === 0) {
        setSandboxOutput('Execution completed with 0 errors. (No console output returned).');
      } else {
        setSandboxOutput(logs.join('\n'));
      }
      sound.playSuccess();
    } catch (err: any) {
      setSandboxOutput(`Execution Error: ${err.message}`);
    }
  };

  const handleGenerateAiSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTitle.trim()) return;
    setAiLoading(true);
    sound.playClick();

    try {
      const res = await fetch('/api/ai/generate-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiTitle,
          language: aiLanguage,
          description: aiDescription,
          targetService: aiTargetService,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate snippet');
      const data = await res.json();

      onAddSnippet({
        title: data.title || aiTitle,
        language: data.language || aiLanguage,
        code: data.code || '// Generated code',
        description: data.explanation || aiDescription || 'AI Generated snippet',
        tags: data.tags || [aiTargetService, aiLanguage],
        targetService: aiTargetService,
        isFavorite: false,
      });

      sound.playSuccess();
      setIsAiModalOpen(false);
      setAiTitle('');
      setAiDescription('');
    } catch (err: any) {
      alert(`Snippet generation error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualCode.trim()) return;
    sound.playSuccess();

    onAddSnippet({
      title: manualTitle,
      language: manualLang,
      targetService: manualTarget,
      code: manualCode,
      description: manualDesc,
      tags: manualTags.split(',').map((t) => t.trim()).filter(Boolean),
      isFavorite: false,
    });

    setManualTitle('');
    setManualCode('');
    setManualDesc('');
    setManualTags('');
    setIsCreatingManual(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Supabase, Vercel, GitHub snippets..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 w-52 sm:w-64 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {['All', 'Supabase', 'Vercel', 'GitHub', 'FullStack'].map((tab) => (
              <button
                key={tab}
                onClick={() => { sound.playClick(); setActiveFilter(tab); }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playClick(); setIsCreatingManual(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Snippet</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setIsAiModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Code Generator</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Snippet Library List + Detail & Sandbox */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Snippet List */}
        <div className="w-80 border-r border-slate-800/80 bg-slate-900/30 overflow-y-auto p-3 space-y-2 shrink-0">
          {filteredSnippets.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching code snippets found.
            </div>
          ) : (
            filteredSnippets.map((s) => {
              const isSelected = selectedSnippet?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSnippetId(s.id);
                    setSandboxOutput('');
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-indigo-500/60 shadow-xs'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {s.title}
                    </h4>
                    <span className="font-mono text-[10px] text-indigo-400 uppercase">
                      {s.language}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {s.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-medium">{s.targetService}</span>
                      <span>·</span>
                      <span>{s.tags.slice(0, 2).join(', ')}</span>
                    </div>
                    {s.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Code Editor View & Sandbox Console */}
        {selectedSnippet ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
            {/* Header info */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {selectedSnippet.title}
                  </h3>
                  <span className="text-[11px] text-indigo-400 font-mono uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {selectedSnippet.language}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSnippet.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Run button for JS/TS snippets */}
                {(selectedSnippet.language.toLowerCase() === 'javascript' ||
                  selectedSnippet.language.toLowerCase() === 'typescript') && (
                  <button
                    onClick={() => handleRunSandbox(selectedSnippet.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-xs"
                    title="Execute in browser sandbox"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Sandbox</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopyCode(selectedSnippet.code, selectedSnippet.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
                >
                  {copiedId === selectedSnippet.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadSnippet(selectedSnippet)}
                  title="Download File"
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onDeleteSnippet(selectedSnippet.id);
                  }}
                  title="Delete Snippet"
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-200 selection:bg-indigo-600">
              <pre className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl overflow-x-auto">
                <code>{selectedSnippet.code}</code>
              </pre>
            </div>

            {/* Sandbox Console Output (if triggered) */}
            {sandboxOutput && (
              <div className="h-44 border-t border-slate-800 bg-slate-900/95 flex flex-col shrink-0">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Sandbox Console Output</span>
                  </span>
                  <button
                    onClick={() => setSandboxOutput('')}
                    className="hover:text-slate-200 text-slate-500"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                  {sandboxOutput}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
            Select a snippet to inspect code and run in sandbox
          </div>
        )}
      </div>

      {/* AI Generate Snippet Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Snippet Generator</span>
              </h3>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiSnippet} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Snippet Goal *</label>
                <input
                  type="text"
                  required
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  placeholder="e.g. Supabase Edge Function to sync GitHub webhooks"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Language</label>
                  <select
                    value={aiLanguage}
                    onChange={(e) => setAiLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="sql">SQL (PostgreSQL)</option>
                    <option value="javascript">JavaScript</option>
                    <option value="yaml">YAML (GitHub Actions)</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash / Shell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Service</label>
                  <select
                    value={aiTargetService}
                    onChange={(e) => setAiTargetService(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="Supabase">Supabase</option>
                    <option value="Vercel">Vercel</option>
                    <option value="GitHub">GitHub</option>
                    <option value="FullStack">FullStack</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specific Requirements / Types</label>
                <textarea
                  rows={2}
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="Include error handling, RLS checks, or specific libraries..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-medium text-white shadow-xs"
                >
                  {aiLoading ? 'Synthesizing Snippet...' : 'Generate Snippet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Add Snippet Modal */}
      {isCreatingManual && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100">Add Custom Code Snippet</h3>
              <button onClick={() => setIsCreatingManual(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Supabase Realtime Channel Subscription"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Language</label>
                  <select
                    value={manualLang}
                    onChange={(e) => setManualLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="sql">SQL</option>
                    <option value="javascript">JavaScript</option>
                    <option value="yaml">YAML</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Service</label>
                  <select
                    value={manualTarget}
                    onChange={(e) => setManualTarget(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="Supabase">Supabase</option>
                    <option value="Vercel">Vercel</option>
                    <option value="GitHub">GitHub</option>
                    <option value="FullStack">FullStack</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Code *</label>
                <textarea
                  rows={6}
                  required
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="// Paste your clean code here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="What does this code accomplish?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingManual(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
