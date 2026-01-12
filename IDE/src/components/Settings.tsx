import { useState, useEffect, useRef } from 'react';
import {
    Settings as SettingsIcon,
    Palette,
    Type,
    Terminal,
    Keyboard,
    Plug,
    User,
    Save,
    Check,
    Sun,
    Moon,
    Monitor
} from 'lucide-react';

interface SettingsProps {
    onApiKeyUpdate?: (key: string) => void;
}

interface SettingsCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const categories: SettingsCategory[] = [
    { id: 'general', name: 'General', icon: <SettingsIcon size={16} /> },
    { id: 'appearance', name: 'Appearance', icon: <Palette size={16} /> },
    { id: 'editor', name: 'Editor', icon: <Type size={16} /> },
    { id: 'terminal', name: 'Terminal', icon: <Terminal size={16} /> },
    { id: 'keybindings', name: 'Keyboard Shortcuts', icon: <Keyboard size={16} /> },
    { id: 'extensions', name: 'Extensions', icon: <Plug size={16} /> },
    { id: 'account', name: 'Account & API', icon: <User size={16} /> },
];

export default function Settings({ onApiKeyUpdate }: SettingsProps) {
    const [activeCategory, setActiveCategory] = useState('general');
    const [settings, setSettings] = useState({
        // General
        autoSave: true,
        autoSaveDelay: 1000,
        // Appearance
        theme: 'dark',
        accentColor: 'purple',
        iconTheme: 'seti',
        // Editor
        fontSize: 14,
        fontFamily: 'Fira Code',
        lineHeight: 1.5,
        tabSize: 2,
        wordWrap: true,
        minimap: true,
        lineNumbers: true,
        cursorStyle: 'line',
        cursorBlinking: 'smooth',
        // Terminal
        terminalFontSize: 13,
        terminalFontFamily: 'Cascadia Code',
        shellPath: 'powershell.exe',
        // API
        apiKey: '', // OpenAI Key
        huggingFaceApiKey: '',
        geminiApiKey: '',
        aiProvider: 'openai', // 'openai' | 'huggingface' | 'gemini'
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        if (window.electronAPI) {
            const stored = await window.electronAPI.getSettings();
            setSettings(prev => ({ ...prev, ...stored }));
        }
    };

    const saveSettings = async () => {
        if (window.electronAPI) {
            await window.electronAPI.saveSettings(settings as any);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            if (onApiKeyUpdate && settings.apiKey) {
                onApiKeyUpdate(settings.apiKey);
            }
        }
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <SettingItem
                title="Auto Save"
                description="Save files automatically after changes"
            >
                <Toggle checked={settings.autoSave} onChange={(v) => updateSetting('autoSave', v)} />
            </SettingItem>

            <SettingItem
                title="Auto Save Delay"
                description="Delay in milliseconds before auto-saving"
            >
                <select
                    value={settings.autoSaveDelay}
                    onChange={(e) => updateSetting('autoSaveDelay', Number(e.target.value))}
                    className="input py-1.5 w-32"
                >
                    <option value={500}>500ms</option>
                    <option value={1000}>1s</option>
                    <option value={2000}>2s</option>
                    <option value={5000}>5s</option>
                </select>
            </SettingItem>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <SettingItem
                title="Theme"
                description="Select the color theme for the IDE"
            >
                <div className="flex gap-2">
                    {[
                        { id: 'dark', icon: <Moon size={14} />, label: 'Dark' },
                        { id: 'light', icon: <Sun size={14} />, label: 'Light' },
                        { id: 'system', icon: <Monitor size={14} />, label: 'System' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => updateSetting('theme', t.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${settings.theme === t.id
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                : 'bg-[#18181b] border border-[#27272a] text-[#71717a] hover:text-white'
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>
            </SettingItem>

            <SettingItem
                title="Accent Color"
                description="Primary accent color used throughout the IDE"
            >
                <div className="flex gap-2">
                    {['purple', 'blue', 'green', 'pink', 'orange'].map((color) => (
                        <button
                            key={color}
                            onClick={() => updateSetting('accentColor', color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${settings.accentColor === color ? 'border-white scale-110' : 'border-transparent'
                                }`}
                            style={{ backgroundColor: `var(--color-${color}-500, ${color})` }}
                        />
                    ))}
                </div>
            </SettingItem>
        </div>
    );

    const renderEditorSettings = () => (
        <div className="space-y-6">
            <SettingItem title="Font Size" description="Editor font size in pixels">
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min={10}
                        max={24}
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-sm text-white w-8">{settings.fontSize}px</span>
                </div>
            </SettingItem>

            <SettingItem title="Font Family" description="Editor font family">
                <select
                    value={settings.fontFamily}
                    onChange={(e) => updateSetting('fontFamily', e.target.value)}
                    className="input py-1.5 w-48"
                >
                    <option>Fira Code</option>
                    <option>Cascadia Code</option>
                    <option>JetBrains Mono</option>
                    <option>Monaco</option>
                    <option>Consolas</option>
                </select>
            </SettingItem>

            <SettingItem title="Tab Size" description="Number of spaces per tab">
                <select
                    value={settings.tabSize}
                    onChange={(e) => updateSetting('tabSize', Number(e.target.value))}
                    className="input py-1.5 w-24"
                >
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                </select>
            </SettingItem>

            <SettingItem title="Word Wrap" description="Wrap long lines">
                <Toggle checked={settings.wordWrap} onChange={(v) => updateSetting('wordWrap', v)} />
            </SettingItem>

            <SettingItem title="Minimap" description="Show code minimap">
                <Toggle checked={settings.minimap} onChange={(v) => updateSetting('minimap', v)} />
            </SettingItem>

            <SettingItem title="Line Numbers" description="Show line numbers">
                <Toggle checked={settings.lineNumbers} onChange={(v) => updateSetting('lineNumbers', v)} />
            </SettingItem>
        </div>
    );

    const renderTerminalSettings = () => (
        <div className="space-y-6">
            <SettingItem title="Font Size" description="Terminal font size in pixels">
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min={10}
                        max={20}
                        value={settings.terminalFontSize}
                        onChange={(e) => updateSetting('terminalFontSize', Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-sm text-white w-8">{settings.terminalFontSize}px</span>
                </div>
            </SettingItem>

            <SettingItem title="Default Shell" description="Shell to use for new terminals">
                <select
                    value={settings.shellPath}
                    onChange={(e) => updateSetting('shellPath', e.target.value)}
                    className="input py-1.5 w-48"
                >
                    <option value="powershell.exe">PowerShell</option>
                    <option value="cmd.exe">Command Prompt</option>
                    <option value="bash">Git Bash</option>
                    <option value="wsl.exe">WSL</option>
                </select>
            </SettingItem>
        </div>
    );

    const renderKeybindingsSettings = () => (
        <div className="space-y-4">
            <p className="text-sm text-[#71717a] mb-4">Customize keyboard shortcuts</p>

            <div className="space-y-2">
                {[
                    { command: 'Command Palette', shortcut: 'Ctrl+K' },
                    { command: 'Toggle Sidebar', shortcut: 'Ctrl+B' },
                    { command: 'Open File', shortcut: 'Ctrl+O' },
                    { command: 'Save File', shortcut: 'Ctrl+S' },
                    { command: 'Find', shortcut: 'Ctrl+F' },
                    { command: 'Replace', shortcut: 'Ctrl+H' },
                    { command: 'Toggle Terminal', shortcut: 'Ctrl+`' },
                    { command: 'New Terminal', shortcut: 'Ctrl+Shift+`' },
                ].map((kb) => (
                    <div key={kb.command} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#18181b]">
                        <span className="text-sm text-[#a1a1aa]">{kb.command}</span>
                        <kbd className="px-2 py-1 bg-[#27272a] rounded text-xs font-mono text-[#71717a]">{kb.shortcut}</kbd>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAccountSettings = () => {
        const [loggingIn, setLoggingIn] = useState(false);
        const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        useEffect(() => {
            // Deep link auth is now handled automatically by main.js
            // No need to exchange code here - main.js does it and stores user data
            // This effect just listens for when the user data is updated
            /* DISABLED - main.js handles deep links automatically
            if (window.electronAPI) {
                window.electronAPI.onAuthCodeReceived(async (code: string) => {
                    // Clear any pending timeout
                    if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);

                    setLoggingIn(true);
                    try {
                        const result = await window.electronAPI.exchangeAuthCode(code);
                        if (result.success && result.user) {
                            updateSetting('oxonUser', result.user);
                            await saveSettings();
                            alert(`Successfully logged in as ${result.user.email}\\nPlan: ${result.user.plan}`);
                        } else {
                            alert(`Login failed: ${result.error}`);
                        }
                    } catch (err: any) {
                        alert(`Error: ${err.message}`);
                    } finally {
                        setLoggingIn(false);
                    }
                });
            }
            */
        }, []);

        const handleOAuthLogin = async () => {
            if (!window.electronAPI) {
                alert('OAuth login is only available in the desktop app');
                return;
            }
            setLoggingIn(true);

            // Set timeout to cancel authentication after 2 minutes
            authTimeoutRef.current = setTimeout(() => {
                setLoggingIn(false);
                alert('Authentication timeout. Please try again.');
            }, 2 * 60 * 1000); // 2 minutes

            try {
                await window.electronAPI.oauthLogin();
                // The rest is handled by the deep link callback
                // If successful, the callback will clear the timeout
            } catch (err: any) {
                if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
                alert(`Failed to open login page: ${err.message}`);
                setLoggingIn(false);
            }
        };

        const handleLogout = () => {
            updateSetting('oxonUser', null);
            saveSettings();
        };

        return (
            <div className="space-y-6">
                {/* OxonAI Account */}
                <div className="p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <span className="text-purple-400">🔗</span>
                        OxonAI Account
                    </h3>

                    {!(settings as any).oxonUser ? (
                        <>
                            <p className="text-xs text-[#a1a1aa] mb-4">
                                Sign in to sync your plan and unlock premium features.
                            </p>
                            <button
                                onClick={handleOAuthLogin}
                                disabled={loggingIn}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loggingIn ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span>
                                        Sign in with OxonAI
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-gray-500 mt-2 text-center">
                                Opens browser to authenticate securely
                            </p>

                            {/* Manual code input fallback */}
                            <div className="mt-4 pt-4 border-t border-purple-500/20">
                                <p className="text-xs text-[#a1a1aa] mb-2">
                                    Or paste your auth code manually:
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="manual-auth-code"
                                        placeholder="ide_..."
                                        className="flex-1 px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                                        onKeyPress={async (e) => {
                                            if (e.key === 'Enter') {
                                                const input = e.currentTarget;
                                                const code = input.value.trim();
                                                if (code && window.electronAPI) {
                                                    // Clear any pending timeout
                                                    if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
                                                    setLoggingIn(true);
                                                    try {
                                                        const result = await window.electronAPI.exchangeAuthCode(code);
                                                        if (result.success && result.user) {
                                                            updateSetting('oxonUser', result.user);
                                                            await saveSettings();
                                                            alert(`Successfully logged in as ${result.user.email}\\nPlan: ${result.user.plan}`);
                                                            input.value = '';
                                                        } else {
                                                            alert(`Login failed: ${result.error}`);
                                                        }
                                                    } catch (err: any) {
                                                        alert(`Error: ${err.message}`);
                                                    } finally {
                                                        setLoggingIn(false);
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-lg transition"
                                        onClick={async () => {
                                            const input = document.getElementById('manual-auth-code') as HTMLInputElement;
                                            const code = input?.value.trim();
                                            if (code && window.electronAPI) {
                                                // Clear any pending timeout
                                                if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
                                                setLoggingIn(true);
                                                try {
                                                    const result = await window.electronAPI.exchangeAuthCode(code);
                                                    if (result.success && result.user) {
                                                        updateSetting('oxonUser', result.user);
                                                        await saveSettings();
                                                        alert(`Successfully logged in as ${result.user.email}\\nPlan: ${result.user.plan}`);
                                                        input.value = '';
                                                    } else {
                                                        alert(`Login failed: ${result.error}`);
                                                    }
                                                } catch (err: any) {
                                                    alert(`Error: ${err.message}`);
                                                } finally {
                                                    setLoggingIn(false);
                                                }
                                            }
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    Get the code from the browser after clicking sign in
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-xs text-green-400 flex items-center gap-2">
                                    <span>✓</span>
                                    Signed in as {(settings as any).oxonUser.email}
                                </p>
                                <p className="text-xs text-green-400 mt-1">
                                    Plan: <span className="font-bold">{(settings as any).oxonUser.plan}</span>
                                </p>
                                {(settings as any).oxonUser.credits !== undefined && (
                                    <p className="text-xs text-green-400 mt-1">
                                        Credits: {(settings as any).oxonUser.credits}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Provider */}
                <SettingItem
                    title="AI Provider"
                    description="Choose which AI service to use"
                >
                    <select
                        value={settings.aiProvider || 'openai'}
                        onChange={(e) => updateSetting('aiProvider', e.target.value)}
                        className="input py-1.5 w-64"
                    >
                        <option value="openai">OpenAI (GPT-4o Mini)</option>
                        <option value="huggingface">Hugging Face (Free/Mistral)</option>
                        <option value="gemini">Google Gemini (Flash)</option>
                    </select>
                </SettingItem>

                {settings.aiProvider === 'openai' && (
                    <SettingItem
                        title="OpenAI API Key"
                        description="Your OpenAI API key for AI features"
                    >
                        <input
                            type="password"
                            value={settings.apiKey}
                            onChange={(e) => updateSetting('apiKey', e.target.value)}
                            placeholder="sk-..."
                            className="input py-1.5 w-64"
                        />
                    </SettingItem>
                )}

                {settings.aiProvider === 'huggingface' && (
                    <SettingItem
                        title="Hugging Face API Key"
                        description="Optional: Use your own HF Token"
                    >
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                value={settings.huggingFaceApiKey || ''}
                                onChange={(e) => updateSetting('huggingFaceApiKey', e.target.value)}
                                placeholder="Current mode: Free (Built-in Key)"
                                className="input py-1.5 w-64"
                            />
                            <p className="text-[10px] text-emerald-400">
                                * We use a built-in key for free access, but you can add yours for better limits.
                            </p>
                        </div>
                    </SettingItem>
                )}

                {settings.aiProvider === 'gemini' && (
                    <SettingItem
                        title="Gemini API Key"
                        description="Your Google Gemini API Key"
                    >
                        <input
                            type="password"
                            value={settings.geminiApiKey || ''}
                            onChange={(e) => updateSetting('geminiApiKey', e.target.value)}
                            placeholder="AIza..."
                            className="input py-1.5 w-64"
                        />
                    </SettingItem>
                )}

                <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a]">
                    <h3 className="text-sm font-medium mb-2">About OxonAI IDE</h3>
                    <p className="text-xs text-[#71717a]">Version 1.0.0</p>
                    <p className="text-xs text-[#71717a] mt-1">Built with ❤️ using Electron + React</p>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeCategory) {
            case 'general': return renderGeneralSettings();
            case 'appearance': return renderAppearanceSettings();
            case 'editor': return renderEditorSettings();
            case 'terminal': return renderTerminalSettings();
            case 'keybindings': return renderKeybindingsSettings();
            case 'account': return renderAccountSettings();
            default: return <p className="text-[#71717a]">Coming soon...</p>;
        }
    };

    return (
        <div className="flex-1 flex bg-[#0f0f12] animate-fade-in">
            {/* Sidebar */}
            <div className="w-56 border-r border-[#27272a] py-4">
                <div className="px-4 mb-4">
                    <h2 className="text-lg font-semibold">Settings</h2>
                </div>
                <nav className="space-y-1 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat.id
                                ? 'bg-purple-500/10 text-white'
                                : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#18181b]'
                                }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-2xl mx-auto p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold capitalize">{activeCategory} Settings</h2>
                        <button onClick={saveSettings} className="btn-primary py-2">
                            {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save</>}
                        </button>
                    </div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

// Setting Item Component
function SettingItem({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-3 border-b border-[#27272a]">
            <div>
                <h4 className="text-sm font-medium text-white">{title}</h4>
                <p className="text-xs text-[#52525b] mt-0.5">{description}</p>
            </div>
            <div>{children}</div>
        </div>
    );
}

// Toggle Component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-purple-500' : 'bg-[#3f3f46]'
                }`}
        >
            <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-5' : 'left-1'
                    }`}
            />
        </button>
    );
}
