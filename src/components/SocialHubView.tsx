import React, { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Github, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  Send, 
  Calendar, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  Clock,
  ThumbsUp,
  BarChart3,
  Bot
} from 'lucide-react';
import { SocialPost, SocialPlatform } from '../types';
import { sound } from '../utils/audio';

interface SocialHubViewProps {
  posts: SocialPost[];
  onAddPost: (post: SocialPost) => void;
}

export const SocialHubView: React.FC<SocialHubViewProps> = ({ posts, onAddPost }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [composeTopic, setComposeTopic] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<SocialPlatform[]>(['twitter', 'linkedin']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredPosts = posts.filter(
    (p) => selectedPlatform === 'All' || p.platform === selectedPlatform
  );

  const handleCopy = (text: string, idx: number) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateSocialCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTopic.trim()) return;
    setIsGenerating(true);
    sound.playClick();

    try {
      const res = await fetch('/api/social/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: composeTopic,
          platforms: targetPlatforms,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate social copy');
      const data = await res.json();
      setGeneratedDrafts(data.posts || []);
      sound.playSuccess();
    } catch (err: any) {
      alert(`Social generator error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishDraft = (draft: any) => {
    sound.playSuccess();
    const newPost: SocialPost = {
      id: `soc-${Date.now()}`,
      platform: draft.platform || 'twitter',
      author: 'OmniAssist Official',
      handle: draft.platform === 'twitter' ? '@omniassist_os' : 'omniassist-technologies',
      content: draft.content,
      timestamp: 'Just now',
      likes: 1,
      shares: 0,
      comments: 0,
      sentiment: 'positive',
      tags: draft.hashtags || ['Tech'],
    };
    onAddPost(newPost);
    setGeneratedDrafts((prev) => prev.filter((d) => d !== draft));
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'linkedin': return Linkedin;
      case 'github': return Github;
      case 'reddit': return MessageSquare;
      default: return Share2;
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'linkedin': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'github': return 'text-slate-200 bg-slate-800 border-slate-700';
      case 'reddit': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Omni-Channel Social Media Command Center</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time multi-platform monitor: Twitter/X, LinkedIn, Reddit, and GitHub community channels
          </p>
        </div>

        {/* Platform Filter Buttons */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          {['All', 'twitter', 'linkedin', 'reddit', 'github'].map((p) => (
            <button
              key={p}
              onClick={() => { sound.playClick(); setSelectedPlatform(p); }}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                selectedPlatform === p
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'twitter' ? 'X / Twitter' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout: Social Feed Stream + AI Content Composer */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Aggregated Social Feed Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Aggregated Community Feed ({filteredPosts.length} posts)</span>
            <span className="font-mono text-emerald-400 text-[11px]">Sentiment: 92% Positive</span>
          </div>

          {filteredPosts.map((post) => {
            const Icon = getPlatformIcon(post.platform);
            const colorClass = getPlatformColor(post.platform);

            return (
              <div
                key={post.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xs space-y-3"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border text-xs ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{post.author}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{post.handle}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums">{post.timestamp}</span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Tags and metrics */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{post.shares}</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{post.comments}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: AI Social Growth Director (Composer & Scheduler) */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-slate-900/40 p-4 overflow-y-auto space-y-4 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Social Copilot & Cross-Poster</span>
          </div>

          <form onSubmit={handleGenerateSocialCopy} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Announcement / Topic
              </label>
              <textarea
                rows={3}
                required
                value={composeTopic}
                onChange={(e) => setComposeTopic(e.target.value)}
                placeholder="e.g. Announce Cyberdeck Batch 2 shipping next week with custom mechanical switches and Supabase real-time sync..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Channels
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['twitter', 'linkedin', 'reddit', 'instagram'] as SocialPlatform[]).map((plt) => {
                  const isChecked = targetPlatforms.includes(plt);
                  return (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTargetPlatforms((prev) =>
                          prev.includes(plt) ? prev.filter((p) => p !== plt) : [...prev, plt]
                        );
                      }}
                      className={`p-2 rounded-lg border text-left text-xs capitalize transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-600/15 border-indigo-500 text-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{plt === 'twitter' ? 'X / Twitter' : plt}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !composeTopic.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs shadow-indigo-500/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting Viral Copy with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Multi-Platform Copy</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Drafts Preview */}
          {generatedDrafts.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200">
                AI Generated Post Drafts
              </h4>
              {generatedDrafts.map((draft, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-indigo-400 font-mono capitalize text-[11px]">
                    <span>{draft.platform}</span>
                    <span className="text-slate-500">{draft.bestTimeToPost || 'Peak 14:00'}</span>
                  </div>

                  <p className="text-slate-300 font-sans leading-relaxed">{draft.content}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                    <button
                      onClick={() => handleCopy(draft.content, idx)}
                      className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => handlePublishDraft(draft)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
