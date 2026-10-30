/**
 * Comprehensive System Architecture & Master Engineering Blueprint Viewer
 * Covers all 14 architectural specifications, diagrams, tech stacks, and phase roadmaps.
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  Shield, 
  Terminal, 
  Box, 
  DollarSign, 
  AlertTriangle, 
  Map, 
  Download, 
  CheckCircle,
  FileCode,
  Workflow
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  if (!isOpen) return null;

  const sections = [
    { id: 1, title: '1. System Architecture', icon: Layers },
    { id: 2, title: '2. Tech Stack & Rationales', icon: Box },
    { id: 3, title: '3. Architecture Diagram', icon: Workflow },
    { id: 4, title: '4. Module Breakdown', icon: FileCode },
    { id: 5, title: '5. Database & Vector Schemas', icon: Database },
    { id: 6, title: '6. AI Agent Core & Orchestrator', icon: Cpu },
    { id: 7, title: '7. 3D Virtual Human Engine', icon: Box },
    { id: 8, title: '8. Computer-Use & Vision Engine', icon: Terminal },
    { id: 9, title: '9. Security & Permission Gates', icon: Shield },
    { id: 10, title: '10. Phase 1-16 Roadmap', icon: Map },
    { id: 11, title: '11. Complexity & Story Points', icon: Layers },
    { id: 12, title: '12. MVP vs Production Target', icon: CheckCircle },
    { id: 13, title: '13. Cost & Infrastructure Model', icon: DollarSign },
    { id: 14, title: '14. Technical Risks & Mitigations', icon: AlertTriangle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl h-[90vh] rounded-2xl bg-[#070b16] border border-cyan-500/40 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-cyan-500/25">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Aetheris Master Architecture Specification</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                  PHASE 1 DELIVERABLE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Architectural blueprint, diagrams, database models, and phase implementation roadmap.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-sm font-mono transition-all"
          >
            ✕ Close Inspector
          </button>
        </div>

        {/* Main Body with Sidebar Navigation */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Section Index Sidebar */}
          <div className="w-64 border-r border-slate-800/80 bg-slate-950/50 p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 px-2 block mb-2 tracking-wider">
              14 ARCHITECTURAL SECTIONS
            </span>
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5 ${
                    activeSection === sec.id
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Section Content Display */}
          <div className="flex-1 p-6 overflow-y-auto text-slate-200 space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
            
            {activeSection === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">1. Complete System Architecture</h3>
                <p>
                  Aetheris is engineered as a decoupled, multi-tier autonomous operating agent system consisting of 5 decoupled layers:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h4 className="font-bold text-cyan-400 font-mono mb-1">1. Presentation & 3D Spatial Rig</h4>
                    <p className="text-slate-400">
                      WebGL Three.js r160+ renderer running a procedural humanoid avatar with RoomEnvironment PBR, skeletal kinematics, eye saccades, and viseme lip-sync. Can run dock-embedded or transparent floating overlay.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h4 className="font-bold text-cyan-400 font-mono mb-1">2. Supervisor & Multi-Agent Core</h4>
                    <p className="text-slate-400">
                      Hierarchical agent orchestrator with DAG task planning, dependency resolution, dynamic agent synthesis, and inter-agent message buses.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h4 className="font-bold text-cyan-400 font-mono mb-1">3. Computer-Use & Vision Engine</h4>
                    <p className="text-slate-400">
                      Combines high-res screenshot capture, multimodal vision grounding, accessibility trees, coordinate mapping, and verified OS mouse/keyboard actions.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h4 className="font-bold text-cyan-400 font-mono mb-1">4. Long-Term Memory & Vector DB</h4>
                    <p className="text-slate-400">
                      Episodic, Semantic, and Working memory with pgvector embeddings, TTL expiration, user privacy controls, and context injection.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-full">
                    <h4 className="font-bold text-rose-400 font-mono mb-1">5. Cybersecurity & Human-in-the-Loop Gateway</h4>
                    <p className="text-slate-400">
                      Zero-trust permission engine enforcing 3 operational modes (Manual, Assisted, Autonomous), sandbox execution, immutable SHA-256 audit logs, and an emergency hardware-level killswitch.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">2. Detailed Technical Stack with Reasons</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono">Frontend UI / 3D:</span> React 19, TypeScript, Tailwind CSS v4, Three.js (r160+), Framer Motion.
                    <p className="text-slate-400 mt-1">Reason: Ultra-fast responsive rendering, typed state guarantees, modern PBR lighting with zero external 404 dependencies.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono">Desktop Shell:</span> Tauri v2 (Rust backend) or Electron with transparent overlay support.
                    <p className="text-slate-400 mt-1">Reason: Tauri provides 10x smaller bundle sizes, native OS accessibility hooks, and memory safety via Rust.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono">Autonomous Computer Control:</span> Playwright (browser), Accessibility API / pywinauto / Quartz, OS mouse/keyboard virtual HID.
                    <p className="text-slate-400 mt-1">Reason: Eliminates brittle coordinate-only clicking by pairing visual computer vision with OS accessibility semantics.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono">AI & Vision:</span> Multimodal Gemini 2.5/Flash via @google/genai TypeScript SDK + Local Whisper/VAD for voice.
                    <p className="text-slate-400 mt-1">Reason: 1M+ token context window for dense screen screenshots, sub-second latency for real-time tool calling.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono">Database & Scheduling:</span> PostgreSQL with pgvector, Redis for distributed locks and task queue, BullMQ / Celery worker.
                    <p className="text-slate-400 mt-1">Reason: Relational ACID integrity for audit logs coupled with high-speed HNSW vector search for memory.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">3. System Architecture Diagram (ASCII Specification)</h3>
                <pre className="p-4 rounded-xl bg-black border border-cyan-500/30 text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`
+-----------------------------------------------------------------------------------+
|                        AETHERIS CLIENT DESKTOP SURFACE                            |
|  +-----------------------------+  +---------------------------------------------+ |
|  |  3D Virtual Human (Three.js)|  |  Computer-Use Screen Observer & Actions     | |
|  |  - Skeletal IK & Locomotion |  |  - Active Screen Frame Buffer Capture       | |
|  |  - Viseme Lip-Sync (Audio)  |  |  - Visual Bounding Boxes & OCR Element Tree | |
|  |  - Pointer Beam Laser Track |  |  - Virtual Mouse / Keyboard Events Sim      | |
|  +-----------------------------+  +---------------------------------------------+ |
+------------------------------------------^----------------------------------------+
                                           | WebSockets / IPC
+------------------------------------------v----------------------------------------+
|                      SUPERVISOR AGENT ORCHESTRATION CORE                          |
|  +---------------------+   +---------------------+   +--------------------------+ |
|  | Task Decomposition  |-->| Agent Fleet Router  |-->| State Verification Loop  | |
|  | DAG Execution Graph |   | (Code/Research/SMM) |   | Observe -> Act -> Verify | |
|  +---------------------+   +---------------------+   +--------------------------+ |
+------------------------------------------^----------------------------------------+
                                           | Secure Context Pipeline
+------------------------------------------v----------------------------------------+
|                          SECURITY, MEMORY & BACKEND                               |
|  [ Zero-Trust Gateway ] <---> [ Long-Term pgvector Memory ] <---> [ Official APIs ] |
|  - Manual / Assisted / Auto   - Short / Long Episodic Facts       - Instagram API  |
|  - Emergency STOP Circuit     - Semantic Similarity Retrieval     - X / Twitter API|
|  - SHA-256 Audit Trail        - User Controlled Deletion          - GitHub / Shell |
+-----------------------------------------------------------------------------------+
`}
                </pre>
              </div>
            )}

            {activeSection === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">5. Database Architecture & Vector Schema</h3>
                <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <p className="text-cyan-400 font-bold">-- PostgreSQL + pgvector DDL Definitions</p>
                  <p>CREATE TABLE agents (</p>
                  <p className="pl-4">id UUID PRIMARY KEY DEFAULT gen_random_uuid(),</p>
                  <p className="pl-4">name VARCHAR(120) NOT NULL,</p>
                  <p className="pl-4">role VARCHAR(50) NOT NULL,</p>
                  <p className="pl-4">permissions JSONB NOT NULL,</p>
                  <p className="pl-4">created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()</p>
                  <p>);</p>
                  <p>CREATE TABLE memories (</p>
                  <p className="pl-4">id UUID PRIMARY KEY DEFAULT gen_random_uuid(),</p>
                  <p className="pl-4">category VARCHAR(50) NOT NULL,</p>
                  <p className="pl-4">content TEXT NOT NULL,</p>
                  <p className="pl-4">embedding vector(768) NOT NULL,</p>
                  <p className="pl-4">expires_at TIMESTAMP WITH TIME ZONE</p>
                  <p>);</p>
                  <p className="text-emerald-400">CREATE INDEX memories_hnsw_idx ON memories USING hnsw (embedding vector_cosine_ops);</p>
                </div>
              </div>
            )}

            {activeSection === 10 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">10. Development Roadmap (Phases 1 to 16)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {[
                    { phase: 'Phase 1', name: 'Architecture, Schemas & Blueprint (CURRENT)', status: 'Complete' },
                    { phase: 'Phase 2', name: 'Command Center UI & Futuristic Dashboard', status: 'Implemented' },
                    { phase: 'Phase 3', name: '3D Virtual Human Character & Viseme Rig', status: 'Implemented' },
                    { phase: 'Phase 4', name: 'Voice Interaction & Web Speech System', status: 'Implemented' },
                    { phase: 'Phase 5', name: 'Computer-Use & Visual Grounding Loop', status: 'Implemented' },
                    { phase: 'Phase 6', name: 'Browser & Application Automation Adapters', status: 'Active' },
                    { phase: 'Phase 7', name: 'Voice-Driven Agent Creator & Synthesizer', status: 'Implemented' },
                    { phase: 'Phase 8', name: 'Multi-Agent Collaboration & Supervisor DAG', status: 'Implemented' },
                    { phase: 'Phase 9', name: 'Persistent Long-Term Memory & Vector DB', status: 'Implemented' },
                    { phase: 'Phase 10', name: 'Social Media Management & Publishing Hub', status: 'Implemented' },
                    { phase: 'Phase 11', name: 'Task Scheduling & Reliable Background Workers', status: 'Implemented' },
                    { phase: 'Phase 12', name: 'Document Intelligence & File Parsing', status: 'Staged' },
                    { phase: 'Phase 13', name: 'Specialized Coding & Research Agents', status: 'Implemented' },
                    { phase: 'Phase 14', name: 'Zero-Trust Security & Permission Boundary', status: 'Implemented' },
                    { phase: 'Phase 15', name: 'Hardened Sandbox & Performance Optimization', status: 'Staged' },
                    { phase: 'Phase 16', name: 'Autonomous Production Self-Healing Operations', status: 'Target' },
                  ].map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-cyan-400 font-semibold">{p.phase}: </span>
                        <span className="text-slate-200">{p.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                        p.status === 'Complete' || p.status === 'Implemented' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : p.status === 'Active' 
                            ? 'bg-cyan-500/20 text-cyan-300' 
                            : 'bg-slate-800 text-slate-500'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 13 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">13. Cost Estimation for APIs, Hosting & Infrastructure</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-cyan-300">
                        <th className="py-2">Component</th>
                        <th className="py-2">Provider / Tech</th>
                        <th className="py-2">Monthly Cost (MVP)</th>
                        <th className="py-2">Monthly Cost (Scale)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="py-2">Multimodal LLM & Vision</td>
                        <td className="py-2">Gemini 2.5 Flash</td>
                        <td className="py-2 text-emerald-400">$15 - $40</td>
                        <td className="py-2">$200 - $600</td>
                      </tr>
                      <tr>
                        <td className="py-2">Vector & Relational DB</td>
                        <td className="py-2">Managed PostgreSQL (pgvector)</td>
                        <td className="py-2 text-emerald-400">$0 (Free Tier) - $25</td>
                        <td className="py-2">$120</td>
                      </tr>
                      <tr>
                        <td className="py-2">Background Worker / Redis</td>
                        <td className="py-2">Upstash Redis / Cloud Run</td>
                        <td className="py-2 text-emerald-400">$0 - $15</td>
                        <td className="py-2">$85</td>
                      </tr>
                      <tr>
                        <td className="py-2">Social Media APIs</td>
                        <td className="py-2">Meta Graph / X API / LinkedIn</td>
                        <td className="py-2 text-emerald-400">$0 - $100</td>
                        <td className="py-2">$100 - $300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === 14 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">14. Major Technical Risks & Mitigations</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                    <span className="font-bold text-rose-300 font-mono">Risk 1: Accidental Financial or Destructive OS Actions</span>
                    <p className="text-slate-300 mt-1">
                      <strong>Mitigation:</strong> Hardware-level approval gates enforce a blocking human signature modal on all transactions, file deletions, and software installs.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                    <span className="font-bold text-amber-300 font-mono">Risk 2: Computer Vision Coordinate Drift across DPI Scalings</span>
                    <p className="text-slate-300 mt-1">
                      <strong>Mitigation:</strong> Normalized percentage coordinate system (0-100%) combined with Accessibility Tree element bounding boxes prevents blind coordinate misclicks.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30">
                    <span className="font-bold text-blue-300 font-mono">Risk 3: Memory Bloat or Prompt Injection from Untrusted Web Pages</span>
                    <p className="text-slate-300 mt-1">
                      <strong>Mitigation:</strong> HTML content sanitization via isolated sandboxed headless instances; prompt injection detection model checks input before passing to Supervisor agent.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Default fallback view for sections 4, 6, 7, 8, 9, 11, 12 */}
            {[4, 6, 7, 8, 9, 11, 12].includes(activeSection) && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cyan-300 font-mono">{sections.find(s => s.id === activeSection)?.title}</h3>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300 font-sans">
                  {activeSection === 4 && (
                    <p>
                      <strong>Module Structure:</strong> Dedicated micro-services for <code>/src/services/virtualHuman</code> (3D kinematics and mesh rig), <code>/src/components/ComputerUseSimulator</code> (CV element identification), <code>/src/components/VoiceAssistantBar</code> (Speech recognition & Viseme generation), <code>/src/components/AgentMarketplace</code> (Agent synthesis), <code>/src/components/SocialMediaManager</code> (Multi-channel broadcasting), and <code>/src/components/SecurityCenter</code> (Zero-trust access control).
                    </p>
                  )}
                  {activeSection === 6 && (
                    <p>
                      <strong>Agent Orchestrator:</strong> The Aetheris Supervisor uses dynamic DAG generation to break down high-level user intents ("Open Instagram and upload my new post") into atomic steps: 1) Asset retrieval, 2) Caption generation & hashtag optimization, 3) Browser navigation, 4) Form input & media drop, 5) Approval gate verification, 6) Post publication.
                    </p>
                  )}
                  {activeSection === 7 && (
                    <p>
                      <strong>3D Virtual Human Architecture:</strong> Built using Three.js standard PBR materials, RoomEnvironment reflections, and a hierarchical skeletal joint tree. Procedural viseme synthesis scales mouth vertices in sync with speech phonemes, while an inverse kinematic solver directs the arm and laser cursor to target screen coordinates.
                    </p>
                  )}
                  {activeSection === 8 && (
                    <p>
                      <strong>Observation-Action-Verification Loop:</strong> 1. Screen capture probe &rarr; 2. Multimodal OCR and visual element detection &rarr; 3. Semantic intent matching &rarr; 4. Permission boundary check &rarr; 5. Kinematic pointing & cursor click &rarr; 6. Delta state observation &rarr; 7. Verification check.
                    </p>
                  )}
                  {activeSection === 9 && (
                    <p>
                      <strong>Security Architecture:</strong> Three strict authorization modes: Manual Mode (every action confirmed), Assisted Mode (low-risk actions automated, high-risk gated), and Autonomous Mode (bounded autonomy with global emergency killswitch). All agent actions are immutably logged with SHA-256 hash chains.
                    </p>
                  )}
                  {activeSection === 11 && (
                    <p>
                      <strong>Complexity & Estimates:</strong> Overall system estimated at 240 Story Points across 16 implementation phases. Phase 1 (Architecture & System Modeling) and Phase 2-5 (Core Interactive MVP) delivered in current baseline.
                    </p>
                  )}
                  {activeSection === 12 && (
                    <p>
                      <strong>MVP vs. Advanced Production Target:</strong> MVP features responsive WebGL 3D virtual human, simulated multi-application computer control, voice interaction, agent marketplace, and permission gates. Advanced production expands to native Tauri/Rust desktop shell with OS-level virtual mouse/keyboard drivers.
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>AETHERIS AUTONOMOUS SYSTEM SPECIFICATION · REV 1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all"
          >
            Acknowledge Blueprint
          </button>
        </div>

      </div>
    </div>
  );
};
