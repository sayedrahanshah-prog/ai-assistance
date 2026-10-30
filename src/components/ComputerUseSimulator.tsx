/**
 * Computer-Use & Screen Observation Simulator
 * Renders live interactive target applications, computer-vision bounding boxes,
 * coordinate tracking, virtual cursor movement, and the Observation-Action-Verification loop.
 */

import React, { useState, useEffect } from 'react';
import { 
  ScreenAppState, 
  ScreenElement, 
  TaskStep, 
  PermissionMode 
} from '../types/agent';
import { 
  Monitor, 
  MousePointer, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Code, 
  Instagram, 
  Folder, 
  Globe, 
  Eye, 
  ShieldCheck, 
  Play, 
  RefreshCw,
  Search,
  Upload,
  Send,
  Sliders,
  ExternalLink
} from 'lucide-react';

interface ComputerUseSimulatorProps {
  activeAppId: string;
  onSelectApp: (appId: string) => void;
  virtualCursorPos: { x: number; y: number };
  isClicking: boolean;
  isTyping: boolean;
  highlightedElementId?: string;
  onElementClick?: (element: ScreenElement) => void;
  showVisionOverlays: boolean;
  onToggleVisionOverlays: () => void;
  currentStep?: TaskStep;
  permissionMode: PermissionMode;
}

export const ComputerUseSimulator: React.FC<ComputerUseSimulatorProps> = ({
  activeAppId,
  onSelectApp,
  virtualCursorPos,
  isClicking,
  isTyping,
  highlightedElementId,
  onElementClick,
  showVisionOverlays,
  onToggleVisionOverlays,
  currentStep,
  permissionMode,
}) => {
  // Mock Apps library
  const apps: ScreenAppState[] = [
    {
      id: 'instagram',
      appName: 'Instagram Creator Studio',
      windowTitle: 'Instagram Business Suite — Create Post',
      icon: 'instagram',
      elements: [
        { id: 'ig_nav_create', label: 'Create Button', type: 'button', x: 8, y: 18, width: 14, height: 6, confidence: 0.98, riskLevel: 'low' },
        { id: 'ig_upload_box', label: 'Drop Media Area', type: 'card', x: 28, y: 32, width: 38, height: 42, confidence: 0.95, riskLevel: 'low' },
        { id: 'ig_caption_input', label: 'Caption Text Field', type: 'input', x: 69, y: 32, width: 28, height: 26, confidence: 0.97, riskLevel: 'low' },
        { id: 'ig_schedule_toggle', label: 'Schedule Toggle', type: 'button', x: 69, y: 64, width: 12, height: 5, confidence: 0.94, riskLevel: 'low' },
        { id: 'ig_publish_btn', label: 'Publish Post', type: 'button', x: 84, y: 82, width: 13, height: 6, confidence: 0.99, riskLevel: 'high' },
      ],
      mockContent: {
        caption: 'Autonomous AI Digital Employee demo launched! Experience live 3D character automation. #AI #AutonomousAgent #Tech',
        imageSelected: true,
        scheduledDate: 'Tomorrow at 10:00 AM',
      }
    },
    {
      id: 'vscode',
      appName: 'Visual Studio Code',
      windowTitle: 'VS Code — ~/projects/aetheris-agent-core/server.ts',
      icon: 'code',
      elements: [
        { id: 'vsc_sidebar_files', label: 'File Explorer Tab', type: 'tab', x: 3, y: 15, width: 4, height: 6, confidence: 0.99, riskLevel: 'low' },
        { id: 'vsc_editor_code', label: 'Editor Buffer', type: 'input', x: 22, y: 22, width: 75, height: 52, confidence: 0.96, riskLevel: 'low' },
        { id: 'vsc_terminal_btn', label: 'Integrated Terminal', type: 'button', x: 45, y: 78, width: 14, height: 5, confidence: 0.94, riskLevel: 'medium' },
        { id: 'vsc_run_tests_btn', label: 'Run Test Suite', type: 'button', x: 86, y: 6, width: 11, height: 5, confidence: 0.98, riskLevel: 'low' },
      ],
      mockContent: {
        filename: 'server.ts',
        lineCount: 142,
        testPassing: true,
      }
    },
    {
      id: 'browser',
      appName: 'Chromium Enterprise',
      windowTitle: 'GitHub — Enterprise Repository / Orchestrator',
      icon: 'globe',
      elements: [
        { id: 'brw_url_bar', label: 'URL Address Bar', type: 'input', x: 18, y: 7, width: 62, height: 5, confidence: 0.99, riskLevel: 'low' },
        { id: 'brw_pull_requests', label: 'Pull Requests Tab', type: 'tab', x: 16, y: 22, width: 15, height: 5, confidence: 0.95, riskLevel: 'low' },
        { id: 'brw_merge_btn', label: 'Merge Pull Request', type: 'button', x: 74, y: 55, width: 18, height: 6, confidence: 0.97, riskLevel: 'high' },
        { id: 'brw_settings_btn', label: 'Repository Settings', type: 'button', x: 84, y: 22, width: 12, height: 5, confidence: 0.96, riskLevel: 'medium' },
      ],
      mockContent: {
        url: 'https://github.com/organization/autonomous-agent-system',
        prTitle: 'feat(core): autonomous computer use & vision grounding',
      }
    },
    {
      id: 'terminal',
      appName: 'Dev Terminal & Sandbox',
      windowTitle: 'zsh — aetheris-sandbox@node-01',
      icon: 'terminal',
      elements: [
        { id: 'term_buffer', label: 'Terminal Buffer', type: 'input', x: 8, y: 15, width: 84, height: 70, confidence: 0.96, riskLevel: 'medium' },
        { id: 'term_clear_btn', label: 'Clear Buffer', type: 'button', x: 80, y: 6, width: 12, height: 5, confidence: 0.92, riskLevel: 'low' },
      ],
      mockContent: {
        lastOutput: '[Agent-Worker-1] Sandboxed container active. All network egress filtered via proxy.',
      }
    }
  ];

  const currentApp = apps.find(a => a.id === activeAppId) || apps[0];

  return (
    <div className="flex flex-col h-full w-full rounded-2xl cyber-glass border border-cyan-500/20 overflow-hidden shadow-2xl">
      
      {/* Top Application Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-cyan-500/20">
        
        {/* App Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                activeAppId === app.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {app.id === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
              {app.id === 'vscode' && <Code className="w-3.5 h-3.5 text-blue-400" />}
              {app.id === 'browser' && <Globe className="w-3.5 h-3.5 text-emerald-400" />}
              {app.id === 'terminal' && <Terminal className="w-3.5 h-3.5 text-amber-400" />}
              <span>{app.appName}</span>
            </button>
          ))}
        </div>

        {/* Vision & Inspection Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVisionOverlays}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono transition-all border ${
              showVisionOverlays
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CV Grounding</span>
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">POS:</span>
            <span className="text-cyan-400">{Math.round(virtualCursorPos.x)}%, {Math.round(virtualCursorPos.y)}%</span>
          </div>
        </div>
      </div>

      {/* Screen Observation Stage / Application Canvas */}
      <div className="relative flex-1 bg-slate-950 p-3 select-none overflow-hidden min-h-[360px]">
        
        {/* Mock OS Window Chrome */}
        <div className="relative h-full w-full rounded-xl bg-[#0b1220] border border-slate-800 flex flex-col overflow-hidden shadow-inner">
          
          {/* OS Window Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-[280px]">
                {currentApp.windowTitle}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> SECURE SANDBOX
              </span>
            </div>
          </div>

          {/* Window Body for Active App */}
          <div className="relative flex-1 p-4 overflow-hidden">
            
            {/* INSTAGRAM CREATOR STUDIO SCREEN */}
            {activeAppId === 'instagram' && (
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">Meta Business Suite</h4>
                      <p className="text-[10px] text-slate-400">@aetheris_official · Connected Page</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono">
                    Post Composer Mode
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 flex-1 pt-3">
                  {/* Upload Dropzone */}
                  <div className="col-span-7 rounded-xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-200">Autonomous Video Asset Staged</span>
                    <span className="text-[10px] text-slate-400 mt-1">video_demo_virtual_human_4k.mp4 (14.2 MB)</span>
                    <span className="text-[9px] text-emerald-400 font-mono mt-2 bg-emerald-500/10 px-2 py-0.5 rounded">Integrity Verified</span>
                  </div>

                  {/* Caption & Controls */}
                  <div className="col-span-5 flex flex-col justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">CAPTION</label>
                      <div className="text-xs text-slate-200 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 leading-relaxed font-sans min-h-[90px]">
                        {currentApp.mockContent.caption}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="text-[10px] text-slate-400 font-mono">SCHEDULE</span>
                        <span className="font-mono text-cyan-400 text-[11px]">{currentApp.mockContent.scheduledDate}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono">
                          Save Draft
                        </button>
                        <button className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md">
                          Publish Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VS CODE IDE SCREEN */}
            {activeAppId === 'vscode' && (
              <div className="h-full flex flex-col font-mono text-xs">
                <div className="flex items-center justify-between bg-slate-900 px-3 py-1 rounded-t-lg border border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">TS</span>
                    <span>src/agent/orchestrator.ts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">Tests: 38 Passed</span>
                    <button className="px-2 py-0.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded">Run</button>
                  </div>
                </div>
                <div className="flex-1 bg-slate-950 p-3 rounded-b-lg border border-slate-800 border-t-0 text-slate-300 leading-relaxed overflow-hidden">
                  <p><span className="text-purple-400">export async function</span> <span className="text-yellow-300">executeAgentTask</span>(instruction: <span className="text-emerald-400">string</span>) &#123;</p>
                  <p className="pl-4"><span className="text-slate-500">// 1. Multimodal visual observation of target screen</span></p>
                  <p className="pl-4"><span className="text-purple-400">const</span> screenshot = <span className="text-purple-400">await</span> screenCapture.<span className="text-blue-300">getOptimizedFrame</span>();</p>
                  <p className="pl-4"><span className="text-purple-400">const</span> elements = <span className="text-purple-400">await</span> visionParser.<span className="text-blue-300">detectInteractiveElements</span>(screenshot);</p>
                  <p className="pl-4"><span className="text-slate-500">// 2. Coordinate localization and safety check</span></p>
                  <p className="pl-4"><span className="text-purple-400">const</span> target = elements.<span className="text-blue-300">find</span>(e =&gt; e.label.<span className="text-blue-300">includes</span>(<span className="text-emerald-300">"Publish"</span>));</p>
                  <p className="pl-4"><span className="text-purple-400">await</span> virtualHuman.<span className="text-blue-300">walkAndPointTo</span>(target.coords);</p>
                  <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-yellow-300">verifyActionState</span>(target);</p>
                  <p>&#125;</p>
                </div>
              </div>
            )}

            {/* BROWSER / GITHUB SCREEN */}
            {activeAppId === 'browser' && (
              <div className="h-full flex flex-col font-sans text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono text-slate-500">URL:</span>
                  <div className="flex-1 bg-slate-950 px-3 py-1 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 truncate">
                    {currentApp.mockContent.url}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="flex-1 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">Open PR #104</span>
                      <span className="text-slate-200 font-semibold">{currentApp.mockContent.prTitle}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Implemented deep visual grounding with coordinate translation into 3D world space. The virtual human now aims the kinematic pointer with sub-pixel alignment.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">All checks have passed (4 successful checks)</span>
                    <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg">
                      Merge Pull Request
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TERMINAL SCREEN */}
            {activeAppId === 'terminal' && (
              <div className="h-full bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs flex flex-col justify-between text-slate-300">
                <div className="space-y-1.5">
                  <p className="text-cyan-400">➜ aetheris-agent git:(main) $ npm run test:sandbox</p>
                  <p className="text-slate-400">Running 16 autonomous multi-agent verification tests...</p>
                  <p className="text-emerald-400">✔ Agent Creator Synthesizer: Passed (14ms)</p>
                  <p className="text-emerald-400">✔ Coordinate Vision Grounding: Passed (22ms)</p>
                  <p className="text-emerald-400">✔ High-Impact Permission Barrier: Enforced (9ms)</p>
                  <p className="text-emerald-400">✔ Lip-sync Viseme Generation: Synchronized (11ms)</p>
                  <p className="text-slate-500">{currentApp.mockContent.lastOutput}</p>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 border-t border-slate-800/80 pt-2">
                  <span>➜</span>
                  <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
                </div>
              </div>
            )}

            {/* COMPUTER VISION BOUNDING BOX OVERLAYS */}
            {showVisionOverlays && (
              <div className="absolute inset-0 pointer-events-none">
                {currentApp.elements.map((el) => {
                  const isTarget = highlightedElementId === el.id;
                  return (
                    <div
                      key={el.id}
                      style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: `${el.width}%`,
                        height: `${el.height}%`,
                      }}
                      className={`absolute rounded transition-all duration-200 border-2 ${
                        isTarget 
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_16px_#22d3ee]' 
                          : el.riskLevel === 'high' 
                            ? 'border-amber-500/70 bg-amber-500/10' 
                            : 'border-cyan-500/40 bg-cyan-500/5'
                      }`}
                    >
                      <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-slate-950/90 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 flex items-center gap-1 shadow-md whitespace-nowrap">
                        <span>{el.label}</span>
                        <span className="text-slate-500">{(el.confidence * 100).toFixed(0)}%</span>
                        {el.riskLevel === 'high' && <span className="text-amber-400">⚠️</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SIMULATED VIRTUAL MOUSE CURSOR */}
            <div
              style={{
                left: `${virtualCursorPos.x}%`,
                top: `${virtualCursorPos.y}%`,
                transform: 'translate(-2px, -2px)',
                transition: 'left 0.25s ease-out, top 0.25s ease-out',
              }}
              className="absolute z-30 pointer-events-none"
            >
              <div className="relative">
                {/* Neon cursor pointer icon */}
                <MousePointer className={`w-5 h-5 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] ${isClicking ? 'scale-90' : 'scale-100'}`} />
                
                {/* Click Ripple wave */}
                {isClicking && (
                  <span className="absolute -inset-2 rounded-full border border-cyan-400 animate-ping"></span>
                )}

                {/* Agent identifier tag attached to cursor */}
                <span className="absolute left-4 top-2 px-1.5 py-0.5 rounded bg-slate-900/90 border border-cyan-500/50 text-[9px] font-mono text-cyan-300 whitespace-nowrap shadow-md">
                  Aetheris Pointer
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Observation-Action-Verification Status Strip */}
      <div className="bg-slate-950/90 border-t border-cyan-500/20 p-2.5 px-4 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="font-semibold">LOOP:</span>
            <span className="text-slate-300">
              {currentStep ? currentStep.actionType.toUpperCase() : 'OBSERVING SCREEN'}
            </span>
          </div>

          {currentStep && (
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <span>➔ Target:</span>
              <span className="text-cyan-400">{currentStep.targetElement || currentStep.targetApp}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px]">AUTH MODE:</span>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
            permissionMode === 'autonomous' 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
              : permissionMode === 'assisted' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {permissionMode}
          </span>
        </div>
      </div>

    </div>
  );
};
