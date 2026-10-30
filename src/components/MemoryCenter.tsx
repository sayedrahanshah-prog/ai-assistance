/**
 * Long-Term Memory & Personalization Center
 * Vector embeddings emulator, semantic search, episodic memory retention,
 * user-controlled deletion, and memory export.
 */

import React, { useState } from 'react';
import { MemoryItem } from '../types/agent';
import { 
  Database, 
  Search, 
  Trash2, 
  Download, 
  Plus, 
  Tag, 
  Clock, 
  Shield, 
  FileText, 
  Sliders,
  CheckCircle,
  Brain
} from 'lucide-react';

interface MemoryCenterProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'lastAccessed'>) => void;
  onDeleteMemory: (memoryId: string) => void;
  onClearExpired: () => void;
}

export const MemoryCenter: React.FC<MemoryCenterProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  onClearExpired,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('preference');
  const [newTags, setNewTags] = useState('agent, rule');

  const filteredMemories = memories.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aetheris_memory_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddMemory({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      confidence: 0.96,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl cyber-glass border border-cyan-500/20 p-4 overflow-hidden shadow-2xl">
      
      {/* Header & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>Long-Term Memory & Vector Knowledge Base</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">
              HNSW VECTOR INDEX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicitly authorized facts, personal preferences, project context, and operational rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory Fact</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Semantic vector search across memories..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {['all', 'preference', 'project', 'credential', 'workflow', 'context'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all border ${
                selectedCategory === cat
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-200 leading-snug">{mem.title}</span>
                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  title="Delete Memory"
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                {mem.content}
              </p>

              <div className="flex flex-wrap gap-1 mb-2">
                {mem.tags.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-purple-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              <span className="capitalize text-slate-400">CATEGORY: {mem.category}</span>
              <span>Vector Score: {(mem.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MEMORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSaveMemory} className="w-full max-w-lg rounded-2xl bg-[#0a0f1d] border border-purple-500/40 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Inject Long-Term Memory Record</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">TITLE</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Social Media Publishing Guideline"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="preference">Personal Preference</option>
                  <option value="project">Project Context</option>
                  <option value="workflow">Workflow Rule</option>
                  <option value="credential">Authorized Credentials</option>
                  <option value="context">Business Information</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">MEMORY CONTENT & CONTEXT</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Provide detailed instruction or preference..."
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Store in Vector DB
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
