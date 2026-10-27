import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  CheckSquare, 
  Calendar, 
  Code2, 
  Layers, 
  Terminal, 
  Sliders, 
  Laptop, 
  Smartphone, 
  Play, 
  Download, 
  X,
  Plus,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ViewType } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewType) => void;
  onQuickNewTask: () => void;
  onTogglePomodoro: () => void;
  onSetOsMode: (mode: 'windows' | 'android' | 'web') => void;
  onDownloadDaemon: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onQuickNewTask,
  onTogglePomodoro,
  onSetOsMode,
  onDownloadDaemon,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'view-assistant',
      label: 'Open AI Copilot & Voice Assistant',
      category: 'Navigation',
      icon: Bot,
      run: () => onSelectView('assistant'),
    },
    {
      id: 'action-task',
      label: 'Create New Task & Checklist',
      category: 'Actions',
      icon: Plus,
      run: onQuickNewTask,
    },
    {
      id: 'view-tasks',
      label: 'View Tasks & Kanban Board',
      category: 'Navigation',
      icon: CheckSquare,
      run: () => onSelectView('tasks'),
    },
    {
      id: 'view-schedule',
      label: 'Open Daily Agenda & Timeline',
      category: 'Navigation',
      icon: Calendar,
      run: () => onSelectView('schedule'),
    },
    {
      id: 'action-pomodoro',
      label: 'Toggle Pomodoro Focus Timer (25m)',
      category: 'Actions',
      icon: Play,
      run: onTogglePomodoro,
    },
    {
      id: 'view-snippets',
      label: 'Browse Code Vault & Sandboxes',
      category: 'Navigation',
      icon: Code2,
      run: () => onSelectView('snippets'),
    },
    {
      id: 'view-integrations',
      label: 'Inspect Vercel, Supabase & GitHub Services',
      category: 'Navigation',
      icon: Layers,
      run: () => onSelectView('integrations'),
    },
    {
      id: 'view-erp',
      label: 'Generate ERP Architecture Blueprint',
      category: 'Navigation',
      icon: Sliders,
      run: () => onSelectView('erp'),
    },
    {
      id: 'view-social',
      label: 'Open Social Media Radar (Twitter, LinkedIn, Reddit)',
      category: 'Navigation',
      icon: Layers,
      run: () => onSelectView('social'),
    },
    {
      id: 'view-ecommerce',
      label: 'Open E-Commerce Company Engine & Orders',
      category: 'Navigation',
      icon: CheckSquare,
      run: () => onSelectView('ecommerce'),
    },
    {
      id: 'view-subagents',
      label: 'Dispatch Mini-Agent Swarm (Planner, Coder, DevOps, Doctor)',
      category: 'Navigation',
      icon: Layers,
      run: () => onSelectView('subagents'),
    },
    {
      id: 'view-skills',
      label: 'Acquire GitHub Skills, Search Web & Run Auto-Repair',
      category: 'Navigation',
      icon: Sparkles,
      run: () => onSelectView('skills'),
    },
    {
      id: 'view-machine',
      label: 'Open Machine Agent & Terminal',
      category: 'Navigation',
      icon: Terminal,
      run: () => onSelectView('machine'),
    },
    {
      id: 'mode-windows',
      label: 'Switch View to Windows Desktop Style',
      category: 'Viewport',
      icon: Laptop,
      run: () => onSetOsMode('windows'),
    },
    {
      id: 'mode-android',
      label: 'Switch View to Android Companion Frame',
      category: 'Viewport',
      icon: Smartphone,
      run: () => onSetOsMode('android'),
    },
    {
      id: 'action-daemon',
      label: 'Download Local Agent Bridge Daemon',
      category: 'Actions',
      icon: Download,
      run: onDownloadDaemon,
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to workspace..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden"
          />
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    item.run();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-indigo-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Navigate with mouse or Tab</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
