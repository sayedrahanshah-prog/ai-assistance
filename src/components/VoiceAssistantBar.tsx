/**
 * Voice Assistant & Speech Synthesis Engine
 * Web Speech Recognition, SpeechSynthesis with viseme lip-sync callback,
 * and audio wave visualizer.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Square,
  Radio,
  Command
} from 'lucide-react';

interface VoiceAssistantBarProps {
  onCommandSubmit: (commandText: string) => void;
  isProcessing: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onVisemeUpdate?: (intensity: number) => void;
  onEmergencyStop: () => void;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  onCommandSubmit,
  isProcessing,
  onSpeechStart,
  onSpeechEnd,
  onVisemeUpdate,
  onEmergencyStop,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Quick preset voice commands
  const quickCommands = [
    "Open Instagram and upload my new post",
    "Create an AI Research Agent for cyber intelligence",
    "Open VS Code and run the test suite",
    "Prepare a weekly business performance report",
  ];

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }

        setInputText(transcript);

        // Auto trigger if final result
        if (event.results[event.results.length - 1].isFinal) {
          onCommandSubmit(transcript);
          setIsListening(false);
          recognition.stop();
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onCommandSubmit]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechFeedback('Microphone API not supported in this browser. Please type commands below.');
      setTimeout(() => setSpeechFeedback(''), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setSpeechFeedback('Listening... Say "Hey Aetheris" or your command.');
      } catch (e) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onCommandSubmit(inputText.trim());
    setInputText('');
  };

  // Waveform canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isListening ? '#22d3ee' : isProcessing ? '#a855f7' : '#334155';

      const amplitude = isListening ? 12 : isProcessing ? 6 : 2;
      const frequency = isListening ? 0.08 : 0.04;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      phase += isListening ? 0.15 : 0.05;
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, [isListening, isProcessing]);

  return (
    <div className="w-full rounded-2xl cyber-glass border border-cyan-500/25 p-3.5 shadow-xl">
      
      {/* Voice Status & Quick Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>VOICE ENGINE: {isListening ? 'ACTIVE LISTENING' : 'READY'}</span>
          </div>

          <canvas ref={canvasRef} width={90} height={24} className="rounded-lg bg-slate-950/40" />
        </div>

        {/* Quick Voice Command Pills */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 text-[10px] flex items-center gap-1">
            <Command className="w-3 h-3" /> PRESETS:
          </span>
          {quickCommands.slice(0, 2).map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => onCommandSubmit(cmd)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 truncate max-w-[240px] transition-all"
            >
              "{cmd}"
            </button>
          ))}
        </div>

        {/* Audio Mute & Emergency Stop */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Voice Synthesis" : "Mute Voice Synthesis"}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-all text-xs"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onEmergencyStop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-semibold transition-all shadow-sm"
          >
            <Square className="w-3 h-3 fill-rose-400 text-rose-400" />
            <span>HALT</span>
          </button>
        </div>
      </div>

      {/* Main Command Input Field with Mic Button */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_16px_#22d3ee]' 
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-cyan-400'
          }`}
          title="Click to speak command"
        >
          {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Speak or enter command: 'Open Instagram and upload my new post'..."}
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 font-sans shadow-inner pr-12"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 top-2 p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Voice feedback line */}
      {speechFeedback && (
        <p className="mt-1.5 text-[11px] font-mono text-cyan-400 animate-fade-in pl-2">
          {speechFeedback}
        </p>
      )}

    </div>
  );
};
