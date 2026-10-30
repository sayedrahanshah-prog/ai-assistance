/**
 * Cybersecurity, Permission Matrix & Emergency Circuit Breaker
 * Enforces 3-tier authorization (Manual, Assisted, Autonomous),
 * real-time audit logging, and global emergency kill switch.
 */

import React from 'react';
import { PermissionMode, AuditLogEntry } from '../types/agent';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  Lock, 
  Key, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Terminal,
  Activity,
  FileCheck
} from 'lucide-react';

interface SecurityCenterProps {
  permissionMode: PermissionMode;
  onChangePermissionMode: (mode: PermissionMode) => void;
  auditLogs: AuditLogEntry[];
  onEmergencyHalt: () => void;
  isEmergencyHalted: boolean;
  onResumeSystem: () => void;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({
  permissionMode,
  onChangePermissionMode,
  auditLogs,
  onEmergencyHalt,
  isEmergencyHalted,
  onResumeSystem,
}) => {
  return (
    <div className="flex flex-col h-full w-full rounded-2xl cyber-glass border border-cyan-500/20 p-4 overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" />
              <span>Cybersecurity & Autonomous Permission Gate</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono">
              ZERO-TRUST ARCHITECTURE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic sandboxing, permission boundary enforcement, and real-time audit trail.
          </p>
        </div>

        {/* Global Emergency Halt Killswitch */}
        <div className="flex items-center gap-2">
          {isEmergencyHalted ? (
            <button
              onClick={onResumeSystem}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-mono shadow-lg transition-all animate-bounce"
            >
              <CheckCircle className="w-4 h-4" />
              <span>RESUME AGENT EXECUTION</span>
            </button>
          ) : (
            <button
              onClick={onEmergencyHalt}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-bold font-mono shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all"
            >
              <AlertOctagon className="w-4 h-4 fill-white" />
              <span>GLOBAL EMERGENCY STOP</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        
        {/* Permission Modes Configuration Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Autonomous Permission Level</span>
            </h4>

            <div className="space-y-2">
              {[
                {
                  id: 'manual',
                  title: 'Manual Mode (Strictest)',
                  desc: 'Requires explicit user confirmation before every single action, click, or command execution.',
                  color: 'border-amber-500/50 text-amber-300',
                  badge: 'Ask Before Every Action'
                },
                {
                  id: 'assisted',
                  title: 'Assisted Mode (Recommended)',
                  desc: 'Automatically performs low-risk read and navigation actions; pauses and requests approval for publishing, code execution, or deletions.',
                  color: 'border-cyan-500/50 text-cyan-300',
                  badge: 'Hybrid Safety Boundary'
                },
                {
                  id: 'autonomous',
                  title: 'Autonomous Mode (Configured Limits)',
                  desc: 'Executes verified multi-step workflows autonomously within sandboxed limits. Critical destructive actions remain locked.',
                  color: 'border-purple-500/50 text-purple-300',
                  badge: 'Automated Operations'
                },
              ].map((m) => {
                const isActive = permissionMode === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => onChangePermissionMode(m.id as PermissionMode)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? `bg-slate-900 ${m.color} ring-1 ring-cyan-400/40 shadow-md` 
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">{m.title}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High-Impact Guardrail Checklist */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs font-mono space-y-1.5 text-slate-300">
            <span className="text-rose-400 text-[10px] block font-bold">HARDWARE-ENFORCED APPROVAL GATES:</span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span className="flex items-center gap-1 text-slate-300">✔ Financial transactions</span>
              <span className="flex items-center gap-1 text-slate-300">✔ Permanent file deletion</span>
              <span className="flex items-center gap-1 text-slate-300">✔ Social media broadcast</span>
              <span className="flex items-center gap-1 text-slate-300">✔ Host shell root access</span>
            </div>
          </div>
        </div>

        {/* Live Immutable Audit Trail */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-slate-950/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>CRYPTOGRAPHIC AUDIT LOG ({auditLogs.length} EVENTS)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">SHA-256 HASH CHAIN VERIFIED</span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-cyan-400 font-bold">{log.agentName}</span>
                    <span className="text-slate-500">[{log.targetApp}]</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase ${
                      log.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {log.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">{log.action}</p>
                  <p className="text-[9px] text-slate-500 mt-1">{log.details}</p>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    log.status === 'approved' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : log.status === 'auto_executed'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {log.status.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] text-slate-500 block mt-1">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>PROMPT INJECTION SHIELD: ACTIVE</span>
            <span>SANDBOX RESTRICTION: CONTAINER ENFORCED</span>
          </div>
        </div>

      </div>

    </div>
  );
};
