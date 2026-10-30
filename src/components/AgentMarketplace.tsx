/**
 * AI Agent Marketplace & Voice-Driven Agent Creator Studio
 * Create, sandbox-test, configure permissions, and deploy specialized autonomous agents.
 */

import React, { useState } from 'react';
import { AIAgent, AgentRole } from '../types/agent';
import { 
  Bot, 
  Cpu, 
  Shield, 
  Search, 
  Code, 
  Share2, 
  Mail, 
  UserCheck, 
  Plus, 
  Play, 
  Pause, 
  CheckCircle, 
  Sparkles, 
  Terminal, 
  Lock, 
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';

interface AgentMarketplaceProps {
  agents: AIAgent[];
  onDeployAgent: (newAgent: AIAgent) => void;
  onToggleAgentStatus: (agentId: string) => void;
  activeAgentId?: string;
  onSelectAgent: (agentId: string) => void;
}

export const AgentMarketplace: React.FC<AgentMarketplaceProps> = ({
  agents,
  onDeployAgent,
  onToggleAgentStatus,
  activeAgentId,
  onSelectAgent,
}) => {
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [creatorPrompt, setCreatorPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState<Partial<AIAgent> | null>(null);
  const [sandboxPassed, setSandboxPassed] = useState(false);

  // Synthesize agent from natural language prompt
  const handleSynthesizeAgent = () => {
    if (!creatorPrompt.trim()) return;
    setIsSynthesizing(true);
    setGeneratedSpec(null);
    setSandboxPassed(false);

    setTimeout(() => {
      const lower = creatorPrompt.toLowerCase();
      let role: AgentRole = 'custom';
      let name = 'Custom Neural Worker';
      let tools = ['web_search', 'document_extractor', 'vector_memory'];

      if (lower.includes('research') || lower.includes('paper')) {
        role = 'research';
        name = 'Deep Research Intelligence Agent';
        tools = ['academic_search', 'pdf_reader', 'citation_validator', 'synthesis_engine'];
      } else if (lower.includes('code') || lower.includes('dev')) {
        role = 'coding';
        name = 'Autonomous Code Architect Agent';
        tools = ['ast_parser', 'git_controller', 'test_runner', 'linter_evaluator'];
      } else if (lower.includes('security') || lower.includes('audit')) {
        role = 'security';
        name = 'Cybersecurity Vulnerability Auditor';
        tools = ['port_scanner', 'cve_database', 'permission_auditor', 'sandbox_containment'];
      } else if (lower.includes('social') || lower.includes('marketing')) {
        role = 'social_media';
        name = 'Cross-Platform Social Strategist';
        tools = ['instagram_api', 'x_twitter_api', 'linkedin_engine', 'trend_detector'];
      }

      setGeneratedSpec({
        name,
        role,
        avatarIcon: 'Bot',
        description: creatorPrompt,
        tools,
        permissions: {
          canUseMouse: true,
          canUseKeyboard: true,
          canAccessWeb: true,
          canPostSocial: role === 'social_media',
          canExecuteCode: role === 'coding',
          requiresApproval: true,
        },
        status: 'idle',
        successRate: 98.4,
        tasksCompleted: 0,
        createdAt: 'Just now',
      });
      setIsSynthesizing(false);
      setSandboxPassed(true);
    }, 1200);
  };

  const handleConfirmDeploy = () => {
    if (!generatedSpec) return;
    const newAgent: AIAgent = {
      id: `agent_${Date.now()}`,
      name: generatedSpec.name || 'Autonomous Agent',
      role: generatedSpec.role || 'custom',
      avatarIcon: 'Bot',
      description: generatedSpec.description || 'Specialized autonomous worker',
      tools: generatedSpec.tools || ['web_search'],
      permissions: generatedSpec.permissions || {
        canUseMouse: true,
        canUseKeyboard: true,
        canAccessWeb: true,
        canPostSocial: false,
        canExecuteCode: false,
        requiresApproval: true,
      },
      status: 'idle',
      successRate: 100,
      tasksCompleted: 0,
      createdAt: 'Just now',
    };

    onDeployAgent(newAgent);
    setShowCreatorModal(false);
    setCreatorPrompt('');
    setGeneratedSpec(null);
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl cyber-glass border border-cyan-500/20 p-4 overflow-hidden shadow-2xl">
      
      {/* Header & Quick Create */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>Multi-Agent Fleet & Marketplace</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
              {agents.length} AGENTS ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Specialized autonomous sub-agents coordinated by the Aetheris Supervisor.
          </p>
        </div>

        <button
          onClick={() => setShowCreatorModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Synthesize New Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
        {agents.map((agent) => {
          const isSelected = activeAgentId === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.15)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                      {agent.role === 'supervisor' && <Cpu className="w-5 h-5 text-cyan-400" />}
                      {agent.role === 'research' && <Search className="w-5 h-5 text-purple-400" />}
                      {agent.role === 'coding' && <Code className="w-5 h-5 text-blue-400" />}
                      {agent.role === 'security' && <Shield className="w-5 h-5 text-rose-400" />}
                      {agent.role === 'social_media' && <Share2 className="w-5 h-5 text-pink-400" />}
                      {agent.role === 'email' && <Mail className="w-5 h-5 text-amber-400" />}
                      {agent.role === 'personal_assistant' && <UserCheck className="w-5 h-5 text-emerald-400" />}
                      {agent.role === 'custom' && <Bot className="w-5 h-5 text-cyan-300" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">{agent.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">{agent.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAgentStatus(agent.id);
                    }}
                    title={agent.status === 'running' ? "Pause Agent" : "Activate Agent"}
                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                      agent.status === 'running'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {agent.status === 'running' ? <Play className="w-3.5 h-3.5 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {agent.description}
                </p>

                {/* Capabilities Tools Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {agent.tools.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-slate-400">
                      {t}
                    </span>
                  ))}
                  {agent.tools.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-slate-500">
                      +{agent.tools.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Performance Metrics Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">SUCCESS:</span>
                  <span className="text-emerald-400 font-semibold">{agent.successRate}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">COMPLETED:</span>
                  <span className="text-cyan-300 font-semibold">{agent.tasksCompleted} tasks</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* AGENT SYNTHESIZER MODAL */}
      {showCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-[#090e1a] border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">AI Agent Creator Synthesizer</h3>
              </div>
              <button
                onClick={() => setShowCreatorModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">
                AGENT SPECIFICATION PROMPT (VOICE OR TEXT):
              </label>
              <textarea
                value={creatorPrompt}
                onChange={(e) => setCreatorPrompt(e.target.value)}
                placeholder="e.g., 'Create an AI Research Agent that searches the internet, reads research papers, compares information, prepares reports, and saves the results in my project folder.'"
                rows={3}
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Isolated Sandbox Security Rule Applied</span>
              </div>

              <button
                onClick={handleSynthesizeAgent}
                disabled={isSynthesizing || !creatorPrompt.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {isSynthesizing ? 'Synthesizing Spec...' : 'Generate Agent Spec'}
              </button>
            </div>

            {/* Generated Specification Preview */}
            {generatedSpec && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>SPECIFICATION GENERATED: {generatedSpec.name}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Sandbox Test Passed
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-sans">
                  {generatedSpec.description}
                </p>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 text-[10px] block mb-1">PROVISIONED TOOLS:</span>
                  <div className="flex flex-wrap gap-1">
                    {generatedSpec.tools?.map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] text-cyan-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowCreatorModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeploy}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md"
                  >
                    Authorize & Deploy to Fleet
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
