/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CharacterAction, 
  PermissionMode, 
  AIAgent, 
  TaskWorkflow, 
  TaskStep, 
  ScreenElement, 
  SocialMediaPost, 
  MemoryItem, 
  AuditLogEntry 
} from './types/agent';
import { NavigationHeader } from './components/NavigationHeader';
import { VirtualHumanCanvas } from './components/VirtualHumanCanvas';
import { ComputerUseSimulator } from './components/ComputerUseSimulator';
import { VoiceAssistantBar } from './components/VoiceAssistantBar';
import { AgentMarketplace } from './components/AgentMarketplace';
import { SocialMediaManager } from './components/SocialMediaManager';
import { MemoryCenter } from './components/MemoryCenter';
import { SecurityCenter } from './components/SecurityCenter';
import { TaskMonitor } from './components/TaskMonitor';
import { ArchitectureModal } from './components/ArchitectureModal';
import { 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Command,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function App() {
  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState<'command' | 'agents' | 'social' | 'memory' | 'security'>('command');
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);

  // Security & Safety State
  const [permissionMode, setPermissionMode] = useState<PermissionMode>('assisted');
  const [isEmergencyHalted, setIsEmergencyHalted] = useState(false);

  // 3D Virtual Human Character State
  const [currentAction, setCurrentAction] = useState<CharacterAction>('idle');
  const [targetCoords, setTargetCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [speechText, setSpeechText] = useState<string>('Greetings operator. Aetheris autonomous virtual engine online. Ready to observe screen and execute tasks.');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [floatingMode, setFloatingMode] = useState<boolean>(false);

  // Computer Use Simulation State
  const [activeAppId, setActiveAppId] = useState<string>('instagram');
  const [virtualCursorPos, setVirtualCursorPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [highlightedElementId, setHighlightedElementId] = useState<string | undefined>(undefined);
  const [showVisionOverlays, setShowVisionOverlays] = useState<boolean>(true);

  // Fleet & Agents State
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: 'agent_supervisor',
      name: 'Aetheris Supervisor Core',
      role: 'supervisor',
      avatarIcon: 'Cpu',
      description: 'Central autonomous orchestrator. Decomposes instructions, plans DAG dependencies, and coordinates specialized sub-agents.',
      tools: ['dag_planner', 'agent_delegator', 'vision_grounding', 'approval_gate'],
      permissions: { canUseMouse: true, canUseKeyboard: true, canAccessWeb: true, canPostSocial: true, canExecuteCode: true, requiresApproval: false },
      status: 'running',
      successRate: 99.8,
      tasksCompleted: 412,
      createdAt: 'System Init',
    },
    {
      id: 'agent_research',
      name: 'Deep Research Agent',
      role: 'research',
      avatarIcon: 'Search',
      description: 'Searches academic repositories, reads PDF documents, synthesizes verified summaries, and cites peer-reviewed sources.',
      tools: ['arxiv_fetcher', 'pdf_ocr_reader', 'semantic_dedup', 'citation_graph'],
      permissions: { canUseMouse: false, canUseKeyboard: false, canAccessWeb: true, canPostSocial: false, canExecuteCode: false, requiresApproval: false },
      status: 'running',
      successRate: 98.6,
      tasksCompleted: 189,
      createdAt: 'System Init',
    },
    {
      id: 'agent_coding',
      name: 'Code & Systems Developer',
      role: 'coding',
      avatarIcon: 'Code',
      description: 'Generates TypeScript/Python modules, runs sandboxed test suites, reviews AST diffs, and inspects build pipelines.',
      tools: ['git_cli', 'sandbox_node', 'ast_refactor', 'test_evaluator'],
      permissions: { canUseMouse: true, canUseKeyboard: true, canAccessWeb: true, canPostSocial: false, canExecuteCode: true, requiresApproval: true },
      status: 'running',
      successRate: 97.4,
      tasksCompleted: 264,
      createdAt: 'System Init',
    },
    {
      id: 'agent_social',
      name: 'Social Media Strategist',
      role: 'social_media',
      avatarIcon: 'Share2',
      description: 'Prepares platform-specific drafts for Instagram, X (Twitter), and LinkedIn, suggests hashtags, and manages schedule.',
      tools: ['meta_graph_api', 'x_twitter_v2', 'linkedin_ugc', 'image_pipeline'],
      permissions: { canUseMouse: true, canUseKeyboard: true, canAccessWeb: true, canPostSocial: true, canExecuteCode: false, requiresApproval: true },
      status: 'running',
      successRate: 99.1,
      tasksCompleted: 338,
      createdAt: 'System Init',
    },
    {
      id: 'agent_security',
      name: 'Cyber Sentinel & Auditor',
      role: 'security',
      avatarIcon: 'Shield',
      description: 'Inspects command injections, audits sandbox permissions, monitors rate limits, and validates cryptographic audit trails.',
      tools: ['cve_scanner', 'prompt_injection_guard', 'sha256_hasher', 'sandbox_jailer'],
      permissions: { canUseMouse: false, canUseKeyboard: false, canAccessWeb: false, canPostSocial: false, canExecuteCode: false, requiresApproval: false },
      status: 'running',
      successRate: 100,
      tasksCompleted: 1205,
      createdAt: 'System Init',
    },
  ]);
  const [activeAgentId, setActiveAgentId] = useState<string>('agent_supervisor');

  // Task Workflow State
  const [activeWorkflow, setActiveWorkflow] = useState<TaskWorkflow>({
    id: 'wf_instagram_post',
    title: 'Autonomous Workflow: Instagram Creator Studio Upload',
    category: 'social',
    status: 'in_progress',
    progress: 40,
    currentStepIndex: 1,
    steps: [
      {
        id: 'step_1',
        order: 1,
        description: 'Observe screen and navigate to Instagram Creator Studio',
        targetApp: 'Instagram',
        actionType: 'navigate',
        targetCoords: { x: 12, y: 18 },
        status: 'completed',
        result: 'Instagram Creator Studio loaded in sandbox browser frame.',
        assignedAgent: 'agent_social',
      },
      {
        id: 'step_2',
        order: 2,
        description: 'Target "Drop Media Area" and attach authorized 4K Virtual Human Reel',
        targetApp: 'Instagram',
        actionType: 'click',
        targetElement: 'ig_upload_box',
        targetCoords: { x: 47, y: 53 },
        status: 'active',
        assignedAgent: 'agent_social',
      },
      {
        id: 'step_3',
        order: 3,
        description: 'Fill caption text field with AI generated hashtags',
        targetApp: 'Instagram',
        actionType: 'type',
        targetElement: 'ig_caption_input',
        targetCoords: { x: 83, y: 45 },
        status: 'pending',
        assignedAgent: 'agent_social',
      },
      {
        id: 'step_4',
        order: 4,
        description: 'Request Operator Approval before final network publication',
        targetApp: 'Instagram',
        actionType: 'approval_request',
        targetElement: 'ig_publish_btn',
        targetCoords: { x: 90, y: 85 },
        status: 'pending',
        assignedAgent: 'agent_supervisor',
      },
      {
        id: 'step_5',
        order: 5,
        description: 'Observe screen and verify HTTP 200 post URL confirmation',
        targetApp: 'Instagram',
        actionType: 'verify',
        status: 'pending',
        assignedAgent: 'agent_supervisor',
      },
    ],
  });

  // Social Posts State
  const [posts, setPosts] = useState<SocialMediaPost[]>([
    {
      id: 'post_1',
      platforms: ['instagram', 'twitter', 'linkedin'],
      title: 'Aetheris 3D Virtual Human Launch Demo',
      content: 'Autonomous AI digital employee live demo: Watch our 3D virtual human observe the screen, point to buttons, type code in VS Code, and publish media autonomously. Built with Three.js and Gemini Multimodal AI.',
      hashtags: ['#AIAgent', '#VirtualHuman', '#Automation', '#ThreeJS', '#ComputerUse'],
      status: 'pending_approval',
      scheduledFor: 'Tomorrow at 10:00 AM',
      engagementStats: { views: 4210, likes: 620, shares: 148 },
    },
    {
      id: 'post_2',
      platforms: ['twitter', 'linkedin'],
      title: 'Zero-Trust Computer Control Whitepaper',
      content: 'How Aetheris balances high autonomy with cryptographic safety: 3-tier permissions, isolated sandboxing, and real-time observation loops.',
      hashtags: ['#Cybersecurity', '#AIResearch', '#TechArchitecture'],
      status: 'scheduled',
      scheduledFor: 'Friday at 2:00 PM',
      engagementStats: { views: 1850, likes: 210, shares: 45 },
    },
  ]);

  // Memory State
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'mem_1',
      category: 'workflow',
      title: 'Social Media Publishing Rule',
      content: 'Always prepare posts in draft first. Never publish without human approval signature unless autonomous publishing mode is explicitly activated.',
      confidence: 0.99,
      tags: ['social', 'approval', 'safety'],
      lastAccessed: '2 mins ago',
    },
    {
      id: 'mem_2',
      category: 'project',
      title: 'Current Project Repository Context',
      content: 'Project "~/projects/aetheris-agent-core" is a Node.js/TypeScript autonomous multi-agent engine with Three.js presentation and Playwright automation.',
      confidence: 0.98,
      tags: ['coding', 'github', 'dev'],
      lastAccessed: '10 mins ago',
    },
    {
      id: 'mem_3',
      category: 'preference',
      title: 'Tone and Brand Voice Guidelines',
      content: 'Tone should be authoritative, futuristic, concise, and technically precise. Avoid marketing fluff or exaggerated claims.',
      confidence: 0.96,
      tags: ['brand', 'voice', 'copy'],
      lastAccessed: '1 hour ago',
    },
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log_1',
      timestamp: '12:05:14',
      agentId: 'agent_social',
      agentName: 'Social Media Strategist',
      action: 'Targeted Instagram Drop Media Area',
      targetApp: 'Instagram',
      riskLevel: 'low',
      status: 'auto_executed',
      details: 'Synthesized video attachment coordinate verified at {x: 47%, y: 53%}.',
    },
    {
      id: 'log_2',
      timestamp: '12:04:30',
      agentId: 'agent_supervisor',
      agentName: 'Aetheris Supervisor Core',
      action: 'Screen Observation & Element Tree Extraction',
      targetApp: 'Instagram',
      riskLevel: 'low',
      status: 'auto_executed',
      details: 'Detected 5 interactive bounding boxes with 97.2% average confidence.',
    },
    {
      id: 'log_3',
      timestamp: '12:02:11',
      agentId: 'agent_coding',
      agentName: 'Code & Systems Developer',
      action: 'Sandboxed Test Execution in VS Code',
      targetApp: 'VS Code',
      riskLevel: 'medium',
      status: 'approved',
      details: 'All 38 test suites passed in isolated container.',
    },
  ]);

  // Text-To-Speech with Virtual Human Lip-sync Viseme Callback
  const speakText = (text: string) => {
    setSpeechText(text);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentAction('speaking');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentAction('idle');
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentAction('idle');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setCurrentAction('speaking');
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentAction('idle');
      }, 3500);
    }
  };

  // Autonomous Natural Language Command Processor
  const handleCommandSubmit = (command: string) => {
    if (isEmergencyHalted) {
      speakText("System is in Emergency Lock. Please resume execution before assigning new tasks.");
      return;
    }

    const lower = command.toLowerCase();

    // 1. Instagram Command
    if (lower.includes('instagram') || lower.includes('upload') || lower.includes('post')) {
      setActiveAppId('instagram');
      speakText("Understood. Opening Instagram Creator Studio, observing screen elements, and staging your announcement post.");
      
      // Step 1: Walk to application and point
      setCurrentAction('walking');
      setTimeout(() => {
        // Step 2: Point to Drop Media
        setVirtualCursorPos({ x: 47, y: 53 });
        setTargetCoords({ x: 47, y: 53 });
        setCurrentAction('pointing');
        setHighlightedElementId('ig_upload_box');

        setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => setIsClicking(false), 300);

          // Step 3: Type caption
          setTimeout(() => {
            setVirtualCursorPos({ x: 83, y: 45 });
            setTargetCoords({ x: 83, y: 45 });
            setCurrentAction('typing');
            setHighlightedElementId('ig_caption_input');

            // Update workflow progress
            setActiveWorkflow(prev => ({
              ...prev,
              progress: 75,
              currentStepIndex: 3,
              steps: prev.steps.map((s, idx) => 
                idx <= 2 ? { ...s, status: 'completed', result: 'Completed' } :
                idx === 3 ? { ...s, status: 'waiting_approval' } : s
              )
            }));

            // Step 4: Seek Operator Approval
            setTimeout(() => {
              setCurrentAction('speaking');
              speakText("Media and caption prepared. Standing by publish button. Operator approval required before live publication.");
              setVirtualCursorPos({ x: 90, y: 85 });
              setTargetCoords({ x: 90, y: 85 });
              setHighlightedElementId('ig_publish_btn');
            }, 2500);

          }, 1500);

        }, 1200);

      }, 1000);

      return;
    }

    // 2. VS Code / Coding Command
    if (lower.includes('code') || lower.includes('vs code') || lower.includes('test')) {
      setActiveAppId('vscode');
      speakText("Switching to VS Code development workspace. Inspecting AST and running sandboxed test suite.");
      setCurrentAction('walking');

      setTimeout(() => {
        setVirtualCursorPos({ x: 91, y: 8 });
        setTargetCoords({ x: 91, y: 8 });
        setCurrentAction('pointing');
        setHighlightedElementId('vsc_run_tests_btn');

        setTimeout(() => {
          setIsClicking(true);
          setTimeout(() => setIsClicking(false), 300);
          setCurrentAction('typing');

          setTimeout(() => {
            setCurrentAction('verifying');
            speakText("All 38 agent verification tests passing with zero regressions.");
          }, 2000);
        }, 1200);
      }, 1000);

      return;
    }

    // 3. Agent Creator Command
    if (lower.includes('create') && lower.includes('agent')) {
      setActiveTab('agents');
      speakText("Navigating to AI Agent Synthesizer. Ready to configure memory, tools, and permissions for the new agent.");
      return;
    }

    // 4. Fallback intelligent response
    speakText(`Understood: "${command}". Supervisor core is generating execution plan.`);
    setCurrentAction('thinking');
    setTimeout(() => setCurrentAction('idle'), 2500);
  };

  // Emergency Halt Logic
  const handleEmergencyHalt = () => {
    setIsEmergencyHalted(true);
    setCurrentAction('emergency_halt');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechText("EMERGENCY STOP ACTIVATED. All agent workers and screen actions halted.");

    setAuditLogs(prev => [
      {
        id: `halt_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'system_circuit_breaker',
        agentName: 'System Killswitch',
        action: 'Global Emergency Stop Triggered by Operator',
        targetApp: 'All Systems',
        riskLevel: 'critical',
        status: 'halted',
        details: 'Hardware-level interrupt halted all autonomous loops and cursor drivers.',
      },
      ...prev,
    ]);
  };

  const handleResumeSystem = () => {
    setIsEmergencyHalted(false);
    setCurrentAction('idle');
    speakText("System resumed. Safety boundaries verified.");
  };

  // Workflow Approval Handlers
  const handleApproveStep = (stepId: string) => {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setActiveWorkflow(prev => {
      const nextIdx = prev.currentStepIndex + 1;
      return {
        ...prev,
        progress: Math.min(100, (nextIdx / prev.steps.length) * 100),
        currentStepIndex: nextIdx,
        status: nextIdx >= prev.steps.length ? 'completed' : 'in_progress',
        steps: prev.steps.map(s => s.id === stepId ? { ...s, status: 'completed', result: 'Approved & Executed successfully.' } : s)
      };
    });

    speakText("Approval signature granted. Action verified and post published successfully.");
    setCurrentAction('verifying');
    setTimeout(() => setCurrentAction('idle'), 2000);
  };

  const handleResetWorkflow = () => {
    setActiveWorkflow(prev => ({
      ...prev,
      progress: 0,
      currentStepIndex: 0,
      status: 'in_progress',
      steps: prev.steps.map(s => ({ ...s, status: s.order === 1 ? 'active' : 'pending', result: undefined })),
    }));
    speakText("Workflow reset to initial observation phase.");
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050811] text-slate-100 overflow-hidden font-sans">
      
      {/* Navigation Header */}
      <NavigationHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        isEmergencyHalted={isEmergencyHalted}
        onEmergencyHalt={handleEmergencyHalt}
        onResumeSystem={handleResumeSystem}
        activeAgentCount={agents.filter(a => a.status === 'running').length}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 overflow-hidden p-3 sm:p-4 flex flex-col gap-3">
        
        {/* Emergency Halt Banner */}
        {isEmergencyHalted && (
          <div className="w-full p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-between text-xs font-mono text-rose-200 animate-pulse shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <strong>SYSTEM HALTED:</strong>
              <span>Emergency killswitch engaged. All cursor inputs, network broadcasts, and agents suspended.</span>
            </div>
            <button
              onClick={handleResumeSystem}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Resume System
            </button>
          </div>
        )}

        {/* TAB 1: COMMAND CENTER (3D Virtual Human + Screen Observer + Live Telemetry) */}
        {activeTab === 'command' && (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            
            {/* Split Screen Stage: Left = 3D Virtual Human, Right = Computer Use Simulator */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden min-h-0">
              
              {/* 3D Virtual Human Character Stage (Left Column) */}
              <div className={`${floatingMode ? 'hidden lg:block lg:col-span-4' : 'lg:col-span-5'} h-full overflow-hidden flex flex-col`}>
                <VirtualHumanCanvas
                  currentAction={currentAction}
                  targetCoords={targetCoords}
                  visemeIntensity={isSpeaking ? 0.9 : 0}
                  speechText={speechText}
                  isSpeaking={isSpeaking}
                  onActionTrigger={(act) => setCurrentAction(act)}
                  floatingMode={floatingMode}
                  onToggleFloating={() => setFloatingMode(!floatingMode)}
                />
              </div>

              {/* Computer Use Simulator & Visual Screen Stage (Right Column) */}
              <div className={`${floatingMode ? 'lg:col-span-8' : 'lg:col-span-7'} h-full overflow-hidden flex flex-col`}>
                <ComputerUseSimulator
                  activeAppId={activeAppId}
                  onSelectApp={setActiveAppId}
                  virtualCursorPos={virtualCursorPos}
                  isClicking={isClicking}
                  isTyping={isTyping}
                  highlightedElementId={highlightedElementId}
                  showVisionOverlays={showVisionOverlays}
                  onToggleVisionOverlays={() => setShowVisionOverlays(!showVisionOverlays)}
                  currentStep={activeWorkflow.steps[activeWorkflow.currentStepIndex]}
                  permissionMode={permissionMode}
                />
              </div>

            </div>

            {/* Bottom Bar: Voice Assistant Input + Task Progress Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-7">
                <VoiceAssistantBar
                  onCommandSubmit={handleCommandSubmit}
                  isProcessing={currentAction === 'thinking'}
                  onEmergencyStop={handleEmergencyHalt}
                />
              </div>

              <div className="lg:col-span-5 h-[105px]">
                <div className="h-full rounded-2xl cyber-glass border border-cyan-500/20 p-2.5 px-3 flex flex-col justify-between text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" /> TASK PROGRESS ({activeWorkflow.progress}%)
                    </span>
                    <button
                      onClick={() => setArchitectureModalOpen(true)}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Blueprint
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans truncate">
                    Step {activeWorkflow.currentStepIndex + 1}: {activeWorkflow.steps[activeWorkflow.currentStepIndex]?.description || 'Awaiting Task'}
                  </p>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeWorkflow.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AGENT MARKETPLACE & CREATOR */}
        {activeTab === 'agents' && (
          <div className="flex-1 overflow-hidden">
            <AgentMarketplace
              agents={agents}
              activeAgentId={activeAgentId}
              onSelectAgent={setActiveAgentId}
              onToggleAgentStatus={(id) => {
                setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'running' ? 'idle' : 'running' } : a));
              }}
              onDeployAgent={(newAgent) => {
                setAgents(prev => [newAgent, ...prev]);
                confetti({ particleCount: 50, spread: 70 });
                speakText(`Agent ${newAgent.name} successfully deployed to the fleet.`);
              }}
            />
          </div>
        )}

        {/* TAB 3: SOCIAL MEDIA HUB */}
        {activeTab === 'social' && (
          <div className="flex-1 overflow-hidden">
            <SocialMediaManager
              posts={posts}
              permissionMode={permissionMode}
              onApprovePost={(postId) => {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'scheduled' } : p));
                confetti({ particleCount: 40 });
                speakText("Post approved and locked in official publishing schedule.");
              }}
              onSchedulePost={(newPost) => setPosts(prev => [newPost, ...prev])}
            />
          </div>
        )}

        {/* TAB 4: LONG-TERM MEMORY & KNOWLEDGE */}
        {activeTab === 'memory' && (
          <div className="flex-1 overflow-hidden">
            <MemoryCenter
              memories={memories}
              onAddMemory={(mem) => {
                const newMem: MemoryItem = {
                  id: `mem_${Date.now()}`,
                  lastAccessed: 'Just now',
                  ...mem,
                };
                setMemories(prev => [newMem, ...prev]);
                speakText("New fact indexed into vector long-term memory.");
              }}
              onDeleteMemory={(id) => setMemories(prev => prev.filter(m => m.id !== id))}
              onClearExpired={() => setMemories(prev => prev.filter(m => !m.expiresAt))}
            />
          </div>
        )}

        {/* TAB 5: SECURITY & PERMISSION CENTER */}
        {activeTab === 'security' && (
          <div className="flex-1 overflow-hidden">
            <SecurityCenter
              permissionMode={permissionMode}
              onChangePermissionMode={(mode) => {
                setPermissionMode(mode);
                speakText(`Permission authorization switched to ${mode} mode.`);
              }}
              auditLogs={auditLogs}
              isEmergencyHalted={isEmergencyHalted}
              onEmergencyHalt={handleEmergencyHalt}
              onResumeSystem={handleResumeSystem}
            />
          </div>
        )}

      </main>

      {/* Floating 3D Character Overlay (when floating mode is active) */}
      {floatingMode && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-cyan-400">
          <VirtualHumanCanvas
            currentAction={currentAction}
            targetCoords={targetCoords}
            speechText={speechText}
            isSpeaking={isSpeaking}
            onActionTrigger={(act) => setCurrentAction(act)}
            floatingMode={true}
            onToggleFloating={() => setFloatingMode(false)}
          />
        </div>
      )}

      {/* Architecture & Master Blueprint Inspector Modal */}
      <ArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />

    </div>
  );
}
