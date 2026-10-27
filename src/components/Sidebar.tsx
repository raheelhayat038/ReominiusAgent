import React from 'react';
import { 
  Bot, 
  CheckSquare, 
  Calendar, 
  Code2, 
  Layers, 
  Terminal, 
  Cpu,
  Download,
  Github,
  Database,
  Globe,
  Sliders,
  Users,
  Puzzle,
  Activity
} from 'lucide-react';
import { sound } from '../utils/audio';

export type ViewType = 
  | 'assistant' 
  | 'tasks' 
  | 'schedule' 
  | 'snippets' 
  | 'integrations' 
  | 'erp' 
  | 'social' 
  | 'ecommerce' 
  | 'subagents' 
  | 'skills' 
  | 'machine';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  taskCount: { pending: number; total: number };
  agentOnline: boolean;
  onToggleDaemonOnline?: () => void;
  onDownloadDaemon: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  taskCount,
  agentOnline,
  onToggleDaemonOnline,
  onDownloadDaemon,
}) => {
  const navItems = [
    {
      id: 'assistant' as ViewType,
      label: 'AI Copilot & Voice',
      icon: Bot,
      badge: 'Gemini / Ollama',
    },
    {
      id: 'tasks' as ViewType,
      label: 'Daily Tasks & Life',
      icon: CheckSquare,
      count: taskCount.pending,
    },
    {
      id: 'schedule' as ViewType,
      label: 'Agenda & Timeline',
      icon: Calendar,
    },
    {
      id: 'snippets' as ViewType,
      label: 'Code Vault & Sandbox',
      icon: Code2,
    },
    {
      id: 'integrations' as ViewType,
      label: 'GitHub · Supabase · Vercel',
      icon: Layers,
    },
    {
      id: 'erp' as ViewType,
      label: 'ERP & Project Architect',
      icon: Sliders,
    },
    {
      id: 'social' as ViewType,
      label: 'Social Media Radar',
      icon: Globe,
      badge: 'Multi-Network',
    },
    {
      id: 'ecommerce' as ViewType,
      label: 'E-Commerce Company',
      icon: Database,
      badge: 'Autonomous',
    },
    {
      id: 'subagents' as ViewType,
      label: 'Mini-Agent Swarm',
      icon: Users,
      badge: '4 Agents',
    },
    {
      id: 'skills' as ViewType,
      label: 'Skills, Search & Doctor',
      icon: Puzzle,
      badge: 'Git / Self-Heal',
    },
    {
      id: 'machine' as ViewType,
      label: 'Machine Agent & Terminal',
      icon: Terminal,
      badge: agentOnline ? 'Connected' : 'Offline',
      status: agentOnline,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-900/95 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Nav List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Workspace Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setActiveView(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-xs shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.count !== undefined && (
                <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}

              {item.badge && item.count === undefined && (
                item.id === 'machine' ? (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                      agentOnline
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-xs shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                    title={agentOnline ? 'Local machine daemon is ACTIVE (Heartbeat pinging)' : 'Local machine daemon is offline'}
                  >
                    {agentOnline ? (
                      <>
                        <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80 duration-1000" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 animate-heartbeat" />
                        </span>
                        <span className="font-mono font-semibold tracking-tight text-emerald-300">Active</span>
                        <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                        <span className="font-mono text-slate-400 tracking-tight">Offline</span>
                      </>
                    )}
                  </span>
                ) : (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                    item.status === true
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isActive
                        ? 'bg-indigo-700/60 text-indigo-200'
                        : 'bg-slate-800/80 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Services Status Bar & Machine Agent Bridge */}
      <div className="p-3 border-t border-slate-800/80 space-y-3">
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>Linked Ecosystem</span>
            <span className="font-mono text-[10px] text-slate-500">Live Sync</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-medium text-slate-300">
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800/60">
              <Github className="w-3 h-3 text-slate-400" />
              <span>GitHub</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800/60">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Supabase</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800/60">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Vercel</span>
            </div>
          </div>
        </div>

        {/* Local Agent Bridge Card with Live Heartbeat Pulse Indicator */}
        <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">Local Bridge</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-all ${
                agentOnline
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-xs shadow-emerald-500/15'
                  : 'bg-slate-800/90 text-slate-400 border border-slate-700/60'
              }`}
            >
              {agentOnline ? (
                <>
                  <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80 duration-1000" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 animate-heartbeat" />
                  </span>
                  <span>Port 39100 Live</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Port 39100</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                onDownloadDaemon();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
              title="Download local daemon launcher for Windows or Android"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>Get Launcher</span>
            </button>
            {onToggleDaemonOnline && (
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleDaemonOnline();
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                  agentOnline
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={agentOnline ? 'Click to toggle test offline state' : 'Click to test live heartbeat pulse'}
              >
                <Activity className={`w-3.5 h-3.5 ${agentOnline ? 'animate-pulse text-emerald-400' : ''}`} />
                <span className="text-[10px] font-mono">{agentOnline ? 'Live' : 'Test'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
