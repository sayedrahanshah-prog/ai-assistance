/**
 * Task Workflow & Live Execution Monitor
 * Real-time progress tracker, step executor, supervisor DAG steps, and action telemetry.
 */

import React from 'react';
import { TaskWorkflow, TaskStep } from '../types/agent';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight,
  Layers,
  Terminal,
  RotateCcw
} from 'lucide-react';

interface TaskMonitorProps {
  workflow: TaskWorkflow;
  onPauseResume: () => void;
  onApproveStep: (stepId: string) => void;
  onResetWorkflow: () => void;
}

export const TaskMonitor: React.FC<TaskMonitorProps> = ({
  workflow,
  onPauseResume,
  onApproveStep,
  onResetWorkflow,
}) => {
  return (
    <div className="flex flex-col h-full w-full rounded-2xl cyber-glass border border-cyan-500/20 p-4 overflow-hidden shadow-2xl">
      
      {/* Top Workflow Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{workflow.title}</span>
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
              workflow.status === 'in_progress' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : workflow.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
            }`}>
              {workflow.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>Category: <strong className="text-slate-200 capitalize">{workflow.category}</strong></span>
            <span>Progress: <strong className="text-cyan-400">{workflow.progress}%</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetWorkflow}
            title="Reset Workflow"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-all text-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPauseResume}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              workflow.status === 'in_progress'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
            }`}
          >
            {workflow.status === 'in_progress' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{workflow.status === 'in_progress' ? 'Pause Workflow' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 mb-3 overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#22d3ee]"
          style={{ width: `${workflow.progress}%` }}
        />
      </div>

      {/* Step by Step Execution Timeline */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {workflow.steps.map((step, idx) => {
          const isCurrent = workflow.currentStepIndex === idx && workflow.status === 'in_progress';
          const isDone = step.status === 'completed';
          const isWaiting = step.status === 'waiting_approval';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent 
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.15)]' 
                  : isDone
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-80'
                    : isWaiting
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isDone 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : isCurrent
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isDone ? '✓' : step.order}
                  </span>

                  <span className="text-xs font-semibold text-slate-200">
                    {step.description}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400">
                    {step.targetApp}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    {step.actionType}
                  </span>
                </div>
              </div>

              {step.result && (
                <div className="mt-1.5 pl-7 text-[11px] font-mono text-emerald-400 bg-emerald-500/5 p-1.5 rounded border border-emerald-500/20">
                  ➔ {step.result}
                </div>
              )}

              {/* Waiting for operator approval button */}
              {isWaiting && (
                <div className="mt-2 pl-7 flex items-center justify-between bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
                  <span className="text-xs text-amber-300 font-sans flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> High-Impact Action Gated
                  </span>
                  <button
                    onClick={() => onApproveStep(step.id)}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all"
                  >
                    Grant Approval
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
