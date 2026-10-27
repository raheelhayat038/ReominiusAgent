import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ViewType } from './components/Sidebar';
import { AssistantView } from './components/AssistantView';
import { TasksView } from './components/TasksView';
import { ScheduleView } from './components/ScheduleView';
import { CodeVaultView } from './components/CodeVaultView';
import { IntegrationsView } from './components/IntegrationsView';
import { ERPArchitectView } from './components/ERPArchitectView';
import { SocialHubView } from './components/SocialHubView';
import { ECommerceView } from './components/ECommerceView';
import { SubAgentsView } from './components/SubAgentsView';
import { SkillStoreView } from './components/SkillStoreView';
import { MachineAgentView } from './components/MachineAgentView';
import { CommandPalette } from './components/CommandPalette';
import { 
  Task, 
  ScheduleEvent, 
  CodeSnippet, 
  ERPArchitecture, 
  TerminalEntry, 
  ChatMessage, 
  ActionPayload,
  SocialPost,
  ECommerceProduct,
  ECommerceOrder,
  CustomerInquiry,
  SkillPackage,
  SubAgent,
  SystemDiagnostic
} from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_SCHEDULE, 
  INITIAL_SNIPPETS, 
  INITIAL_ERP_BLUEPRINTS, 
  INITIAL_TERMINAL_LOGS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_INQUIRIES,
  INITIAL_SKILLS,
  INITIAL_SUB_AGENTS,
  INITIAL_DIAGNOSTICS
} from './utils/initialData';
import { sound } from './utils/audio';
import { 
  Bot, 
  CheckSquare, 
  Calendar, 
  Code2, 
  Layers, 
  Terminal, 
  Sliders,
  Minus,
  Square,
  X,
  Wifi,
  Battery,
  Signal,
  Share2,
  ShoppingBag,
  Users,
  Puzzle
} from 'lucide-react';

export default function App() {
  // Viewport persona mode
  const [osMode, setOsMode] = useState<'windows' | 'android' | 'web'>('windows');
  const [activeView, setActiveView] = useState<ViewType>('assistant');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Persistent core states with localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('omniassist_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [schedule, setSchedule] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('omniassist_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const saved = localStorage.getItem('omniassist_snippets');
    return saved ? JSON.parse(saved) : INITIAL_SNIPPETS;
  });

  const [erpBlueprints, setErpBlueprints] = useState<ERPArchitecture[]>(() => {
    const saved = localStorage.getItem('omniassist_erps');
    return saved ? JSON.parse(saved) : INITIAL_ERP_BLUEPRINTS;
  });

  const [terminalLogs, setTerminalLogs] = useState<TerminalEntry[]>(() => {
    const saved = localStorage.getItem('omniassist_terminal');
    return saved ? JSON.parse(saved) : INITIAL_TERMINAL_LOGS;
  });

  // Social & E-commerce persistent states
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('omniassist_social');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_POSTS;
  });

  const [products, setProducts] = useState<ECommerceProduct[]>(() => {
    const saved = localStorage.getItem('omniassist_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<ECommerceOrder[]>(() => {
    const saved = localStorage.getItem('omniassist_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('omniassist_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  // Skills, Sub-Agents, Diagnostics states
  const [skills, setSkills] = useState<SkillPackage[]>(() => {
    const saved = localStorage.getItem('omniassist_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [subAgents, setSubAgents] = useState<SubAgent[]>(() => {
    const saved = localStorage.getItem('omniassist_subagents');
    return saved ? JSON.parse(saved) : INITIAL_SUB_AGENTS;
  });

  const [diagnostics, setDiagnostics] = useState<SystemDiagnostic[]>(() => {
    const saved = localStorage.getItem('omniassist_diagnostics');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSTICS;
  });

  const [isRepairing, setIsRepairing] = useState(false);

  // Assistant Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am **OmniAssist OS**, your autonomous AI Operating System for Windows & Android.\n\nNow equipped with full self-evolution and multi-agent coordination:\n- **Git New Skills & Packages**: Dynamically acquire any open-source GitHub repository as an internal skill.\n- **Mini-Agent Swarm**: Dispatch high-level objectives across Planner, Coder, DevOps, and Doctor agents.\n- **Internet Browser Search**: Query live web documentation and verify technical implementation details.\n- **Autonomous Self-Healing Doctor**: Continuously maintain system invariants, clean caches, and auto-repair broken dependencies.\n- **Social Media Radar & E-Commerce Engine**: Monitor community channels and autonomously operate orders, inventory, and support.\n- **Full Machine Control**: Direct local execution via daemon launcher or local Ollama on port 11434.\n\nWhat would you like to build or orchestrate?`,
      timestamp: 'Just now',
      provider: 'gemini',
      model: 'gemini-3.8-flash',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'gemini' | 'ollama' | 'groq'>('gemini');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [groqKey, setGroqKey] = useState('');
  const [agentOnline, setAgentOnline] = useState(false);

  // Pomodoro Focus Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('omniassist_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('omniassist_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('omniassist_snippets', JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    localStorage.setItem('omniassist_erps', JSON.stringify(erpBlueprints));
  }, [erpBlueprints]);

  useEffect(() => {
    localStorage.setItem('omniassist_terminal', JSON.stringify(terminalLogs));
  }, [terminalLogs]);

  useEffect(() => {
    localStorage.setItem('omniassist_social', JSON.stringify(socialPosts));
  }, [socialPosts]);

  useEffect(() => {
    localStorage.setItem('omniassist_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omniassist_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('omniassist_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('omniassist_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('omniassist_subagents', JSON.stringify(subAgents));
  }, [subAgents]);

  useEffect(() => {
    localStorage.setItem('omniassist_diagnostics', JSON.stringify(diagnostics));
  }, [diagnostics]);

  // Pomodoro Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (pomodoroActive && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((sec) => sec - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && pomodoroActive) {
      sound.playChime();
      setPomodoroActive(false);
      setPomodoroSeconds(25 * 60);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroSeconds]);

  // Chat message sender
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          provider: activeProvider,
          model: activeProvider === 'gemini' ? 'gemini-3.8-flash' : ollamaModel,
          groqKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to communicate with assistant engine');
      }

      const data = await res.json();
      const replyText = data.reply || 'Request processed.';

      // Extract action JSON block if present
      let extractedAction: ActionPayload | undefined = undefined;
      const actionMatch = replyText.match(/```action\s*([\s\S]*?)\s*```/);
      if (actionMatch && actionMatch[1]) {
        try {
          extractedAction = JSON.parse(actionMatch[1]);
        } catch {
          // Parse failure tolerated
        }
      }

      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPayload: extractedAction,
        provider: data.provider,
        model: data.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      sound.playSuccess();
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Notice: ${err.message}. If local Ollama is selected, ensure it is running on your machine or switch back to Gemini 3.8 Flash.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Structured Action Executor
  const handleExecuteAction = (actionPayload: ActionPayload) => {
    switch (actionPayload.action) {
      case 'create_task': {
        const t = actionPayload.data;
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: t.title || 'New Automated Task',
          description: t.description || 'Created via OmniAssist Copilot',
          priority: t.priority || 'medium',
          status: 'todo',
          category: t.category || 'Dev',
          dueDate: t.due || 'Today',
          subtasks: [],
          tags: [t.category || 'Dev'],
          createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [newTask, ...prev]);
        break;
      }
      case 'schedule_event': {
        const ev = actionPayload.data;
        const newEvent: ScheduleEvent = {
          id: `ev-${Date.now()}`,
          title: ev.title || 'Scheduled Event',
          startTime: ev.time || '15:00',
          endTime: '16:00',
          durationMinutes: ev.durationMinutes || 60,
          type: ev.type || 'dev_sprint',
          notes: 'Scheduled by OmniAssist AI',
          completed: false,
        };
        setSchedule((prev) => [...prev, newEvent]);
        break;
      }
      case 'create_snippet': {
        const sn = actionPayload.data;
        const newSnippet: CodeSnippet = {
          id: `snip-${Date.now()}`,
          title: sn.title || 'Generated Code Snippet',
          language: sn.language || 'typescript',
          code: sn.code || '// Generated code',
          description: sn.description || 'Created via assistant',
          tags: sn.tags || ['Generated'],
          targetService: 'FullStack',
        };
        setSnippets((prev) => [newSnippet, ...prev]);
        break;
      }
      case 'run_terminal': {
        const tr = actionPayload.data;
        setTerminalLogs((prev) => [
          {
            id: `term-${Date.now()}`,
            command: tr.command,
            output: `✓ Successfully executed: ${tr.command}\n${tr.description || ''}`,
            exitCode: 0,
            timestamp: new Date().toLocaleTimeString(),
            durationMs: 95,
          },
          ...prev,
        ]);
        break;
      }
      default:
        break;
    }
  };

  const handleRunAutoRepair = async () => {
    setIsRepairing(true);
    try {
      const res = await fetch('/api/system/auto-repair', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.checks) {
          setDiagnostics(data.checks);
        }
      }
      sound.playSuccess();
    } catch {
      // Graceful
    } finally {
      setTimeout(() => setIsRepairing(false), 800);
    }
  };

  const handleDownloadDaemon = () => {
    sound.playClick();
    window.location.href = '/api/agent/download-windows-bat';
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  // View content renderer
  const renderActiveView = () => {
    switch (activeView) {
      case 'assistant':
        return (
          <AssistantView
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={chatLoading}
            onExecuteAction={handleExecuteAction}
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
            ollamaModel={ollamaModel}
            setOllamaModel={setOllamaModel}
            groqKey={groqKey}
            setGroqKey={setGroqKey}
            onNavigateToView={setActiveView}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onAddTask={(task) => setTasks((prev) => [{ ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() }, ...prev])}
            onUpdateTask={(updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))}
            onDeleteTask={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
          />
        );
      case 'schedule':
        return (
          <ScheduleView
            schedule={schedule}
            onAddEvent={(event) => setSchedule((prev) => [...prev, { ...event, id: `ev-${Date.now()}` }])}
            onUpdateEvent={(updated) => setSchedule((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))}
            onDeleteEvent={(id) => setSchedule((prev) => prev.filter((e) => e.id !== id))}
            pomodoroSeconds={pomodoroSeconds}
            pomodoroActive={pomodoroActive}
            onTogglePomodoro={() => setPomodoroActive(!pomodoroActive)}
            onResetPomodoro={() => { setPomodoroActive(false); setPomodoroSeconds(25 * 60); }}
            onSetPomodoroTime={(sec) => { setPomodoroActive(false); setPomodoroSeconds(sec); }}
          />
        );
      case 'snippets':
        return (
          <CodeVaultView
            snippets={snippets}
            onAddSnippet={(snippet) => setSnippets((prev) => [{ ...snippet, id: `snip-${Date.now()}` }, ...prev])}
            onUpdateSnippet={(updated) => setSnippets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))}
            onDeleteSnippet={(id) => setSnippets((prev) => prev.filter((s) => s.id !== id))}
          />
        );
      case 'integrations':
        return <IntegrationsView />;
      case 'erp':
        return (
          <ERPArchitectView
            erpBlueprints={erpBlueprints}
            onAddBlueprint={(blueprint) => setErpBlueprints((prev) => [blueprint, ...prev])}
          />
        );
      case 'social':
        return (
          <SocialHubView
            posts={socialPosts}
            onAddPost={(newP) => setSocialPosts((prev) => [newP, ...prev])}
          />
        );
      case 'ecommerce':
        return (
          <ECommerceView
            products={products}
            orders={orders}
            inquiries={inquiries}
            onAddOrder={(order) => setOrders((prev) => [order, ...prev])}
            onUpdateOrderStatus={(orderId, status) =>
              setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
            }
            onUpdateProductStock={(productId, newStock) =>
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === productId
                    ? { ...p, stock: newStock, status: newStock < 10 ? 'low_stock' : 'active' }
                    : p
                )
              )
            }
            onResolveInquiry={(inquiryId) =>
              setInquiries((prev) =>
                prev.map((i) => (i.id === inquiryId ? { ...i, status: 'resolved' } : i))
              )
            }
          />
        );
      case 'subagents':
        return (
          <SubAgentsView
            subAgents={subAgents}
            onUpdateSubAgents={setSubAgents}
          />
        );
      case 'skills':
        return (
          <SkillStoreView
            skills={skills}
            onAddSkill={(newSkill) => setSkills((prev) => [newSkill, ...prev])}
            diagnostics={diagnostics}
            onRunAutoRepair={handleRunAutoRepair}
            repairing={isRepairing}
          />
        );
      case 'machine':
        return (
          <MachineAgentView
            terminalLogs={terminalLogs}
            onAddTerminalLog={(log) => setTerminalLogs((prev) => [log, ...prev])}
            agentOnline={agentOnline}
            setAgentOnline={setAgentOnline}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-0 md:p-3 selection:bg-indigo-600 selection:text-white font-sans overflow-x-hidden">
      {/* Container: changes style according to Windows / Android / Full Web display mode */}
      <div
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden ${
          osMode === 'windows'
            ? 'h-screen md:h-[96vh] md:max-w-7xl md:rounded-2xl border border-slate-800 shadow-2xl bg-slate-950'
            : osMode === 'android'
            ? 'h-screen md:h-[92vh] md:max-w-[430px] md:rounded-[42px] border-4 border-slate-800 shadow-2xl bg-slate-950 ring-1 ring-slate-700/50'
            : 'h-screen w-full bg-slate-950'
        }`}
      >
        {/* Windows OS Title Bar Simulation */}
        {osMode === 'windows' && (
          <div className="h-8 bg-slate-900 border-b border-slate-800/80 px-3 flex items-center justify-between text-xs text-slate-400 select-none shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" />
              <span className="font-semibold text-slate-300 text-[11px]">
                OmniAssist OS — Enterprise Assistant, Mini-Agent Swarm, Social & E-Commerce
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => sound.playClick()}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                title="Minimize window"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => sound.playClick()}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                title="Maximize window"
              >
                <Square className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => sound.playClick()}
                className="p-1 hover:bg-rose-500 text-slate-400 hover:text-white rounded"
                title="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Android OS Status Bar Simulation */}
        {osMode === 'android' && (
          <div className="h-9 bg-slate-950 px-5 flex items-center justify-between text-[11px] font-mono text-slate-300 select-none shrink-0 border-b border-slate-800/60">
            <span>09:41</span>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 ring-1 ring-slate-800 mx-auto" />
            <div className="flex items-center gap-2 text-slate-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          activeView={activeView}
          osMode={osMode}
          setOsMode={setOsMode}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onQuickNewTask={() => { setActiveView('tasks'); }}
          pomodoroSeconds={pomodoroSeconds}
          pomodoroActive={pomodoroActive}
          onTogglePomodoro={() => setPomodoroActive(!pomodoroActive)}
          onResetPomodoro={() => { setPomodoroActive(false); setPomodoroSeconds(25 * 60); }}
        />

        {/* Main Body: Sidebar + Active View */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar */}
          <div className={`${osMode === 'android' ? 'hidden' : 'hidden md:flex'} h-full`}>
            <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              taskCount={{ pending: pendingTasksCount, total: tasks.length }}
              agentOnline={agentOnline}
              onToggleDaemonOnline={() => setAgentOnline(!agentOnline)}
              onDownloadDaemon={handleDownloadDaemon}
            />
          </div>

          {/* Active View Container */}
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {renderActiveView()}
          </main>
        </div>

        {/* Android / Mobile Bottom Bar */}
        {(osMode === 'android' || window.innerWidth < 768) && (
          <nav className="h-14 border-t border-slate-800 bg-slate-900/95 flex items-center justify-around px-2 shrink-0 select-none">
            <button
              onClick={() => { sound.playClick(); setActiveView('assistant'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                activeView === 'assistant' ? 'text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Copilot</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveView('tasks'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                activeView === 'tasks' ? 'text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tasks</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveView('subagents'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                activeView === 'subagents' ? 'text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Swarm</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveView('skills'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                activeView === 'skills' ? 'text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>Skills</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveView('ecommerce'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] ${
                activeView === 'ecommerce' ? 'text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Store</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveView('machine'); }}
              className={`relative flex flex-col items-center gap-0.5 text-[10px] ${
                activeView === 'machine' ? 'text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <Terminal className="w-4 h-4" />
                {agentOnline && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80 duration-1000" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-heartbeat" />
                  </span>
                )}
              </div>
              <span>Terminal</span>
            </button>
          </nav>
        )}

        {/* Android bottom gesture pill */}
        {osMode === 'android' && (
          <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-slate-700/60" />
          </div>
        )}
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={setActiveView}
        onQuickNewTask={() => setActiveView('tasks')}
        onTogglePomodoro={() => setPomodoroActive(!pomodoroActive)}
        onSetOsMode={setOsMode}
        onDownloadDaemon={handleDownloadDaemon}
      />
    </div>
  );
}
