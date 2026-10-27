import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Search, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Command,
  Download
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeView: string;
  osMode: 'windows' | 'android' | 'web';
  setOsMode: (mode: 'windows' | 'android' | 'web') => void;
  onOpenCommandPalette: () => void;
  onQuickNewTask: () => void;
  pomodoroSeconds: number;
  pomodoroActive: boolean;
  onTogglePomodoro: () => void;
  onResetPomodoro: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  osMode,
  setOsMode,
  onOpenCommandPalette,
  onQuickNewTask,
  pomodoroSeconds,
  pomodoroActive,
  onTogglePomodoro,
  onResetPomodoro,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Zone 1: Brand title & OS mode toggle */}
      <div className="flex items-center gap-3">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); }} 
          className="flex items-center gap-2.5 text-slate-100 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-slate-100 text-sm whitespace-nowrap">
            OmniAssist <span className="text-indigo-400 font-normal">OS</span>
          </span>
        </a>

        {/* View Breadcrumb */}
        <span className="hidden sm:inline-block text-slate-600 text-xs">/</span>
        <span className="hidden sm:inline-block text-xs font-medium text-slate-400 capitalize">
          {activeView.replace('-', ' ')}
        </span>

        {/* OS Persona Mode Selector */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50 text-xs ml-2">
          <button
            onClick={() => { sound.playClick(); setOsMode('windows'); }}
            title="Windows Assistant Viewport (Window Controls & Titlebar)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              osMode === 'windows'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Windows</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setOsMode('android'); }}
            title="Android Mobile Companion Frame"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              osMode === 'android'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setOsMode('web'); }}
            title="Full Web Screen Mode"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              osMode === 'web'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Full Display</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Real-time Clock, Pomodoro Focus Widget & Command Palette Trigger */}
      <div className="flex items-center gap-3">
        {/* Real-time Digital Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono tabular-nums px-2.5 py-1 rounded-md bg-slate-800/40 border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{timeStr}</span>
        </div>

        {/* Pomodoro Focus Mini Widget */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">Focus:</span>
          <span className={`font-mono tabular-nums font-semibold ${pomodoroActive ? 'text-amber-400' : 'text-slate-300'}`}>
            {formatTimer(pomodoroSeconds)}
          </span>
          <button
            onClick={() => { sound.playClick(); onTogglePomodoro(); }}
            title={pomodoroActive ? 'Pause focus timer' : 'Start focus timer'}
            className="p-1 hover:text-indigo-400 text-slate-400 transition-colors"
          >
            {pomodoroActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { sound.playClick(); onResetPomodoro(); }}
            title="Reset focus timer"
            className="p-1 hover:text-slate-200 text-slate-500 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Global Quick Search (Command Palette) */}
        <button
          onClick={() => { sound.playClick(); onOpenCommandPalette(); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700/60 text-xs transition-colors whitespace-nowrap"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search & Actions</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* User Avatar */}
        <div className="relative group shrink-0">
          <img
            src="/src/assets/images/developer_avatar_1793137904918.jpg"
            alt="Dev User"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-slate-700 ring-1 ring-indigo-500/30"
          />
        </div>
      </div>
    </header>
  );
};
