/**
 * Top Navigation Header & System Telemetry Bar
 */

import React from 'react';
import { 
  Bot, 
  Layers, 
  Share2, 
  Brain, 
  Shield, 
  AlertOctagon, 
  BookOpen, 
  CheckCircle2, 
  Activity, 
  Cpu,
  Monitor
} from 'lucide-react';

interface NavigationHeaderProps {
  activeTab: 'command' | 'agents' | 'social' | 'memory' | 'security';
  onSelectTab: (tab: 'command' | 'agents' | 'social' | 'memory' | 'security') => void;
  onOpenArchitecture: () => void;
  isEmergencyHalted: boolean;
  onEmergencyHalt: () => void;
  onResumeSystem: () => void;
  activeAgentCount: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenArchitecture,
  isEmergencyHalted,
  onEmergencyHalt,
  onResumeSystem,
  activeAgentCount,
}) => {
  return (
    <header className="w-full bg-[#070c18]/90 border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
      
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
          <div className="w-full h-full bg-[#070b16] rounded-[10px] flex items-center justify-center text-cyan-400 font-mono font-black text-sm">
            Æ
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-100 font-mono">
              AETHERIS <span className="text-cyan-400 font-normal text-xs sm:text-sm">OS</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
              v2.5 AUTONOMOUS
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Autonomous 3D AI Digital Employee & Computer-Use Controller
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
        <button
          onClick={() => onSelectTab('command')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'command'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Command Deck</span>
        </button>

        <button
          onClick={() => onSelectTab('agents')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'agents'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Agent Fleet</span>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1 rounded">{activeAgentCount}</span>
        </button>

        <button
          onClick={() => onSelectTab('social')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'social'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Social Hub</span>
        </button>

        <button
          onClick={() => onSelectTab('memory')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'memory'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Memory</span>
        </button>

        <button
          onClick={() => onSelectTab('security')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'security'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Security</span>
        </button>
      </nav>

      {/* Right Controls: Architecture Blueprint + Emergency STOP */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all shadow-sm"
          title="Open Master 14-Point Architecture Specification"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Phase 1 Blueprint</span>
        </button>

        {isEmergencyHalted ? (
          <button
            onClick={onResumeSystem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all shadow-md animate-pulse"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RESUME</span>
          </button>
        ) : (
          <button
            onClick={onEmergencyHalt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all shadow-[0_0_14px_rgba(244,63,94,0.4)]"
            title="Immediate emergency kill switch halts all agent operations"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EMERGENCY STOP</span>
          </button>
        )}
      </div>

    </header>
  );
};
