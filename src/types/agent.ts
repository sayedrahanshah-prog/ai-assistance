/**
 * Types and data models for Aetheris Autonomous AI Agent System
 */

export type PermissionMode = 'manual' | 'assisted' | 'autonomous';

export type CharacterGender = 'female' | 'male';
export type CharacterOutfit = 'cyber_suit' | 'executive_formal' | 'casual_tech' | 'tactical_ops';
export type CharacterPersonality = 'professional' | 'analytical' | 'creative' | 'friendly' | 'security_focused';

export type CharacterAction = 
  | 'idle' 
  | 'walking' 
  | 'pointing' 
  | 'typing' 
  | 'thinking' 
  | 'speaking' 
  | 'verifying'
  | 'celebrating'
  | 'emergency_halt';

export interface VirtualHumanConfig {
  gender: CharacterGender;
  outfit: CharacterOutfit;
  personality: CharacterPersonality;
  voicePitch: number;
  voiceRate: number;
  autoSpeak: boolean;
  eyeTrackingEnabled: boolean;
  hologramGlow: boolean;
  scale: number;
}

export type AgentRole = 
  | 'supervisor'
  | 'research'
  | 'coding'
  | 'security'
  | 'social_media'
  | 'email'
  | 'personal_assistant'
  | 'custom';

export interface AIAgent {
  id: string;
  name: string;
  role: AgentRole;
  avatarIcon: string;
  description: string;
  tools: string[];
  permissions: {
    canUseMouse: boolean;
    canUseKeyboard: boolean;
    canAccessWeb: boolean;
    canPostSocial: boolean;
    canExecuteCode: boolean;
    requiresApproval: boolean;
  };
  status: 'idle' | 'running' | 'paused' | 'error';
  successRate: number;
  tasksCompleted: number;
  customPrompt?: string;
  createdAt: string;
}

export interface TaskStep {
  id: string;
  order: number;
  description: string;
  targetApp: string;
  actionType: 'observe' | 'click' | 'type' | 'scroll' | 'navigate' | 'verify' | 'approval_request';
  targetElement?: string;
  targetCoords?: { x: number; y: number };
  status: 'pending' | 'active' | 'completed' | 'failed' | 'waiting_approval';
  result?: string;
  assignedAgent: string;
}

export interface TaskWorkflow {
  id: string;
  title: string;
  category: 'social' | 'coding' | 'research' | 'system' | 'custom';
  status: 'queued' | 'in_progress' | 'completed' | 'paused' | 'failed';
  progress: number;
  currentStepIndex: number;
  steps: TaskStep[];
  startedAt?: string;
  completedAt?: string;
}

export interface ScreenElement {
  id: string;
  label: string;
  type: 'button' | 'input' | 'tab' | 'menu' | 'card' | 'link';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number;
  height: number;
  shortcut?: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ScreenAppState {
  id: string;
  appName: string;
  windowTitle: string;
  icon: string;
  elements: ScreenElement[];
  mockContent: any;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'project' | 'credential' | 'workflow' | 'context';
  title: string;
  content: string;
  confidence: number;
  tags: string[];
  lastAccessed: string;
  expiresAt?: string;
}

export interface ScheduledTask {
  id: string;
  title: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  scheduledTime: string;
  assignedAgentId: string;
  workflowSummary: string;
  enabled: boolean;
  nextRun: string;
  lastRunStatus?: 'success' | 'failed';
}

export interface SocialMediaPost {
  id: string;
  platforms: ('twitter' | 'instagram' | 'linkedin' | 'youtube')[];
  title: string;
  content: string;
  hashtags: string[];
  imageUrl?: string;
  status: 'draft' | 'pending_approval' | 'scheduled' | 'published';
  scheduledFor: string;
  engagementStats?: {
    views: number;
    likes: number;
    shares: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  targetApp: string;
  riskLevel: 'low' | 'medium' | 'critical';
  status: 'approved' | 'auto_executed' | 'rejected' | 'halted';
  details: string;
}
