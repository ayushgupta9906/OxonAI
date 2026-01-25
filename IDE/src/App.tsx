import { useState, useEffect } from 'react';

// Layout Components
import TitleBar from './components/TitleBar';
import ActivityBar from './components/ActivityBar';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';

// Sidebar Panels
import FileExplorer from './components/FileExplorer';
import SearchPanel from './components/SearchPanel';
import AIToolsPanel from './components/AIToolsPanel';
import SourceControl from './components/SourceControl';
import ExtensionsPanel from './components/ExtensionsPanel';
import Templates from './components/Templates';
import Settings from './components/Settings';
import AccountWidget from './components/AccountWidget';
import AgentSidebar from './components/agentic/AgentSidebar';

// AI Tools
import Chat from './components/tools/Chat';
import Content from './components/tools/Content';
import Code from './components/tools/Code';
import Ideas from './components/tools/Ideas';
import Summarize from './components/tools/Summarize';
import Rewrite from './components/tools/Rewrite';

// Agent
import ProjectGenerator from './components/agentic/ProjectGenerator';

// Editor
import CodeEditor from './components/CodeEditor';
import WelcomeTab from './components/WelcomeTab';

import type { Template } from './types';

type Panel = 'explorer' | 'search' | 'ai' | 'chat' | 'templates' | 'settings' | 'git' | 'extensions' | 'agent';
type View = 'welcome' | 'editor' | 'chat' | 'content' | 'code' | 'ideas' | 'summarize' | 'rewrite' | 'settings' | 'agent';

function App() {
    const [activePanel, setActivePanel] = useState<Panel>('explorer');
    const [activeView, setActiveView] = useState<View>('welcome');
    const [aiSettings, setAiSettings] = useState({ apiKey: '', huggingFaceApiKey: '', geminiApiKey: '', aiProvider: 'openai' });
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const [showAgentSidebar, setShowAgentSidebar] = useState(true);

    // Editor state
    const [openFiles, setOpenFiles] = useState<string[]>([]);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [rootPath] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            const mod = e.metaKey || e.ctrlKey;

            if (mod) {
                switch (e.key.toLowerCase()) {
                    case 'k': e.preventDefault(); setShowCommandPalette(true); break;
                    case 'b': e.preventDefault(); setSidebarWidth(prev => prev > 0 ? 0 : 260); break;
                    case '1': e.preventDefault(); setActiveView('chat'); break;
                    case '2': e.preventDefault(); setActiveView('content'); break;
                    case '3': e.preventDefault(); setActiveView('code'); break;
                    case '4': e.preventDefault(); setActiveView('ideas'); break;
                    case '5': e.preventDefault(); setActiveView('summarize'); break;
                    case '6': e.preventDefault(); setActiveView('rewrite'); break;
                    case ',': e.preventDefault(); setActivePanel('settings'); setActiveView('settings'); break;
                }
            }

            if (e.key === 'Escape') {
                setShowCommandPalette(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const loadSettings = async () => {
        if (window.electronAPI) {
            const settings = await window.electronAPI.getSettings();
            setAiSettings({
                apiKey: settings.apiKey || '',
                huggingFaceApiKey: settings.huggingFaceApiKey || '',
                geminiApiKey: settings.geminiApiKey || '',
                aiProvider: settings.aiProvider || 'openai'
            });
        }
    };

    const handleFileSelect = (path: string) => {
        if (!openFiles.includes(path)) {
            setOpenFiles(prev => [...prev, path]);
        }
        setCurrentFile(path);
        setActiveView('editor');
    };

    const handleFileClose = (path: string) => {
        setOpenFiles(prev => prev.filter(f => f !== path));
        if (currentFile === path) {
            const remaining = openFiles.filter(f => f !== path);
            setCurrentFile(remaining.length > 0 ? remaining[remaining.length - 1] : null);
            if (remaining.length === 0) setActiveView('welcome');
        }
    };

    const handleFileSave = async (path: string, content: string) => {
        if (window.electronAPI) {
            await window.electronAPI.writeFile(path, content);
        }
    };

    const handleToolSelect = (tool: string) => {
        setActiveView(tool as View);
    };

    const handleUseTemplate = (template: Template) => {
        setActiveView(template.tool as View);
    };

    const handlePanelChange = (panel: string) => {
        setActivePanel(panel as Panel);
        if (panel === 'settings') {
            setActiveView('settings');
        } else if (panel === 'agent') {
            setActiveView('agent');
        }
    };

    const handleNavigate = (page: string) => {
        if (['chat', 'content', 'code', 'ideas', 'summarize', 'rewrite'].includes(page)) {
            setActiveView(page as View);
        } else if (page === 'templates') {
            setActivePanel('templates');
        } else if (page === 'settings') {
            setActivePanel('settings');
            setActiveView('settings');
        }
    };

    const renderSidebarContent = () => {
        const content = (() => {
            switch (activePanel) {
                case 'explorer':
                    return <FileExplorer onFileSelect={handleFileSelect} currentFile={currentFile} />;
                case 'search':
                    return <SearchPanel onFileSelect={handleFileSelect} />;
                case 'git':
                    return <SourceControl rootPath={rootPath} />;
                case 'ai':
                    return <AIToolsPanel onToolSelect={handleToolSelect} apiKey={aiSettings.apiKey || aiSettings.huggingFaceApiKey} />;
                case 'chat':
                    return <Chat apiKey={aiSettings.aiProvider === 'huggingface' ? aiSettings.huggingFaceApiKey : aiSettings.apiKey} provider={aiSettings.aiProvider as any} />;
                case 'templates':
                    return <Templates onUseTemplate={handleUseTemplate} />;
                case 'extensions':
                    return <ExtensionsPanel />;
                case 'settings':
                    return null;
                default:
                    return <FileExplorer onFileSelect={handleFileSelect} currentFile={currentFile} />;
            }
        })();

        return (
            <div className="flex flex-col h-full">
                <div className="p-3 border-b border-[#3c3c3c]">
                    <AccountWidget />
                </div>
                <div className="flex-1 overflow-auto">
                    {content}
                </div>
            </div>
        );
    };

    const renderMainContent = () => {
        if (activeView === 'settings') {
            return <Settings onApiKeyUpdate={() => loadSettings()} />;
        }

        const currentKey = aiSettings.aiProvider === 'huggingface' ? aiSettings.huggingFaceApiKey : aiSettings.apiKey;

        if (!currentKey && !['welcome', 'editor', 'settings'].includes(activeView)) {
            return (
                <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
                    <div className="text-center max-w-md px-6">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                            <span className="text-3xl">🔑</span>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-white">API Key Required</h2>
                        <p className="text-[#a1a1aa] mb-6 text-sm">
                            Add your {aiSettings.aiProvider === 'huggingface' ? 'Hugging Face' : 'OpenAI'} API key in Settings to use AI features.
                        </p>
                        <button
                            onClick={() => { setActivePanel('settings'); setActiveView('settings'); }}
                            className="btn-primary px-6"
                        >
                            Open Settings
                        </button>
                    </div>
                </div>
            );
        }

        const props = {
            apiKey: currentKey,
            provider: aiSettings.aiProvider
        };

        switch (activeView) {
            case 'welcome':
                return <WelcomeTab onOpenFolder={() => { }} onOpenFile={() => { }} onNavigate={handleNavigate} />;
            case 'editor':
                return currentFile ? (
                    <CodeEditor
                        openFiles={openFiles}
                        currentFile={currentFile}
                        onFileChange={setCurrentFile}
                        onFileClose={handleFileClose}
                        onSave={handleFileSave}
                    />
                ) : (
                    <WelcomeTab onOpenFolder={() => { }} onOpenFile={() => { }} onNavigate={handleNavigate} />
                );
            case 'chat': return <Chat {...props} provider={props.provider as any} />;
            case 'content': return <Content {...props} provider={props.provider as any} />;
            case 'code': return <Code {...props} provider={props.provider as any} />;
            case 'ideas': return <Ideas {...props} provider={props.provider as any} />;
            case 'summarize': return <Summarize {...props} provider={props.provider as any} />;
            case 'rewrite': return <Rewrite {...props} provider={props.provider as any} />;
            case 'agent': return <ProjectGenerator />;
            default:
                return <WelcomeTab onOpenFolder={() => { }} onOpenFile={() => { }} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
            {/* Title Bar */}
            <TitleBar />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Activity Bar */}
                <ActivityBar
                    activePanel={activePanel}
                    onPanelChange={handlePanelChange}
                    showTerminal={false}
                    onToggleTerminal={() => { }}
                    showAgentSidebar={showAgentSidebar}
                    onToggleAgentSidebar={() => setShowAgentSidebar(!showAgentSidebar)}
                />

                {/* Sidebar */}
                {sidebarWidth > 0 && activePanel !== 'settings' && (
                    <div
                        className="bg-[#252526] border-r border-[#3c3c3c] flex flex-col overflow-hidden"
                        style={{ width: sidebarWidth }}
                    >
                        {renderSidebarContent()}
                    </div>
                )}

                {/* Main View */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {renderMainContent()}
                </div>

                {/* Agent Sidebar */}
                {showAgentSidebar && (
                    <AgentSidebar onClose={() => setShowAgentSidebar(false)} />
                )}
            </div>

            {/* Status Bar */}
            <StatusBar currentFile={currentFile} />

            {/* Command Palette */}
            <CommandPalette
                isOpen={showCommandPalette}
                onClose={() => setShowCommandPalette(false)}
                onNavigate={handleNavigate}
            />
        </div>
    );
}

export default App;
