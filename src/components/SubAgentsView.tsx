import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ArrowRight, 
  Activity, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Cpu,
  Bot
} from 'lucide-react';
import { SubAgent } from '../types';
import { sound } from '../utils/audio';

interface SubAgentsViewProps {
  subAgents: SubAgent[];
  onUpdateSubAgents: (agents: SubAgent[]) => void;
}

export const SubAgentsView: React.FC<SubAgentsViewProps> = ({
  subAgents,
  onUpdateSubAgents,
}) => {
  const [swarmObjective, setSwarmObjective] = useState('');
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [swarmSummary, setSwarmSummary] = useState<string>('');

  const handleDecomposeObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swarmObjective.trim()) return;
    setIsDecomposing(true);
    sound.playClick();

    try {
      const res = await fetch('/api/agent/decompose-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: swarmObjective }),
      });

      if (!res.ok) throw new Error('Task decomposition failed');
      const data = await res.json();

      setSwarmSummary(data.swarmSummary || 'Objective successfully coordinated across mini-agent swarm.');

      // Update sub-agents with newly assigned tasks
      const updated = subAgents.map((agent) => {
        const found = data.subAgents?.find((sa: any) => sa.role === agent.role);
        if (found) {
          return {
            ...agent,
            status: 'working' as const,
            currentTask: found.assignedTask || agent.currentTask,
            progress: Math.floor(40 + Math.random() * 40),
            logs: [...(found.logs || []), ...agent.logs].slice(0, 5),
          };
        }
        return agent;
      });

      onUpdateSubAgents(updated);
      sound.playSuccess();
    } catch (err: any) {
      alert(`Swarm decomposition error: ${err.message}`);
    } finally {
      setIsDecomposing(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'planner': return Layers;
      case 'coder': return Code2;
      case 'devops': return Cpu;
      case 'doctor': return ShieldCheck;
      default: return Bot;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'working': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'failed': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Multi-Agent Swarm Orchestrator (Mini-Agents)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automated work division: Planner, Full-Stack Coder, DevOps Engineer & Self-Healing Doctor
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>4 Mini-Agents Coordinated</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full space-y-6">
        {/* Task Decomposition Command Box */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Dispatch High-Level Mission to Mini-Agent Swarm</span>
            </h3>
            {swarmSummary && (
              <span className="text-[11px] font-mono text-emerald-400">
                ✓ Swarm Strategy Active
              </span>
            )}
          </div>

          <form onSubmit={handleDecomposeObjective} className="flex gap-2">
            <input
              type="text"
              value={swarmObjective}
              onChange={(e) => setSwarmObjective(e.target.value)}
              placeholder="e.g. Build an autonomous inventory ERP with Supabase RLS, Vercel edge deployment, and GitHub CI..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isDecomposing || !swarmObjective.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20 shrink-0"
            >
              {isDecomposing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Decomposing Work...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Divide & Orchestrate</span>
                </>
              )}
            </button>
          </form>

          {swarmSummary && (
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans leading-relaxed">
              {swarmSummary}
            </p>
          )}
        </div>

        {/* 4 Specialized Mini-Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subAgents.map((agent) => {
            const Icon = getRoleIcon(agent.role);
            const statusBadge = getStatusClass(agent.status);

            return (
              <div
                key={agent.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3.5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-100">{agent.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono capitalize">Role: {agent.role}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold capitalize ${statusBadge}`}>
                      {agent.status}
                    </span>
                  </div>

                  {/* Current Assigned Subtask */}
                  <div className="mt-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 font-medium">Active Subtask</div>
                    <div className="text-xs text-slate-200 font-sans leading-snug">
                      {agent.currentTask}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Execution Progress</span>
                      <span className="tabular-nums font-semibold">{agent.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Agent Thought & Execution Logs */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[11px]">
                  <div className="text-[10px] text-slate-500">Recent Stream Logs</div>
                  {agent.logs.slice(0, 3).map((log, idx) => (
                    <div key={idx} className="text-slate-400 truncate flex items-center gap-1.5">
                      <span className="text-indigo-400">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
