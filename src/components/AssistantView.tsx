import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowRight, 
  Server, 
  Layers, 
  Code2, 
  Calendar, 
  CheckSquare, 
  Terminal as TerminalIcon,
  Bot
} from 'lucide-react';
import { ChatMessage, ActionPayload, Task, ScheduleEvent, CodeSnippet } from '../types';
import { sound } from '../utils/audio';

interface AssistantViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
  onExecuteAction: (action: ActionPayload) => void;
  activeProvider: 'gemini' | 'ollama' | 'groq';
  setActiveProvider: (provider: 'gemini' | 'ollama' | 'groq') => void;
  ollamaModel: string;
  setOllamaModel: (m: string) => void;
  groqKey: string;
  setGroqKey: (k: string) => void;
  onNavigateToView: (view: any) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  messages,
  onSendMessage,
  loading,
  onExecuteAction,
  activeProvider,
  setActiveProvider,
  ollamaModel,
  setOllamaModel,
  groqKey,
  setGroqKey,
  onNavigateToView,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [executedActionIds, setExecutedActionIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    sound.playClick();
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your request directly.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  const handleSpeak = (text: string) => {
    sound.playClick();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown code blocks from speech
      const cleaned = text.replace(/```[\s\S]*?```/g, 'code snippet attached').replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleaned.slice(0, 300));
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    sound.playClick();
    const query = input;
    setInput('');
    await onSendMessage(query);
  };

  const handleRunAction = (msgId: string, actionPayload: ActionPayload) => {
    sound.playSuccess();
    onExecuteAction(actionPayload);
    setExecutedActionIds((prev) => ({ ...prev, [msgId]: true }));
  };

  const quickPrompts = [
    {
      title: 'Scaffold ERP Architecture',
      subtitle: 'Inventory, Supabase RLS & Vercel deployment',
      prompt: 'Scaffold a complete Enterprise Inventory & Warehouse ERP architecture with Supabase SQL schemas, RLS policies, and Vercel edge deployment config.',
      icon: Layers,
    },
    {
      title: 'Schedule Deep Coding Block',
      subtitle: 'Add 90m focused session to timeline',
      prompt: 'Schedule a 90 minute deep coding session on my calendar starting at 15:30 dedicated to Supabase PostgreSQL real-time sync.',
      icon: Calendar,
    },
    {
      title: 'Create Urgent Dev Task',
      subtitle: 'Verify Vercel edge token headers',
      prompt: 'Create a high-priority dev task: "Audit and verify Vercel authorization tokens in Supabase edge function calls" due by tomorrow 5pm.',
      icon: CheckSquare,
    },
    {
      title: 'Test Local Machine & Ollama',
      subtitle: 'Ping local agent daemon on port 11434',
      prompt: 'Diagnose local machine agent status and verify if Ollama llama3 model is available for offline execution.',
      icon: TerminalIcon,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Assistant Header & Engine Config */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/src/assets/images/assistant_avatar_1793137904222.jpg"
              alt="OmniAssist Core"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-indigo-500/40 shadow-xs"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100">OmniAssist Copilot</span>
              <span className="text-[11px] text-slate-400 font-mono">v2.4 Active</span>
            </div>
            <p className="text-xs text-slate-400">
              Task Scheduler · Code Engine · Supabase · Vercel · GitHub · Machine Bridge
            </p>
          </div>
        </div>

        {/* Multi-Engine Selector (Gemini / Ollama / Groq) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => { sound.playClick(); setActiveProvider('gemini'); }}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                activeProvider === 'gemini'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gemini 3.8 Flash
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveProvider('ollama'); }}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                activeProvider === 'ollama'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Local Ollama
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveProvider('groq'); }}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                activeProvider === 'groq'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Groq Free API
            </button>
          </div>

          {activeProvider === 'ollama' && (
            <input
              type="text"
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              placeholder="Model (e.g. llama3)"
              className="w-28 text-xs bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 font-mono"
            />
          )}

          {activeProvider === 'groq' && (
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="Groq API Key (gsk_...)"
              className="w-36 text-xs bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 font-mono"
            />
          )}

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            title={speechEnabled ? 'Mute Assistant Voice' : 'Enable Speech Output'}
            className={`p-1.5 rounded-lg border transition-colors ${
              speechEnabled
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/5">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Welcome to OmniAssist OS
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                Your unified assistant for daily life, scheduling, dev workflows with GitHub, Supabase & Vercel, and machine control.
              </p>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {quickPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(item.prompt);
                    }}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5 mb-1 text-slate-200 font-medium text-xs group-hover:text-indigo-400 transition-colors">
                      <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const hasAction = !!msg.actionPayload;
          const isExecuted = executedActionIds[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {!isUser ? (
                <img
                  src="/src/assets/images/assistant_avatar_1793137904222.jpg"
                  alt="Assistant"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-700 ring-1 ring-indigo-500/30 mt-1"
                />
              ) : (
                <img
                  src="/src/assets/images/developer_avatar_1793137904918.jpg"
                  alt="User"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-700 mt-1"
                />
              )}

              <div className={`space-y-2 max-w-[85%] ${isUser ? 'items-end' : ''}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {/* Render content, stripping action json block for clean readability */}
                    {msg.content.replace(/```action[\s\S]*?```/g, '').trim()}
                  </div>

                  {!isUser && (
                    <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Structured Action Execution Card */}
                {hasAction && msg.actionPayload && (
                  <div className="p-3 bg-slate-900/95 border border-indigo-500/30 rounded-xl space-y-2 shadow-sm shadow-indigo-500/5">
                    <div className="flex items-center justify-between text-xs font-medium text-indigo-300">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Suggested System Action: <span className="font-mono uppercase text-[11px] text-slate-200">{msg.actionPayload.action.replace('_', ' ')}</span>
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                      {msg.actionPayload.action === 'create_task' && (
                        <div>
                          <div className="text-white font-sans font-medium">{msg.actionPayload.data.title}</div>
                          <div className="text-slate-400 text-[11px]">Priority: {msg.actionPayload.data.priority} · Category: {msg.actionPayload.data.category}</div>
                        </div>
                      )}
                      {msg.actionPayload.action === 'schedule_event' && (
                        <div>
                          <div className="text-white font-sans font-medium">{msg.actionPayload.data.title}</div>
                          <div className="text-slate-400 text-[11px]">Time: {msg.actionPayload.data.time} ({msg.actionPayload.data.durationMinutes || 60}m)</div>
                        </div>
                      )}
                      {msg.actionPayload.action === 'create_snippet' && (
                        <div>
                          <div className="text-white font-sans font-medium">{msg.actionPayload.data.title}</div>
                          <div className="text-indigo-400 text-[11px]">Language: {msg.actionPayload.data.language}</div>
                        </div>
                      )}
                      {msg.actionPayload.action === 'run_terminal' && (
                        <div>
                          <div className="text-emerald-400">$ {msg.actionPayload.data.command}</div>
                          <div className="text-slate-400 text-[11px] font-sans">{msg.actionPayload.data.description}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {isExecuted ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Action Executed & Saved</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRunAction(msg.id, msg.actionPayload!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
                        >
                          <span>Execute in System</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 max-w-md">
            <img
              src="/src/assets/images/assistant_avatar_1793137904222.jpg"
              alt="Assistant"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-700"
            />
            <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-xs text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>OmniAssist is synthesizing request...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? 'Stop listening' : 'Start voice dictation'}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
              isRecording
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask OmniAssist: schedule calendar, write Supabase SQL, deploy Vercel, run machine command..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors shrink-0 shadow-xs shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-500 max-w-4xl mx-auto mt-2 px-1">
          <span>Engine: <strong className="text-slate-400 capitalize">{activeProvider}</strong></span>
          <span>Press Enter to send · Auto-executes tasks & scheduling</span>
        </div>
      </div>
    </div>
  );
};
