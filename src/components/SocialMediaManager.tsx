/**
 * Autonomous Social Media Manager & Multi-Platform Publisher
 * Platform adapters for X, Instagram, LinkedIn, YouTube with scheduled publishing,
 * preview cards, and human-in-the-loop approval gates.
 */

import React, { useState } from 'react';
import { SocialMediaPost, PermissionMode } from '../types/agent';
import { 
  Share2, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink,
  ThumbsUp,
  Eye,
  Repeat
} from 'lucide-react';

// Custom X (Twitter) icon
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className || "w-4 h-4"} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialMediaManagerProps {
  posts: SocialMediaPost[];
  onApprovePost: (postId: string) => void;
  onSchedulePost: (newPost: SocialMediaPost) => void;
  permissionMode: PermissionMode;
}

export const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({
  posts,
  onApprovePost,
  onSchedulePost,
  permissionMode,
}) => {
  const [selectedPost, setSelectedPost] = useState<SocialMediaPost>(posts[0] || {
    id: 'post_1',
    platforms: ['instagram', 'twitter', 'linkedin'],
    title: 'Aetheris Autonomous AI Agent Announcement',
    content: 'Introducing Aetheris: The next-generation autonomous AI digital employee with a realistic 3D virtual human that interacts with applications, clicks buttons, types, and automates real workflows.',
    hashtags: ['#AIAgent', '#VirtualHuman', '#Automation', '#Tech2026'],
    status: 'pending_approval',
    scheduledFor: 'Tomorrow at 10:00 AM',
    engagementStats: { views: 1240, likes: 284, shares: 62 },
  });

  const [activePlatformPreview, setActivePlatformPreview] = useState<'instagram' | 'twitter' | 'linkedin'>('instagram');

  return (
    <div className="flex flex-col h-full w-full rounded-2xl cyber-glass border border-cyan-500/20 p-4 overflow-hidden shadow-2xl">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-pink-400" />
              <span>Autonomous Social Media Operations</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-mono">
              OFFICIAL API GATEWAY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-platform preparation, approval gating, and autonomous scheduled publication.
          </p>
        </div>

        {/* Platform Connection Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
            <Instagram className="w-3.5 h-3.5 text-pink-400" /> Active
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
            <TwitterXIcon className="w-3.5 h-3.5 text-slate-200" /> Active
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
            <Linkedin className="w-3.5 h-3.5 text-blue-400" /> Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        
        {/* Posts Queue List */}
        <div className="lg:col-span-5 flex flex-col justify-between overflow-y-auto space-y-2 pr-1">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
              PUBLISHING PIPELINE ({posts.length})
            </span>

            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedPost.id === post.id
                    ? 'bg-pink-950/30 border-pink-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {post.platforms.includes('instagram') && <Instagram className="w-3 h-3 text-pink-400" />}
                    {post.platforms.includes('twitter') && <TwitterXIcon className="w-3 h-3 text-slate-300" />}
                    {post.platforms.includes('linkedin') && <Linkedin className="w-3 h-3 text-blue-400" />}
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">{post.title}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                    post.status === 'published' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : post.status === 'pending_approval' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {post.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans mb-2">
                  {post.content}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Clock className="w-3 h-3" /> {post.scheduledFor}
                  </span>
                  {post.engagementStats && (
                    <span>{post.engagementStats.views} views</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs font-mono text-slate-400">
            <span className="text-cyan-400 block mb-1">AUTOMATION RULE #12</span>
            <span>All media posts require Human-in-the-Loop signature before official network deployment.</span>
          </div>
        </div>

        {/* Live Multi-Platform Post Preview & Approval Card */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-slate-950/80 border border-slate-800 p-4">
          
          <div>
            {/* Preview Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <span className="text-xs font-mono text-slate-400">PLATFORM SPECIFIC RENDERING:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePlatformPreview('instagram')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    activePlatformPreview === 'instagram'
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </button>
                <button
                  onClick={() => setActivePlatformPreview('twitter')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    activePlatformPreview === 'twitter'
                      ? 'bg-slate-800 text-slate-100 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TwitterXIcon className="w-3.5 h-3.5" /> X (Twitter)
                </button>
                <button
                  onClick={() => setActivePlatformPreview('linkedin')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    activePlatformPreview === 'linkedin'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </button>
              </div>
            </div>

            {/* Simulated Native Card */}
            <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800/80 space-y-3 font-sans">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-bold text-cyan-300 text-xs font-mono">
                  AE
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Aetheris Autonomous AI</h4>
                  <span className="text-[10px] text-slate-400 font-mono">@aetheris_ai · Scheduled for {selectedPost.scheduledFor}</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedPost.content}
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.hashtags.map((h, i) => (
                  <span key={i} className="text-cyan-400 text-xs font-medium hover:underline cursor-pointer">
                    {h}
                  </span>
                ))}
              </div>

              {/* Media Preview Box */}
              <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900/80 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-1.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Autonomous 3D Virtual Human Video Render</span>
                <span className="text-[10px] text-slate-400">1080x1920 (9:16 Vertical Reel) · Generated by Autonomous Agent</span>
              </div>
            </div>
          </div>

          {/* Action Approval Barrier */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-mono">
                {selectedPost.status === 'pending_approval' 
                  ? 'Awaiting Operator Authorization' 
                  : 'Post Status: Verified & Approved'}
              </span>
            </div>

            {selectedPost.status === 'pending_approval' && (
              <button
                onClick={() => onApprovePost(selectedPost.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Schedule Post</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
