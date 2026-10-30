/**
 * 3D Virtual Human Canvas Component
 * Encapsulates the WebGL rendering pipeline, camera kinematics, and control dock.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { 
  CharacterAction, 
  CharacterGender, 
  CharacterOutfit, 
  CharacterPersonality, 
  VirtualHumanConfig 
} from '../types/agent';
import { createProceduralHuman, HumanJoints } from '../services/virtualHuman/humanRig';
import { VirtualHumanAnimator } from '../services/virtualHuman/animationController';
import { 
  User, 
  Shirt, 
  Sparkles, 
  Eye, 
  Volume2, 
  Maximize2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Compass,
  Radio,
  Layers
} from 'lucide-react';

interface VirtualHumanCanvasProps {
  currentAction: CharacterAction;
  targetCoords?: { x: number; y: number };
  visemeIntensity?: number;
  speechText?: string;
  isSpeaking?: boolean;
  onActionTrigger?: (action: CharacterAction) => void;
  floatingMode?: boolean;
  onToggleFloating?: () => void;
}

export const VirtualHumanCanvas: React.FC<VirtualHumanCanvasProps> = ({
  currentAction,
  targetCoords,
  visemeIntensity = 0,
  speechText = '',
  isSpeaking = false,
  onActionTrigger,
  floatingMode = false,
  onToggleFloating,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animatorRef = useRef<VirtualHumanAnimator | null>(null);
  const jointsRef = useRef<HumanJoints | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Character Configuration State
  const [config, setConfig] = useState<VirtualHumanConfig>({
    gender: 'female',
    outfit: 'cyber_suit',
    personality: 'professional',
    voicePitch: 1.05,
    voiceRate: 1.0,
    autoSpeak: true,
    eyeTrackingEnabled: true,
    hologramGlow: true,
    scale: 1.0,
  });

  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'actions' | 'personality'>('appearance');

  // Keep action in sync with animator
  useEffect(() => {
    if (animatorRef.current) {
      animatorRef.current.setAction(currentAction, targetCoords);
    }
  }, [currentAction, targetCoords]);

  // Keep speech viseme in sync
  useEffect(() => {
    if (animatorRef.current) {
      animatorRef.current.setVisemeIntensity(isSpeaking ? 1.0 : visemeIntensity);
    }
  }, [isSpeaking, visemeIntensity]);

  // Scene setup & lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x050811, 0.08);

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.35, 3.2);

    // 2. High-performance Renderer Configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 3. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (3-point balanced setup)
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    // 5. Build Procedural Virtual Human Character
    let currentHumanObj = createProceduralHuman(config.gender, config.outfit, config.hologramGlow);
    jointsRef.current = currentHumanObj.joints;
    scene.add(currentHumanObj.group);

    const animator = new VirtualHumanAnimator(currentHumanObj.joints, config);
    animatorRef.current = animator;
    animator.setAction(currentAction);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Damped camera framing
      camera.lookAt(0, 1.05, 0);

      animator.update(delta, elapsed);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [config.gender, config.outfit, config.hologramGlow]);

  return (
    <div className={`relative flex flex-col h-full w-full select-none overflow-hidden rounded-2xl cyber-glass border border-cyan-500/20 shadow-2xl ${floatingMode ? 'ring-2 ring-cyan-400' : ''}`}>
      
      {/* Top Status & Mode Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          <span className="font-semibold uppercase tracking-wider">3D AVATAR: {config.gender === 'female' ? 'AETHERIA' : 'AETHER'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 capitalize">{currentAction}</span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFloating && (
            <button
              onClick={onToggleFloating}
              title={floatingMode ? "Embed into Dashboard" : "Float on Screen"}
              className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                floatingMode 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' 
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-cyan-300'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setDockCollapsed(!dockCollapsed)}
            title={dockCollapsed ? "Expand Character Controls" : "Collapse Controls"}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-cyan-300 transition-all"
          >
            {dockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport (100% Unobstructed) */}
      <div 
        ref={mountRef} 
        className="w-full flex-1 min-h-[360px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Speech Subtitle Bubble */}
      {speechText && (
        <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none flex justify-center">
          <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-400/40 text-slate-100 text-xs sm:text-sm leading-relaxed shadow-xl animate-fade-in text-center font-sans">
            <span className="text-cyan-400 font-mono text-[10px] block uppercase mb-1">Synthesized Voice Transmission</span>
            "{speechText}"
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock */}
      <div 
        className={`transition-all duration-300 z-20 px-3 pb-3 pointer-events-auto ${
          dockCollapsed ? 'translate-y-[calc(100%-8px)] opacity-50 hover:opacity-100' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="rounded-xl bg-slate-950/90 border border-cyan-500/25 p-3 shadow-xl">
          
          {/* Dock Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-xs font-mono">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'appearance' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Avatar Rig
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'actions' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Kinematics
              </button>
              <button
                onClick={() => setActiveTab('personality')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'personality' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Persona & Audio
              </button>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">PBR R160 STUDIO</span>
          </div>

          {/* Tab 1: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1 uppercase tracking-wider font-mono">Gender Model</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setConfig({ ...config, gender: 'female' })}
                      className={`py-1 text-center rounded-md font-medium transition-all ${
                        config.gender === 'female' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, gender: 'male' })}
                      className={`py-1 text-center rounded-md font-medium transition-all ${
                        config.gender === 'male' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block mb-1 uppercase tracking-wider font-mono">Outfit Wardrobe</label>
                  <select
                    value={config.outfit}
                    onChange={(e) => setConfig({ ...config, outfit: e.target.value as CharacterOutfit })}
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="cyber_suit">Cyber Operative</option>
                    <option value="executive_formal">Executive Formal</option>
                    <option value="casual_tech">Casual Tech</option>
                    <option value="tactical_ops">Tactical Ops</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-slate-300 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hologramGlow}
                    onChange={(e) => setConfig({ ...config, hologramGlow: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Holographic Ground Pedestal</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.eyeTrackingEnabled}
                    onChange={(e) => setConfig({ ...config, eyeTrackingEnabled: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Eye Saccades</span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: Kinematic Animations */}
          {activeTab === 'actions' && (
            <div>
              <label className="text-slate-400 text-[10px] block mb-1.5 uppercase tracking-wider font-mono">Simulate Movement & Kinematic Actions</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'idle', label: 'Idle' },
                  { id: 'walking', label: 'Walk' },
                  { id: 'pointing', label: 'Point' },
                  { id: 'typing', label: 'Type' },
                  { id: 'speaking', label: 'Speak' },
                  { id: 'thinking', label: 'Think' },
                  { id: 'verifying', label: 'Verify' },
                  { id: 'emergency_halt', label: 'Halt' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => onActionTrigger && onActionTrigger(act.id as CharacterAction)}
                    className={`py-1 px-2 rounded-lg text-xs font-mono transition-all border ${
                      currentAction === act.id 
                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-semibold' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Persona & Audio */}
          {activeTab === 'personality' && (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1 uppercase tracking-wider font-mono">Persona Core</label>
                  <select
                    value={config.personality}
                    onChange={(e) => setConfig({ ...config, personality: e.target.value as CharacterPersonality })}
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="professional">Professional Diplomat</option>
                    <option value="analytical">Analytical Scientist</option>
                    <option value="creative">Creative Strategist</option>
                    <option value="friendly">Supportive Colleague</option>
                    <option value="security_focused">Cyber Sentinel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block mb-1 uppercase tracking-wider font-mono">Voice Pitch ({config.voicePitch.toFixed(2)})</label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.05"
                    value={config.voicePitch}
                    onChange={(e) => setConfig({ ...config, voicePitch: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
