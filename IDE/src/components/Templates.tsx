import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Copy, ChevronRight, Sparkles } from 'lucide-react';
import type { Template } from '../types';

interface TemplatesProps {
    onUseTemplate: (template: Template) => void;
}

export default function Templates({ onUseTemplate }: TemplatesProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', tool: 'chat', prompt: '' });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        if (window.electronAPI) {
            const saved = await window.electronAPI.getTemplates();
            setTemplates(saved || []);
        }
    };

    const saveTemplate = async () => {
        if (!newTemplate.name || !newTemplate.prompt) return;

        if (window.electronAPI) {
            const updated = await window.electronAPI.saveTemplate(newTemplate);
            setTemplates(updated);
            setNewTemplate({ name: '', tool: 'chat', prompt: '' });
            setShowForm(false);
        }
    };

    const deleteTemplate = async (id: number) => {
        if (window.electronAPI) {
            const updated = await window.electronAPI.deleteTemplate(id);
            setTemplates(updated);
        }
    };

    const tools = [
        { id: 'chat', name: 'Chat', emoji: '💬' },
        { id: 'content', name: 'Content', emoji: '✍️' },
        { id: 'code', name: 'Code', emoji: '💻' },
        { id: 'ideas', name: 'Ideas', emoji: '💡' },
        { id: 'summarize', name: 'Summarize', emoji: '📝' },
        { id: 'rewrite', name: 'Rewrite', emoji: '🔄' },
    ];

    return (
        <div className="flex-1 flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-6 py-4 border-b border-[#18181b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <FileText size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-[15px]">Templates</h1>
                        <p className="text-[#52525b] text-xs">{templates.length} saved prompts</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary py-2 px-3 text-sm"
                >
                    <Plus size={16} />
                    New Template
                </button>
            </header>

            {/* New Template Form */}
            {showForm && (
                <div className="p-4 border-b border-[#18181b] bg-[#0f0f12] animate-slide-up">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                placeholder="Template name..."
                                className="input"
                            />
                            <select
                                value={newTemplate.tool}
                                onChange={(e) => setNewTemplate({ ...newTemplate, tool: e.target.value })}
                                className="input"
                            >
                                {tools.map(t => (
                                    <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            value={newTemplate.prompt}
                            onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
                            placeholder="Enter your prompt template..."
                            className="textarea h-24"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowForm(false)} className="btn-secondary">
                                Cancel
                            </button>
                            <button onClick={saveTemplate} className="btn-primary">
                                <Sparkles size={16} />
                                Save Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Templates List */}
            <div className="flex-1 overflow-auto p-6">
                {templates.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                            <FileText size={28} className="text-violet-400" />
                        </div>
                        <h2 className="text-lg font-medium mb-2">No templates yet</h2>
                        <p className="text-[#52525b] text-sm mb-6 max-w-xs">
                            Save your favorite prompts as templates to reuse them quickly.
                        </p>
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            <Plus size={16} />
                            Create your first template
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto grid gap-3">
                        {templates.map((template) => {
                            const tool = tools.find(t => t.id === template.tool);
                            return (
                                <div
                                    key={template.id}
                                    className="card p-4 group hover:bg-[#18181b]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span>{tool?.emoji}</span>
                                                <h3 className="font-medium text-sm">{template.name}</h3>
                                                <span className="text-[10px] text-[#52525b] bg-[#27272a] px-2 py-0.5 rounded-full">
                                                    {tool?.name}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#71717a] line-clamp-2">{template.prompt}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onUseTemplate(template)}
                                                className="p-2 hover:bg-[#27272a] rounded-lg text-[#71717a] hover:text-white transition-colors"
                                                title="Use template"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(template.prompt)}
                                                className="p-2 hover:bg-[#27272a] rounded-lg text-[#71717a] hover:text-white transition-colors"
                                                title="Copy prompt"
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                onClick={() => deleteTemplate(template.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-[#71717a] hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
